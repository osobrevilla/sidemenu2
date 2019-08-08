import SMLabelItem from "./sidemenu-label-item";
import { pressEvent } from "./contants";

export default class SMSubMenuItem extends SMLabelItem {
  constructor(title = "", subMenu, className = "") {
    super(title, className);
    this.el.classList.add("sidemenu-item-more");
    this._label.addEventListener(
      pressEvent,
      e => {
        e.stopPropagation();
        this.subMenu.open();
      },
      false
    );
    this.subMenu = subMenu;
    this.subMenu._setParent(this);
    this.el.appendChild(this.subMenu.el);
  }
}
