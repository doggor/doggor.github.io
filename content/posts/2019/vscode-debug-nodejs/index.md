---
title: "在VS Code遠端偵錯NodeJS程序"
date: 2019-03-05T10:48:55+08:00
draft: false
categories: ["Coding"]
tags: ["vscode", "nodejs", "debug"]
---

甚麼時候會需要遙距debug另一部機器上的程序呢？例如這個程序只能在Linux上運行卻要在windows下開發，部署到生產環境時不能正常運作，某一天生產環境下的程序突然崩潰......

<!--more-->

~~悲劇太多不能盡錄。~~

友好的NodeJS提供了inspect模式給我們進行偵錯。

inspect模式下，預設會開放port 9229作偵錯通道，此時利用VS Code監聴這個port口就可以隨意設下breakpoint。

某些情況下，例如基於安全考慮，我們無法隨意打開遠端主機的各種port。此時我們需要先利用SSH把遠端主機的port 9229映射到本機，然後讓debugger監聽本機的port 9229：

```sh
ssh -L 9229:localhost:9229 <username>@<remote host>
```

我們需要保持這個SSH session，直至完成整個偵錯工作。

> 按Ctrl+C可以中斷連接。

在你的project中創建/.vscode/launch.json，填入以下設定
{{< highlight json "linenos=table" >}}
    {
        "type": "node",
        "request": "attach",
        "name": "Remote Debug",
        "protocol": "inspector",
        "address": "localhost",
        "port": 9229,
        "localRoot": "${workspaceFolder}",
        "remoteRoot": "<your remote project absolute path>"
    }
{{< / highlight >}}

這𥚃`address`是指向`localhost`的，但如果你能夠直接連上遠端port 9229，也可以直接填入遠端主機IP。

準備就緒，開始偵錯。

在VS Code按下F5啟動偵錯模式。

SSH登入到遠端主機，執行你的NodeJS程序：
```sh
node --inspect <your project path>/<your js file name>.js
```

之後，VS Code的DEBUG CONSOLE會同歩顯示該程序的輸出，而你也可以隨意使用break point進行偵錯。
