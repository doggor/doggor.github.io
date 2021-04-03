"use strict";(function(d,w){function eleByClass(className){return d.getElementsByClassName(className)[0]}
function hasClass(ele,className){return ele.className.indexOf(className)>-1;}
function addClass(ele,className){ele.className+=" "+className;}
function delClass(ele,className){ele.className=ele.className.replace(className,"").trim();}
const menuBtn=eleByClass("app-topbar-menu-btn");const sidebar=eleByClass("app-header");menuBtn.onclick=function(){hasClass(sidebar,"show")?delClass(sidebar,"show"):addClass(sidebar,"show");};let isScrolling=false;let isScrollingTimer=null;let lastScroll=0;const topbar=eleByClass("app-topbar");function onScrolling(){isScrolling=true;const diff=lastScroll-w.scrollY;if(diff<0&&!hasClass(topbar,"hide")){addClass(topbar,"hide");}
else if(diff>0&&hasClass(topbar,"hide")){delClass(topbar,"hide");}}
function offScrolling(){isScrolling=false;lastScroll=w.scrollY;}
w.addEventListener("scroll",function(){if(!isScrolling){onScrolling();}
if(isScrollingTimer){clearTimeout(isScrollingTimer);}
isScrollingTimer=setTimeout(offScrolling,300);});})(document,window);