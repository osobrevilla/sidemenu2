import "../styles/sidemenu.sass";

import { isTouch, pressEvent } from "./contants";

import Menu from "./menu";
import SMButtonItem from "./sidemenu-button-item";
import SMItem from "./sidemenu-item";
import SMLabelItem from "./sidemenu-label-item";
import SMLinkItem from "./sidemenu-link-item";
import SMMenuOverlay from "./sidemenu-overlay";
import SMSubMenu from "./submenu";
import SMSubMenuItem from "./submenuitem";

export default class SMSideMenu extends Menu {
  constructor(items = [], options) {
    super(items, options);

    this.options.back = "";

    /** @expose*/
    this.history = {
      stacks: [],
      clear() {
        this.stacks = [];
      },
      add(obj) {
        if (obj) this.stacks.push(obj);
      },
      pop() {
        return this.stacks.pop();
      },
      beforeLastStak() {
        return this.stacks[this.stacks.length - 2];
      },
      isEmpty() {
        return this.stacks.length === 0;
      }
    };

    if (this.options.overlay) {
      this._onCloseProxy = this.close.bind(this);
      this.overlay = new SMMenuOverlay();
      this.overlay.el.addEventListener(
        isTouch ? "touchstart" : pressEvent,
        this._onCloseProxy
      );
    }

    this._target = null;
    this.sideMenu = this;
    this.currentMenu = null;
  }
  _add(menuItem, index) {
    super._add(menuItem, index);
    function walkItems(parent, subMenu) {
      if (subMenu) {
        subMenu.sideMenu = parent;
        for (var i in subMenu.items) {
          if (subMenu.items[i] instanceof SMSubMenuItem)
            walkItems(parent, subMenu.items[i].subMenu);
        }
      }
    }
    walkItems(this, menuItem.subMenu);
  }
  _refresh() {
    if (this._target) {
      let addeds = [].slice.call(
        this._target.querySelectorAll(".sidemenu-added")
      );
      addeds.forEach(element => {
        element.classList.remove("sidemenu-added");
        this._target.appendChild(element);
      });
    }
  }
  /** @expose */
  goBack() {
    let toInMenu = this.history.beforeLastStak();
    let toOutMenu = this.history.pop();
    this._setCurrentMenu(toInMenu || this);
    if (toOutMenu) toOutMenu._hide();
    if (toInMenu) toInMenu._show();
  }
  /** @expose @override */
  close() {
    this.history.clear();
    this._closeWithChilds();
    this._setCurrentMenu(null);
    if (this.options.onClose) this.options.onClose.call(this);
    if (this.overlay) this.overlay.hide();
  }
  /** @expose */
  toggle() {
    if (this.history.isEmpty()) this.open();
    else this.close();
  }
  /** @expose */
  appendTo(target) {
    this._target = target;
    this._target.appendChild(this.el);
    this._refresh();
    return this;
  }
}

// window.SMMenu = Menu
window.SMItem = SMItem;
window.SMLabelItem = SMLabelItem;
window.SMLinkItem = SMLinkItem;
window.SMSubMenuItem = SMSubMenuItem;
window.SMSubMenu = SMSubMenu;
window.SMButtonItem = SMButtonItem;
window.SMMenuOverlay = SMMenuOverlay;
