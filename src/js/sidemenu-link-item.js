import SMLabelItem from './sidemenu-label-item'

/**
 * Create a instance of SMLinkItem
 * @class
 * @param {string} title
 * @param {string} url
 * @param {string} [target] (optional)
 * @param {string} [className] - is CSS className (optional)
 * @extends SMLabelItem
 */

export default class SMLinkItem extends SMLabelItem {
  constructor(title = '', url = '/', target = '', className){
    super(title)
    let newLabel = document.createElement('a')
    let contents = this._label.childNodes
    this._label.parentNode.replaceChild(newLabel)
    this._label = newLabel
    this._label.href = url
    this._label.classList.add('sidemenu-item-label')
    this.el.classList.add('sidemenu-item-link')
    if (target) this._label.target = target
    if (className) this._label.classList.add(className)
    this._label.appendChild(contents)
  }
}