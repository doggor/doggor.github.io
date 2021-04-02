(function(w, d) {
    "use strict";

    const checkbox = d.getElementById("darkmode-switch-checkbox");

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
        const match = d.cookie.match(/dgdarkmode=(\d)/);
        if (match && match[1] == 0) {
            checkbox.checked = false;
            toLight();
        }
    }
    //auto switch to browser preferred mode
    else if (typeof w.matchMedia === "function") {
        const mql = w.matchMedia("(prefers-color-scheme: light)");
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
