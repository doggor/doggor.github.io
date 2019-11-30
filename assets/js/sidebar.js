"use strict";

(function(d) {
    const maxims = [
        "我好像搞砸了甚麼",
        "休息是甚麼",
        "原來乖乖已過期",
        "又寫下了光輝一bug",
        "windows過一會自然好",
        "用 rm -rf / 修復世界",
        "夢見了沒有bug的未來",
        "上雲之後錢燒得很快",
        "cache了很多bug",
        "沒下班怎打卡",
        "腦袋君罷工了",
        "客戶需求即是bug",
        "加個bug就能修正問題",
        "想把製造問題的人gc掉",
        "沒了電腦我甚麼都不是",
        "生意好因為這是測試資料",
        "有「電」字的東西都要修",
        "code糟糕得如人生寫照",
        "deadline永遠向後調整",
        "一堆爬蟲推高了流量",
        "錯手把DB刪光光",
    ];
    //get dom for printing
    const displayDom = d.getElementsByClassName("app-header-wanna-say")[0];
    //get a maxim
    const candidate = maxims[Math.floor(Math.random() * maxims.length)];
    //print maxim
    (function showChar(position) {
        setTimeout(function(position) {
            displayDom.innerHTML += candidate[position++]
            if (position < candidate.length) {
                showChar(position);
            }
            else {
                //update style after printed
                displayDom.className += " shining-cursor"
            }
        }, 120, position || 0);
    })();
})(document);
