---
title: "[試一下tensorflow.js] 先用canvas畫驗證碼"
date: 2019-08-31T10:42:02+08:00
draft: false
categories: ["coding", "machine-learning"]
tags: ["js", "canvas", "tfjs"]
---

2019香港居屋抽籤完滿結束，人生依舊殘念。沒事幹的唯有回望一下今年網上居屋申請表格，看看用canvas重新實現表格上的驗證碼，然後試著用tensorflow.js去辨識字母。

<!--more-->

*這篇重點是重現驗證碼圙案，如果你是想了解如何使用tensorflow.js辨識字母，請到[下一篇文章](/posts/2019/play-with-tfjs-classify-validation-code)*

> *這裡純學術研究，內容上如有任何冒犯請見諒。*

因為活動已完結所以網頁也關了，下面附上截圖先譲各位了解一下：

{{<figure src="/posts/2019/play-with-tfjs-validation-code/website-screenshot.png" link="/posts/2019/play-with-tfjs-validation-code/website-screenshot.png" target="_blank" caption="2019居屋網上申請表格截圖">}}

可以看出圖案由3部分組成：

- 由左邊淺灰色往右漸變成白色的背景；
- 8條黑色線: 4條由上到下，另外4條由左到右，角度隨機場；
- 黑色數字或英文字母，字體大小各異，多款字型，可以是粗體，大約左右置中有少許隨機位移，坐落於一條baseline之上。

下面寫一個function來繪製類似圖䅁，為了之後辨識字母簡單點，只畫單一字母那款（ML我不懂哦就別挑高難度的 :see_no_evil:）

1. 先定義圖案寛高度各50px：
{{< highlight js "linenos=table,linenostart=1" >}}
const CANVAS_WIDTH = 50;
const CANVAS_HEIGHT = 50;
{{< / highlight >}}

2. function需要傳入一個數字或字母用以繪製：
{{< highlight js "linenos=table,linenostart=3" >}}
function generateCharImage(char) {
{{< / highlight >}}

3. 創建一個canvas元素，呼叫`.getContent("2d")`取得畫布：
{{< highlight js "linenos=table,linenostart=4" >}}
    //create canvas
    const canvasId = `canvas-${char}`;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvasId);
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
{{< / highlight >}}

4. 繪製背景（漸變方向原來應該是左至右，這裡加點小改變由左上角至右下角）：
{{< highlight js "linenos=table,linenostart=11" >}}
    //draw background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_HEIGHT, CANVAS_HEIGHT);
    gradient.addColorStop(0, "lightgray");
    gradient.addColorStop(1, "white");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_HEIGHT, CANVAS_HEIGHT);
{{< / highlight >}}

5. 上至下畫一條線，左至右畫再一條，重複4次，位置隨機：
{{< highlight js "linenos=table,linenostart=17" >}}
    //draw lines
    ctx.strokeStyle = "black";
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.round(Math.random() * CANVAS_HEIGHT), 0);
        ctx.lineTo(Math.round(Math.random() * CANVAS_HEIGHT), CANVAS_HEIGHT);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, Math.round(Math.random() * CANVAS_HEIGHT));
        ctx.lineTo(CANVAS_HEIGHT, Math.round(Math.random() * CANVAS_HEIGHT));
        ctx.stroke();
    }
{{< / highlight >}}

6. 畫字，字體大小隨機，不知道原本是甚麼字型所以隨意選兩個相似的，位置簡單點置中好了：
{{< highlight js "linenos=table,linenostart=29" >}}
    //draw char
    ctx.fillStyle = "black";
    const fontSIze = `${Math.floor(Math.random() * 10) + 30}px`;
    const fontFamily = ["Courier", "Palatino"][Math.floor(Math.random() * 2)];
    const fontBold = Math.random() < 0.5 ? "bold" : "";
    ctx.font = `${fontBold} ${fontSIze} ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, CANVAS_HEIGHT / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT);
{{< / highlight >}}

7. 最後把canvas放入`<body>` ：
{{< highlight js "linenos=table,linenostart=38" >}}
    document.body.appendChild(canvas);
}
{{< / highlight >}}

8. 寫好function後，試著0~9、a~z、A~Z都繪製一次：
{{< highlight js "linenos=table,linenostart=40" >}}
for (let char of "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    generateCharImage(char);
};
{{< / highlight >}}

程式碼就先寫到這裡，下面直接看看效果：
<p class="codepen" data-height="512" data-theme-id="0" data-default-tab="js,result" data-user="doggor" data-slug-hash="YzKxYVg" data-preview="true" style="height: 512px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="hk-housing-authority-validation-code-patterns">
  <span>See the Pen <a href="https://codepen.io/doggor/pen/YzKxYVg/">
  hk-housing-authority-validation-code-patterns</a> by Andy Ching (<a href="https://codepen.io/doggor">@doggor</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
