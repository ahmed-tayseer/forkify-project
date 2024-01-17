// Created by Ahmed Tayseer
import * as model from './model';
import { MODEL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); // get the hash id from the url
    if (!id) return;

    // Upadate the selected results if exists
    // if (model.state.search.results.length !== 0)
    searchView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    recipeView.renderSpinner();

    // Load the recipe from API
    await model.loadRecipe(id);

    // Create the html Elements and render
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlUpdateRecipe = function (newServings) {
  // Update recipe servings
  model.updateRecipeServings(newServings);
  // rerender the recipe
  recipeView.update(model.state.recipe);
};

const controlSearch = async function () {
  try {
    const searchQuery = searchView.getQuery();
    // Check for empty search query
    if (!searchQuery) return;

    // Render Spinner
    searchView.renderSpinner();

    // Fetch search results from API
    await model.loadSearchResults(searchQuery);

    // Render results. just one page
    searchView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderError();
  }
};

const controlPagination = function (pageNum) {
  searchView.render(model.getSearchResultsPage(pageNum));
  paginationView.render(model.state.search);
};

const controlChangeBookmarks = function (recipe) {
  // if not bookmarked add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // if bookmarked delete bookmark
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  if (model.state.bookmarks.length === 0) bookmarksView.renderMessage();
  else bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  if (model.state.bookmarks.length) bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // upload our recipe
    await model.uploadRecipe(newRecipe);

    // Render successful message
    addRecipeView.renderMessage();

    // Change the id of the url without reloading
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render the new recipe and it's details
    recipeView.render(model.state.recipe);

    // Render the added recipe in the bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Close the window modal window after the success message
    setTimeout(() => {
      addRecipeView.closeWindow();
    }, MODEL_CLOSE_SEC * 1000);

    // remove the success message and rerendel the normal form after 2 sec
    setTimeout(() => {
      addRecipeView.render();
    }, 2 * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // must be before control recipe so that controlBookmarks is the first one in call back queue after loading then stored bookmarks are rendered before the bookmarksView.update() in the control recipe
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerRecipeBtns(controlChangeBookmarks, controlUpdateRecipe);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
