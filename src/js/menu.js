import SMSubMenuItem from "./submenuitem";
import { TRNEND_EV } from "./contants";
/**
 * Class represent a Menu element.
 * @class
 * @param {SMItem[]} items - items of menu.
 * @param {Object} options
 * @param {string} options.title - The title of menu (optional)
 */

export default class Menu {
  constructor(items = [], options) {
    this.options = Object.assign({}, options);
    this.items = [];
    this.isOpen = false;
    this.parent = null;

    this.el = document.createElement("div");
    this.el.className = "sidemenu sidemenu-added";
    this._body = document.createElement("div");
    this._body.className = "sidemenu-body";
    this.el.appendChild(this._body);

    this._scroller = document.createElement("div");
    this._scroller.className = "sidemenu-scroller";
    this._body.appendChild(this._scroller);

    this._content = document.createElement("div");
    this._content.className = "sidemenu-content";
    this._scroller.appendChild(this._content);

    if (this.options.title) {
      this._title = document.createElement("div");
      this._title.classList.add("sidemenu-title");
      this._title.textContent = this.options.title;
      this._content.appendChild(this._title);
    }

    this._list = document.createElement("ul");
    this._content.appendChild(this._list);

    this._scroller.addEventListener("scroll", this._onScroll, false);

    this.addItems(items);
  }
  _onScroll(e) {
    let scroll = e.target;
    if (scroll.scrollHeight - scroll.scrollTop === scroll.clientHeight) {
      e.preventDefault();
      scroll.scrollTop -= 1;
    } else if (scroll.scrollTop === 0) scroll.scrollTop = 1;
  }
  _add(menuItem, index) {
    menuItem._setParent(this);
    this.items.splice(index, 0, menuItem);
    if (this._list.hasChildNodes()) {
      if (this._list.childNodes[index])
        this._list.insertBefore(menuItem.el, this._list.childNodes.item(index));
      else this._list.appendChild(menuItem.el);
    } else {
      this._list.appendChild(menuItem.el);
    }
  }
  _refresh() {
    if (this.sideMenu) this.sideMenu._refresh();
  }
  _setParent(item_) {
    this.parentItem = item_;
  }
  _setCurrentMenu(menu) {
    this.sideMenu.currentMenu = menu;
  }
  _getCurrentMenu() {
    return this.sideMenu.currentMenu;
  }
  _show(callback) {
    this.isOpen = true;
    this.el.style.zIndex = 2;
    if (typeof callback == "function") this._onTransitionEnd(callback);
    this.el.classList.add("sidemenu-show");
    return this;
  }
  _hide(callback) {
    if (this.isOpen) this.el.style.zIndex = 1;
    this.isOpen = false;
    this._onTransitionEnd(() => {
      this.el.style.zIndex = "";
      if (typeof callback === "function") callback.apply(this, arguments);
    });
    this.el.classList.remove("sidemenu-show");
    return this;
  }
  _onTransitionEnd(callback) {
    this.__transitionEnd = e => {
      this.el.removeEventListener(TRNEND_EV, this.__transitionEnd, false);
      if (typeof callback === "function") callback.call(this, this, e);
    };
    this.el.addEventListener(TRNEND_EV, this.__transitionEnd, false);
  }
  _hideSubMenus() {
    if (this.items && this.items.length)
      for (let item of this.items)
        if (item instanceof SMSubMenuItem) item.subMenu._closeWithChilds();
  }
  _closeWithChilds() {
    this._hide();
    this._hideSubMenus();
  }
  _closeWithParents(except) {
    if (except !== this) this._hide();
    if (this.parentItem && this.parentItem.parent)
      this.parentItem.parent._closeWithParents(except);
  }
  _openParents() {
    this.sideMenu.history.clear();
    var parentsMenus = [];
    function open(parentItem) {
      if (parentItem && parentItem.parent) {
        parentsMenus.push(parentItem.parent);
        open(parentItem.parent.parentItem);
      }
    }
    open(this.parentItem);
    parentsMenus.reverse();
    for (let parentMenu of parentsMenus) {
      //parentNode.insertBefore(parentMenu.el, this.el);
      this.sideMenu.history.add(parentMenu);
    }
  }
  /** @expose */
  addItem(menuItem, index) {
    this._add(menuItem, index === undefined ? this.items.length : index);
    this._refresh();
    return this;
  }

  addItems(menuItems, index) {
    if (!menuItems) return;
    index = index === undefined ? this.items.length : index;
    for (let i = 0; i < menuItems.length; i += 1) {
      this._add(menuItems[i], index + i);
    }
    this._refresh();
    return this;
  }
  /** @expose */
  open() {
    if (this.isOpen) return this;
    var currentMenu = this._getCurrentMenu(),
      overlay;
    if (currentMenu) currentMenu._hide();
    this._show(() => {
      if (currentMenu) currentMenu._closeWithParents(this);
    });
    this._openParents();
    this._setCurrentMenu(this);
    this.sideMenu.history.add(this);
    if (this.options.onOpen) this.options.onOpen.call(this);
    overlay = this.overlay || (this.sideMenu && this.sideMenu.overlay);
    if (overlay) overlay.show();
    return this;
  }
  /** @expose */
  close() {
    if (!this.isOpen) return this;
    if (this._getCurrentMenu() === this) this.sideMenu.goBack();
    else this._hide();
    if (this.sideMenu.history.isEmpty()) this._setCurrentMenu(null);
    if (this.options.onClose) this.options.onClose.call(this);
    return this;
  }
  /** @expose */
  clear() {
    this._list.innerHTML = "";
    this.items = [];
    return this;
  }
  /** @expose */
  getItemByIndex(index) {
    return this.items[index];
  }
  /** @expose */
  getItemByName(title) {
    var reg = new RegExp(title, "gi");
    for (let item of this.items) {
      if (item.title && reg.test(item.title)) return item;
    }
    return null;
  }
  /** @expose */
  getSubMenuByName(title) {
    var item = this.getItemByName(title);
    return item ? item.subMenu : item;
  }
  destroy() {
    this.clear();
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      this._scroller.removeEventListener("scroll", this._onScroll, false);
      this.el.removeEventListener(TRNEND_EV, this.__transitionEnd, false);
    }
    if (this.overlay) this.overlay.destroy();
    if (this.parentItem)
      this.parentItem.items.splice(this.parentItem.items.indexOf(this), 1);
  }
}
