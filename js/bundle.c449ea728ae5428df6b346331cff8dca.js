"use strict";

/**common tools */
function eleByClass(className) { return document.getElementsByClassName(className)[0]; }
function hasClass(ele, className) { return ele.className.indexOf(className) > -1; }
function addClass(ele, className) { ele.className += " " + className; }
function delClass(ele, className) { ele.className = ele.className.replace(className, "").trim(); }

;
// Check that service workers are supported
if ("serviceWorker" in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.min.js");
    });
}

;
(function(w, d) {
    var checkbox = d.getElementById("darkmode-switch-checkbox");

    function toLight() {
        delClass(d.body, "darkmode--activated");

        //set cookie
        d.cookie = "dgdarkmode=0;expires=" + (new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))).toUTCString() + ";path=/";
    }

    function toDark() {
        addClass(d.body, "darkmode--activated");

        //set cookie
        d.cookie = "dgdarkmode=1;expires=" + (new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))).toUTCString() + ";path=/";
    }

    checkbox.addEventListener("change", function() {
        this.checked ? toDark() : toLight();
    });

    //init
    //show switch
    eleByClass("planet-switch").style.display = "block";
    //switch to last mode from cookie
    if (typeof d.cookie === "string") {
        var match = d.cookie.match(/dgdarkmode=(\d)/);
        if (match && match[1] == 0) {
            checkbox.checked = false;
            toLight();
        }
    }
    //auto switch to browser preferred mode
    else if (typeof w.matchMedia === "function") {
        var mql = w.matchMedia("(prefers-color-scheme: light)");
        if (mql.matches) {
            checkbox.checked = false;
            toLight();
        }
    }

    //turn on transition
    setTimeout(() => {
        d.body.className = (d.body.className + " darkmode-ready").trim();
    }, 1000);
})(window, document);

;
(function(d) {
    var maxims = [
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
    var displayDom = eleByClass("app-header-wanna-say");
    //get a maxim
    var candidate = maxims[Math.floor(Math.random() * maxims.length)];
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

;
(function(d, w) {
    /** menu btn action */
    var menuBtn = eleByClass("app-topbar-menu-btn");
    var sidebar = eleByClass("app-header");
    var appContainer = eleByClass("app-container");

    menuBtn.addEventListener("click", function() {
        hasClass(sidebar, "show") ? delClass(sidebar, "show") : addClass(sidebar, "show");
    });
    appContainer.addEventListener("click", function() {
        if (hasClass(sidebar, "show")) {
            delClass(sidebar, "show");
        }
    });

    /** top bar scrolling effect */
    var isScrolling = false;
    var isScrollingTimer = null;
    var lastScroll = 0;
    var animationTick = false;
    var topbar = eleByClass("app-topbar");
    function onScrolling() {
        isScrolling = true;
        var diff = lastScroll - w.scrollY;
        if (diff > 0 && hasClass(topbar, "hide")) {
            delClass(topbar, "hide");
        }
        else if (diff < 0 && !hasClass(topbar, "hide")) {
            addClass(topbar, "hide");
        }
    }
    function offScrolling() {
        isScrolling = false;
        lastScroll = w.scrollY;
    }
    function onAnimationFrameRequested() {
        if (w.scrollY < 50) {
            delClass(topbar, "hide");
        }
        if (!isScrolling) {
            onScrolling();
        }
        if (isScrollingTimer) {
            clearTimeout(isScrollingTimer);
        }
        isScrollingTimer = setTimeout(offScrolling, 300);
        animationTick = false;
    }
    w.addEventListener("scroll", function() {
        if (!animationTick) {
            animationTick = true;
            w.requestAnimationFrame(onAnimationFrameRequested)
        }
    });
})(document, window);

;
(function(w, d) {
    w.dataLayer = w.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-58223463-2');

    //load gtag script
    var script = d.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.googletagmanager.com/gtag/js?id=UA-58223463-2";
    script.setAttribute("defer", "true");
    d.getElementsByTagName("head")[0].appendChild(script);
})(window, document);

;
(function(w, d) {
    //simply return if popup already dismissed
    if (d.cookie.indexOf("cookieconsent_status=dismiss") > -1) {
        return;
    }

    var head = d.getElementsByTagName("head")[0];

    var link = d.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
    head.appendChild(link);

    function loadScript(url, callback) {
        var script = d.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            // only required for IE <9
            script.onreadystatechange = function() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            //Others
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        head.appendChild(script);
    }

    loadScript("https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js", function() {
        w.cookieconsent.initialise({
            palette: {
                popup: {
                    background: "#000",
                },
                button: {
                    background: "#000",
                    border: "#ffd600",
                    text: "#ffd600",
                },
            },
            position: "bottom-right",
            content: {
                message: "This website uses cookies to ensure you get the best experience. ",
            },
        });
    });
})(window, document);