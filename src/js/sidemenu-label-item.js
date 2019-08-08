import SMItem from "./sidemenu-item";

export default class SMLabelItem extends SMItem {
  constructor(title = "", className = "") {
    super();
    this._title = document.createElement("span");
    this._title.className = "sidemenu-label-text";
    this._title.textContent = title;
    this._label = document.createElement("div");

    if (className) className = ` ${className}`;
    this._label.className = `sidemenu-item-label${className}`;
    this._labelIcon = document.createElement("span");
    this._labelIcon.className = "sidemenu-label-icon";
    this._label.appendChild(this._labelIcon);
    this._label.appendChild(this._title);
    this.el.appendChild(this._label);
  }
  setTitle(title) {
    this._title.textContent = title;
  }
}
