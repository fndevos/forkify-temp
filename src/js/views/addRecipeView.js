'use strict';
import icons from 'url:../../img/icons.svg'; // parcel 2.x
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was sucessfully added!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addOpenWindowHandler();
    this._addCloseWindowHandler();
  }

  toggleWindow = function () {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  };

  // we can run this function as soon as the object is created
  // the controller does not have to be involved
  // we can have a non-empty constructor that calls this function
  // but the controller still needs to import this file
  // so that it will get executed
  _addOpenWindowHandler() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // make sure this is not the button but the object
  }

  _addCloseWindowHandler() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  addUploadHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // this is the form
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
