"use strict";

(function(d, w) {
    /**common tools */
    function eleByClass(className) { return d.getElementsByClassName(className)[0] }
    function hasClass(ele, className) { return ele.className.indexOf(className) > -1; }
    function addClass(ele, className) { ele.className += " " + className; }
    function delClass(ele, className) { ele.className = ele.className.replace(className, "").trim(); }

    /** menu btn action */
    const menuBtn = eleByClass("app-topbar-menu-btn");
    const sidebar = eleByClass("app-header");
    menuBtn.onclick = function() {
        hasClass(sidebar, "show") ? delClass(sidebar, "show") : addClass(sidebar, "show");
    };

    /** top bar scrolling effect */
    let isScrolling = false;
    let isScrollingTimer = null;
    let lastScroll = 0;
    let animationTick = false;
    const topbar = eleByClass("app-topbar");
    function onScrolling() {
        isScrolling = true;
        const diff = lastScroll - w.scrollY;
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
