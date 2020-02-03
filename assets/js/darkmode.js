"use strict";

(function(w, d) {
    if (typeof w.matchMedia === "function") {
        var mql = w.matchMedia("(prefers-color-scheme: dark)");
        if (!mql.matches) {
            d.body.className = d.body.className.replace("darkmode--activated", "");
        }
    }
})(window, document);
