---
title: "在VS Code遠端偵錯NodeJS程序"
date: 2019-03-05T10:48:55+08:00
draft: false
categories: ["tech"]
tags: ["vscode","nodejs","debug"]
---

甚麼時候會需要遙距debug另一部機器上的程序呢？例如這個程序只能在Linux上運行卻要在windows下開發，部署到生產環境時不能正常運作，某一天生產環境下的程序突然崩潰......

<!--more-->

~~悲劇太多不能盡錄。~~

友好的NodeJS提供了inspect模式給我們進行偵錯。

inspect模式下，預設會開放port 9229作偵錯通道，此時利用VS Code監聴這個port口就可以隨意設下breakpoint。

現在我們需要先利用SSH把遠端主機的port 9229挷定到本機。在本機終端執行
```sh
ssh -L 9229:localhost:9229 <username>@<remote host>
```

這時SSH session會監聴遠端port 9229，並把收到的資料從本機的port 9229發出。(本機port 9229收到的資料也會送到遠端。)

我們先保留這個連接。

> 按Ctrl+C可以中斷SSH session。

然後在你的project中創建/.vscode/launch.json，填入以下設定
```json
    {
        "type": "node",
        "request": "attach",
        "name": "Remote Debug",
        "protocol": "inspector",
        "address": "localhost",
        "port": 9229,
        "localRoot": "${workspaceFolder}",
        "remoteRoot": "<your remote project path>"
    }
```

準備就緒，開始偵錯。

在VS Code按下F5啟動偵錯模式。

SSH登入到遠端主機，執行你的NodeJS程序
```sh
node --inspect <your project path>/<your js file name>.js
```
