---
title: "CentOS 7系統時間設定與NTP同步"
date: 2019-03-02T23:01:20+08:00
draft: true
categories: ["tech"]
tags: ["centos","ntp"]
---

設定系統時間基本上是我每次登陸新VM上的首要任務。如果系統時間不好好設定的話，以後server運行和數據庫紀錄就會變得一團糟，所有依賴該主機的開發測試工作都變難，很容易誤以為是程式的bug......

來動手開始吧

首先讓我們設定系統時區
```sh
timedatectl set-timezone Asia/Hong_Kong
```

然後安裝ntp服務
```sh
yum install -y ntp
```

再來把系統時間與香港天文台對齊
```sh
ntpdate stdtime.gov.hk
```

我們希望能夠利用ntpd不時同歩系統時間，不受當機或潤秒等影響。打開/etc/ntp.conf編輯
```sh
vi /etc/ntp.conf
```

加入以下設定
```txt
server ntpdate stdtime.gov.hk iburst
```

最後啟用ntpd, 並且會隨系統重啟而自啟動
```sh
systemctl enable ntpd && systemctl start ntpd
```

順帶一提，如果你有玩Docker，牠的container timezone預設是UTC+0，記得校正噢～
