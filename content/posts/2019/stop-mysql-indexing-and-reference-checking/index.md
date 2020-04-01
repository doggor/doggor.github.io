---
title: "暫停MySQL索引更新和參照檢查"
date: 2019-10-26T11:00:41+08:00
draft: false
categories: ["database", "devops"]
tags: ["mysql", "indexing"]
---

在MySQL數據庫處理資料時，InnoDB會為每行資料逐一檢查其外鍵(Foreign Key Check)，而MyISAM則更新表格索引(Indexing)，對於大量的資料滙入或更新會帶來更長的執行時間。這時我們更希望是在所有資料寫入以後才一次性地進行檢查和索引更新。

<!--more-->

[上一篇](/posts/2019/repair-mysql-data-using-binlog)寫了如何使用binlog修復MySQL，如果需要執行非常多的`INSERT`/`UPDATE` query，建議先為涉及的table停用indexes或外鍵檢查，如此將可節省大量時間。

### MyISAM

對於使用MyISAM的表格，暫停索引重建：

```sql
ALTER TABLE `table_name` DISABLE KEYS;
```

檢查表格索引狀態：

```sql
SHOW INDEX FROM `table_name`;
```

重啟表格索引：

```sql
ALTER TABLE `table_name` ENABLE KEYS;
```

### InnoDB

對於使用InnoDB的表格，暫停富前session的外鍵檢查、唯一性檢查，以及自動提交模式：

```sql
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET AUTOCOMMIT = 0;
```

重啟外鍵檢查、唯一性檢查，以及自動提交模式：

```sql
SET UNIQUE_CHECKS = 1;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT; //確保變更提交
SET AUTOCOMMIT = 1;
```

參考: https://support.tigertech.net/mysql-large-inserts
