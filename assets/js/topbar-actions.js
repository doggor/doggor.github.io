"use strict";

(function(d) {
    const menuBtn = d.getElementsByClassName("app-topbar-menu-btn")[0];
    const sidebar = d.getElementsByClassName("app-header")[0];
    menuBtn.onclick = function() {
        const className = sidebar.className;
        sidebar.className = className.indexOf("show") > -1 ? className.replace("show", "").trim() : (className + " show");
    }
})(document);
