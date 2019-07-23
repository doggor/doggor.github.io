"use strict";

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
                    border: "#00bfff",
                    text: "#00bfff",
                },
            },
            position: "bottom-right",
            content: {
                message: "This website uses cookies to ensure you get the best experience. ",
            },
        });
    });
})(window, document);
