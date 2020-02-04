"use strict";

(function(w, d) {
    var checkbox = d.getElementById("darkmode-switch-checkbox");

    function toLight() {
        d.body.className = d.body.className.replace("darkmode--activated", "").trim();

        //set cookie
        d.cookie = "dgdarkmode=0;expires=" + (new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))).toUTCString() + ";path=/";
    }

    function toDark() {
        d.body.className = (d.body.className + " darkmode--activated").trim();

        //set cookie
        d.cookie = "dgdarkmode=1;expires=" + (new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))).toUTCString() + ";path=/";
    }

    checkbox.addEventListener("change", function() {
        this.checked ? toDark() : toLight();
    });

    //init
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
})(window, document);
