'use strict';
import icons from 'url:../../img/icons.svg'; // parcel 2.x

export default class View {
  _data;
  /**
   * Render the received object to the DOM.
   * @param {Object | Object[]} data The data to be rendered (e.g. a recipe)
   * @param {boolean} [render=true] If false, created markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup; // used with previewView

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert markup into "virtual" DOM objects
    // stored in memory, but not rendered on page
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // convert node list to array with Array.from()
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log('curEl ', curEl, newEl.isEqualNode(curEl));

      // now replace only the text
      // see: MDN docs for nodeValue:
      // The nodeValue property of the Node interface returns or sets the value of the current node.
      // The Node.firstChild read-only property returns the node's first child in the tree, or null if the node has no children.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl);
        // console.log('🚆', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // we also need to change attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
