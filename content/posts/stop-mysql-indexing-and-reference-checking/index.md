---
title: "暫停MySQL索引更新和參照檢查"
date: 2019-10-26T11:00:41+08:00
draft: false
categories: ["tech"]
tags: ["mysql", "indexing"]
---

在MySQL數據庫處理資料時，系統會為每行資料逐一檢查其外鍵(Foreign Key Check)和更新表格索引(Indexing)，對於大量的資料滙入或更新會帶來更長的執行時間。這時我們更希望是在所有資料寫入以後才一次性地進行檢查和索引更新。

<!--more-->

[上一篇](/posts/repair-mysql-data-using-binlog)寫了如何使用binlog修復MySQL，如果需要執行非常多的`INSERT`/`UPDATE` query，建議先為涉及的table停用indexes以及外鍵檢查，如此將可節省大量時間：

#### 檢查表格索引狀態

```sql
SHOW INDEX FROM `table_name`;
```

#### 停用表格索引

```sql
ALTER TABLE `table_name` DISABLE KEYS;
```

#### 停用外鍵檢查 (For InnoDB only)

```sql
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET AUTOCOMMIT = 0;
```

#### 重啟外鍵檢查 (For InnoDB only)

```sql
SET UNIQUE_CHECKS = 1;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
```

#### 重啟表格索引

```sql
ALTER TABLE `table_name` ENABLE KEYS;
```

參考: https://support.tigertech.net/mysql-large-inserts
