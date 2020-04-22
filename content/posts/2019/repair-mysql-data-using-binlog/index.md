---
title: "利用binlog修復MySQL"
date: 2019-10-01T18:06:19+08:00
draft: false
categories: ["database", "devops"]
tags: ["mysql", "binlog", "sql"]
---

最近因為一次手殘剷除了production主機上的MySQL數據庫，需要從最近時間點的備份中還原，並且從binlog中提取該時間點後的部分重要query重新執行，以盡可能回復原狀。

<!--more-->

若想了解binlog的構造，美團有一篇不錯的技術文︰[https://tech.meituan.com/2017/11/17/mysql-flashback.html](https://tech.meituan.com/2017/11/17/mysql-flashback.html)

> Update 2020-04-22
>
> 看到另一種更高技能點的修復方法，是直接從MySQL進程手上找回數據：[https://mp.weixin.qq.com/s/CbHNnxq2Qx290SEfz1HjWQ](https://mp.weixin.qq.com/s/CbHNnxq2Qx290SEfz1HjWQ)

### 相關文件路徑﹙CentOS 7，MySQL 5.7﹚︰

- MySQL設定檔︰/etc/my.cnf
- binlog文件路徑︰/var/lib/mysql﹙以設定檔內記載為準﹚

### 前設條件

1. MySQL本身有啟用[binlog](https://dev.mysql.com/doc/refman/5.7/en/replication-howto-masterbaseconfig.html)，否則只能從備份還原；
2. 手上持有最近的備份﹙假設是用`mysqldump`做備份﹚，並知道該備份的創建時間；
3. binlog文件會因為過期或超出數量限制而被自動銷毀，所以要先確認現時最舊的binlog的創建時間，必須先於你手上的備份的創建時間，以確保沒有真空期。

### 準備操作

1. 先從最近時間點的備份中還原。
2. 找出最接近該備份時間的binlog。
   例如︰備份的創建時間是 2019-10-01 09:30，則找出一個binlog其創建時間最接近而又不大於2019-10-01 09:30。
   由這個binlog開始，以及往後的所有binlog都是即將要進行操作的對象。
3. [`mysqlbinlog`](https://dev.mysql.com/doc/refman/5.7/en/mysqlbinlog.html)指令通常已跟隨MySQL一並安裝到主機，而[`awk`](https://en.wikipedia.org/wiki/AWK)指令若不可用請透過包管理器安裝。

### 提取binlog中的query

假設第一個要進行操作的binlog名為`mysql-bin.0011`，可使用`mysqlbinlog`轉化成純文字sql檔︰

```sh
mysqlbinlog -v mysql-bin.0011 > mysql-0011.sql
```

如果你打算重新執行所有query，在備份中找出MASTER_LOG_POS，由這個位置開始讀取︰

```sh
mysqlbinlog -j <MASTER_LOG_POS> -v mysql-bin.0011 > mysql-0011.sql
```

若我們只想提取對`table_1` table有影響的 query，可使用`awk`作過濾︰

```sh
mysqlbinlog -v mysql-bin.0011 | awk '/table_1/,/;/' > mysql-0011.buy.sql
```

> 由於`mysqlbinlog`輸出的每條query都佔據多行，需要支援跨行模式識別的`awk`而非`grep`。

較普遍的情況是我們需要處理大量binlog文件，可使用`*`號省略文件範圍︰

```sh
# mysql-bin.0010 ~ mysql-bin.0019
mysqlbinlog -v mysql-bin.001* | awk '/table_1/,/;/' > mysql-0089.buy.sql
```

即使table的主鍵是使用AUTO_INCREMENT，輸出的INSERT語句的主鍵值都是確定的，這可避免修復時的一些誤操作。

> 這裡可找到更多使用`mysqlbinlog`的方法：http://www.ttlsa.com/mysql/super-useful-mysqlbinlog-command/

### 大型.sql 文件檢視及編輯

有時候你可能需要對備份或由`mysqlbinlog`輸出的大型.sql文件進行人工檢視或修改，若資訊量太大，可試用以下工具開啟檔案︰

1. [EmEditor](https://www.emeditor.com/), up to 248 GB or 2.1 billion lines (30 日免費試用)
2. [Large File Editor (liquid studio)](https://www.liquid-technologies.com/large-file-editor), In principle its over 9000 petabytes

### 重新執行 query 之前

建議你在執行上面提取出的.sql文件之前打開看一看內容，確保︰

1. 每條query是格式正確的﹙`awk`有機會因為匹配錯誤而輸出非預期的結果﹚；
2. 首條query是在備份時間點後出現﹙視乎提取方法你可能需要移除部分 query﹚；
3. 各 table 的首條 INSERT query 的主鍵沒有重複出現在備份上﹙duplicate entry﹚；
4. 對於有時間截欄位的table, 例如包含`created_at`、`updated_at`欄位的table，從它的INSERT query, UPDATE query中出現的時間值去再次確保該段query未曾執行在備份數據上。

### 暫停索引和外鍵檢查

如果query數量很多，可參考[下一篇](/posts/2019/stop-mysql-indexing-and-reference-checking)暫停索引和外鍵檢查。

### 執行query

調整好.sql文件後，你可以使用`mysql`執行這些query︰

```sh
mysql -u root -p < mysql-0011.buy.sql
```

> 如果你暫停了索引和外鍵檢查，別忘記執行完成後要重啟這兩項喔～

### 防呆措施

若遇上類似情況，人手操作是不可避免的。故此須要從習慣改變︰

1. 對所有數據庫檔案操作，盡可能避免使用`rm`指令
2. 以[`trash-cli`](https://github.com/andreafrancia/trash-cli)取代`rm`
3. 當數據庫主機容量不足時(或預計使用`trash-cli`所需的空間不足時)，先增加其儲存容量
4. 重建數據庫前除了考慮數據本身佔用之容量，同時亦需要考慮其建構indexes時臨時佔用之容量﹙一般不大於數據本身﹚
5. 執行需時較長的query時，可考慮使用[mosh](https://mosh.org/)、[tmux](https://github.com/tmux/tmux)以保持當前SSH session，避免因網絡問題或宕機等意外而導致執行失敗
