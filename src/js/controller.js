'use strict';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfills
import 'regenerator-runtime/runtime'; // polyfills
import { MODAL_CLOSE_AFTER_MILLIS } from './config.js';

// https://forkify-api.herokuapp.com/v2

// sample recipe ids:
// 5ed6604591c37cdc054bcc40
// 5ed6604591c37cdc054bcb37

// from parcel, to do hot-reloading:
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1. Loading recipe
    recipeView.renderSpinner();

    // 2. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 3. update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 4. load recipe
    await model.loadRecipe(id);

    // 5. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query);

    // 3. render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  // render new results
  resultsView.render(model.getSearchResultsPage(page));
  // render new pagination
  // model.state.search.page = page;
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // decrease or increase the servings and ingredients amounts
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. add or remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show spinner while uploading
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // render recipe in recipeView
    recipeView.render(model.state.recipe);

    // show success message
    addRecipeView.renderMessage();

    // render bookmark view
    // not just update because we are adding one
    bookmarksView.render(model.state.bookmarks);

    // change id in the url to the newly added recipe
    // allows to change url without reloading
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_AFTER_MILLIS);
  } catch (error) {
    console.log('🔥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addRenderHandler(controlBookmarks);
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addUploadHandler(controlAddRecipe);
  console.log('Welcome!');
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
