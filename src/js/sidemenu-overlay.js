export default class SMMenuOverlay  {
    constructor(){
        this.el = document.createElement('div')
        this.el.className = 'sidemenu-overlay'
    }
    show () {
      document.body.appendChild(this.el)
    }
    hide () {
      if (this.el.parentNode) this.el.parentNode.removeChild(this.el)
    }
    destroy () {
      this.hide()
    }
}