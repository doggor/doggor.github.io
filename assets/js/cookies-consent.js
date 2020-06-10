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

    loadJs("https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js", function() {
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
