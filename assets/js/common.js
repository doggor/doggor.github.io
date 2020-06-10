"use strict";

/**common tools */
function eleByTag(tagName) { return document.getElementsByTagName(tagName)[0]; }
function eleByClass(className) { return document.getElementsByClassName(className)[0]; }
function hasClass(ele, className) { return ele.className.indexOf(className) > -1; }
function addClass(ele, className) { ele.className += " " + className; }
function delClass(ele, className) { ele.className = ele.className.replace(className, "").trim(); }

function loadJs(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    if (typeof callback === "function") {
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
            script.onload = callback;
        }
    }

    eleByTag("head").appendChild(script);
}
