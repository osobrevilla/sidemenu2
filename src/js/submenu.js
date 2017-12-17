import Menu from './menu'
import { pressEvent } from './contants';

export default class SMSubMenu extends Menu {
  constructor(items = [], options) {
    super(items, Object.assign(SMSubMenu.options, options))
    if (this.options.back) {
      this._back = document.createElement('li')
      this._back.classList.add('sidemenu-back')
      this._back.addEventListener(pressEvent, (e) => {
        e.preventDefault()
        this.sideMenu.goBack()
      })
      this._back.textContent = this.options.back
    }
    if (this._back) this._content.insertBefore(this._back, this._content.firstElementChild)
    this.el.classList.add('sidemenu-submenu')
    this.sideMenu = null
  }
  static options = {
    back: 'back'
  }
}
