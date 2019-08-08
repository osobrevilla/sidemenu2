const dummyStyle = document.createElement("div").style;
const vendor = (function() {
  var vendors = "t,webkitT,MozT,msT,OT".split(","),
    t,
    i = 0,
    l = vendors.length;

  for (; i < l; i++) {
    t = vendors[i] + "ransform";
    if (t in dummyStyle) {
      return vendors[i].substr(0, vendors[i].length - 1);
    }
  }
  return false;
})();

export const isTouch = !!("ontouchstart" in window || navigator.maxTouchPoints);
export const TRNEND_EV = (function() {
  if (vendor === false) return false;
  var transitionEnd = {
    "": "transitionend",
    webkit: "webkitTransitionEnd",
    Moz: "transitionend",
    O: "otransitionend",
    ms: "MSTransitionEnd"
  };
  return transitionEnd[vendor];
})();

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
export const pressEvent = isTouch ? "click" : "click";

const _clases = [isTouch ? "sidemenu-touch" : "sidemenu-desktop"];
const html = document.documentElement;

if (isMobile) _clases.push("sidemenu-mobile");
html.classList.add.apply(html.classList, _clases);
