---
title: "用cronjob解決puppeteer_dev_profile殘留問題"
date: 2019-12-05T22:02:16+08:00
draft: false
categories: ["tech"]
tags: ["nodejs", "puppeteer", "headless-chrome"]
---

puppeteer_dev_profile是透過puppeteer操作Headless Chrome時會在 /tmp 自動產生的資料夾。倘若程序沒有正確關閉chrome進程﹐/tmp/puppeteer_dev_profile-* 將無法自動回收並殘留在檔案系統上，佔用不必要的硬盤空間。

<!--more-->

{{<figure src="/posts/remove-puppeteer-dev-profiles/screenshot.png" link="posts/remove-puppeteer-dev-profiles/screenshot.png" target="_blank">}}

Github上已有人提出[這個問題](https://github.com/puppeteer/puppeteer/issues/1791)，而其[解決方法](https://github.com/puppeteer/puppeteer/issues/1791#issuecomment-367715074)是程序在關閉headless chrome後接著移除相關文件夾。

辦法不錯，前提是完成任務後需要主動關閉chrome，而且在移除puppeteer_dev_profile之前要祈求程序不要崩潰。🙏

可惜今次我這邊的是長時間運行的web service，chrome不會關 ，使用pm2管理程序重啟，想簡單一點移除多餘的資料夾就可以了 (每個puppeteer_dev_profile佔 1 ~ 2 GB 不等，機器真的吃不消~)

所以就組裝一下以下shell command︰

```sh
ls -t /tmp | grep puppeteer_dev_profile | tail -n +2 | awk '{print "/tmp/"$1}' | xargs -l1 rm -rf
```

合共5個步驟用pipe串接︰

首先`ls -t /tmp`按最近修改時間 (modification time) 逐一列出`/tmp`下的檔案名字；

`grep puppeteer_dev_profile`篩選出名字包含`puppeteer_dev_profile`的行；

`tail -n +2`截取由第2行 (包括第2行) 至最後一行 (包括最後一行)，因為第1個puppeteer_dev_profile文件通常正在被程序使用中；

`awk '{print "/tmp/"$1}'`把每行文件名字加上前綴`/tmp/`，變成full path；

最後透過`xargs -l1`把每行full path接在`rm -rf`後執行，逐一永久移除`/tmp/puppeteer_dev_profile-*`檔案。

把這個放進crontab，視情況我每天執行一次，注意權限是否足夠，每個指令建議改用full path，例如`ls`改為`/usr/bin/ls`。

> 因為不時有這類*不修改code的*資源回收需求，紀錄一下方便日後跟進。
