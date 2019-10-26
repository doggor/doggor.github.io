"use strict";

(function(d) {
    const maxims = [
        "我好像搞砸了甚麼",
        "休息是甚麼",
        "原來乖乖過期了",
        "又寫下了光輝一bug",
        "window過一會自然好",
        "用 rm -rf / 修復世界",
        "我夢見了沒有bug的世界",
        "自從上雲之後錢燒得很快",
        "cache了很多bug",
        "上班沒打卡",
        "server罷工了",
        "腦子進水了",
        "把客戶需求寫進bug report",
        "這裡加個bug就能修正問題",
        "老師說RAM是消耗品",
        "偷偷寫個AI代上班",
        "這bug是誰的我要把他gc掉",
    ];

    const candidate = maxims[Math.floor(Math.random() * maxims.length)];

    const displayDom = d.getElementsByClassName("app-header-wanna-say")[0];

    (function showChar(position) {
        setTimeout(function(position) {
            displayDom.innerHTML += candidate[position++]
            if (position < candidate.length) {
                showChar(position);
            }
        }, 120, position || 0);
    })();

})(document);
