---
title: "CentOS 7安裝MySQL 5.7"
date: 2019-03-04T10:38:14+08:00
draft: false
categories: ["devops"]
tags: ["centos","mysql"]
---

由於現在整個官網都是MySQL 8.x，這裡記一下安裝MySQL 5.7的方法。

<!--more-->

先把官網repo設定到yum
```sh
yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
```

然後安裝套件
```sh
yum install mysql-community-server
```

啟動MySQL
```sh
service mysqld start
```

從/var/log/mysqld.log抓取root密碼。這是安裝時臨時設置的密碼，我們會在下一步修改
```sh
grep 'A temporary password' /var/log/mysqld.log |tail -1
```

執行mysql_secure_installation，然後你會進入一個輪詢式對話
```sh
/usr/bin/mysql_secure_installation
```

在對話中，先輸入上面得到的臨時root密碼，然後更新成你自己的root密碼。
再來會詢問你要不要移除匿名賬號、遠端登入、測試用數據庫等等，一路按Yes就是了。

另外，可以在這個參考裡找到更多如CentOS 6、Fedora 25-27的安裝姿勢: {{<blanklink href="https://tecadmin.net/install-mysql-5-7-centos-rhel/">}}
