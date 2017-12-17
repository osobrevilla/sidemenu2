import SMLabelItem from "./sidemenu-label-item";
import { pressEvent } from "./contants";

/**
 * Class represent a action button item
 * @class
 * @param {string} - The text of button
 * @callback onPress - The callback execute when the button is pressed (click|tap)
 * @param {string} className is CSS className (optional)
 * @extends SMLabelItem
 */

export default class SMButtonItem extends SMLabelItem {
  constructor(title = '', onPress, className = '', id = '') {
    super(title, className);
    if (id) this.id
    this.el.classList.add('sidemenu-item-button')
    this._perform = (e) => {
      if (typeof onPress === 'function') onPress.call(that, this)
    }
    this.el.addEventListener(pressEvent, this._perform)
  }
  remove() {
    super.remove()
    this.el.removeEventListener(pressEvent, this._perform)
  }
}