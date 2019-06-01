---
title: "使用Nodejs直接回傳Gzipped HTML內容"
date: 2019-06-01T00:00:00+08:00
draft: false
categories: ["tech"]
tags: ["nodejs", "gzip", "html"]
---

設置Nginx/Apache server時必不少得啟用其內建的gzip功能。然而我在想，為甚麼每次請求非得要我提供純文字內容，然後才在HTTP server進行live gzip？如果手上早已有一堆已壓縮處理過的HTML檔案(*.html.gz)，難度要我先解壓給您跟著再壓縮一次嗎？

<!--more-->

在玩三小啊~~~

> 開啟gzip有啥好處？
>
> 當啟用了HTTP server內建的gzip功能，在處理客戶端請求(例如一般瀏覧網頁的HTTP請求)後，回應的文字內容都是先好好壓縮的，然後才發送到網絡上。這做法可大大減少實際傳輸數據量，從而縮短該網絡請求的回應時間。

早些日子終於有點時間去試試我的想法，直接讀取並向客戶端回傳*.html.gz檔案的內容，使用NodeJS(因為平日比較常用)，實作如下：

{{< highlight js "linenos=table" >}}
//創建HTTP伺服器
const server = http.createServer(async (req, res) => {
    //你的gz檔案路徑
    const filePath = "/path/of/your/gzipped/file.html.gz";

    //取得該檔案的reading stream
    const readStream = fs.createReadStream(filePath);

    //先輸出HTTP haeaders
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Content-Encoding": "gzip",
    });

    //把reading stream串接到response
    //再額外監聽一下"error"和"finish"事件
    readStream
        .pipe(res)
        .on("error", err => console.error("Encounter Error: ", err))
        .on("finish", () => console.log("Request Completed"));
}

//從Port 8080接收請求
server.listen(8080);
{{< / highlight >}}

上面做的就是直接讀取檔案內容然後輸出到Response，沒有甚麼需要特別處理的地方。

雖然也可以先把檔案讀到Buffer上，但這樣做就是把整個檔案寫到記憶體上，不太有效率，而這裡使用```readStream.pipe(res)```就邊讀邊寫，處理大型檔案也比較容易。
