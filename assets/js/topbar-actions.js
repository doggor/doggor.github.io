(function(d, w) {
    "use strict";

    const menuBtn = eleByClass("app-topbar-menu-btn");
    const backBtn = eleByClass("mobile-back-btn");
    const sidebar = eleByClass("app-header");
    const topbar = eleByClass("app-topbar");

    /** menu btn action */
    menuBtn.addEventListener("click", () => addClass(sidebar, "show"));
    backBtn.addEventListener("click", () => delClass(sidebar, "show"));

    /** top bar scrolling effect */
    let isScrolling = false;
    let isScrollingTimer = null;
    let lastScroll = 0;
    let animationTick = false;
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
