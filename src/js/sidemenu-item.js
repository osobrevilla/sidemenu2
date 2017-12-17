export default class SMItem {
  constructor() {
    this.el = document.createElement('li')
    this.el.className = 'sidemenu-item'
    this.parent = null
  }
  _setParent(sideMenu) {
    this.parent = sideMenu
  }
  moveToMenu(menuTarget, index) {
    var i, menuItem, items = this.parent.items
    if (menuTarget instanceof Menu) {
      i = items.indexOf(this)
      if (i !== -1) {
        menuItem = items[i]
        items.splice(i, 1)
        menuTarget.addItem(menuItem, index)
      }
    }
  }

  moveToPosition(index) {
    if (this.parent) this.moveToMenu(this.parent, index)
  }

  remove() {
    if (this.parent) {
      var i, items = this.parent.items;
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el)
        if ((i = items.indexOf(this)) !== -1) items.splice(i, 1);
      }
    }
  }
}