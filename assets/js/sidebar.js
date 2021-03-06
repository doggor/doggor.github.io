(function(d) {
    "use strict";

    const maxims = [
        "我好像搞砸了甚麼",
        "原來乖乖已過期",
        "又寫下了光輝一bug",
        "windows過一會自然好",
        "rm -rf / 解決一切問題",
        "上雲之後錢燒得很快",
        "cache了很多bug",
        "沒下班怎打卡",
        "腦袋君罷工了",
        "客戶需求即是bug",
        "加個bug就能修正問題",
        "GC魔法有代價",
        "沒了電腦我甚麼都不是",
        "測試資料讓生意增長了",
        "code糟糕得如人生寫照",
        "deadline一路往後調整",
        "一堆爬蟲推高了流量",
        "錯手把DB刪光光",
        "不眠不休用生命填坑",
    ];
    //get dom for printing
    const displayDom = eleByClass("app-header-wanna-say");
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
    //show dom
    displayDom.style.display = "block";
})(document);
