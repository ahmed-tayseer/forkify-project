import { API_URL, PAGE_ELEMENTS, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  bookmarks: [],
};

const createRecipe = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    source: recipe.source_url,
    ...(recipe.key && { key: recipe.key }), // trick to put entry in obj if exists
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    let { recipe } = data.data;
    state.recipe = createRecipe(recipe);
    let bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === recipe.id
    );
    state.recipe.bookmarked = bookmarked;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const { recipes } = data.data;
    state.search.query = query;

    // if (!recipes || (Array.isArray(recipes) && recipes.length === 0)) throw Error('There is no such recipe');
    if (!recipes || !recipes.length) throw Error('There is no such recipe');

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// Logic for page is added in the model.js and the page number info is stored in search object
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * PAGE_ELEMENTS;
  const end = start + PAGE_ELEMENTS;
  return state.search.results.slice(start, end);
};

export const updateRecipeServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  // isn' it always same as state.recipe ??? --> No as when showing from book marks wont be like that
  // if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  // Checking if index there is no index (should be -1)
  // if (!index) return; // ❌
  // if (!Number.isFinite(index)) return; // ❌
  if (index === -1) return; // ✅
  state.bookmarks.splice(index, 1);
  // if (id === state.recipe.id) state.recipe.bookmarked = false;
  state.recipe.bookmarked = false;
  persistBookmarks();
};

// it's same like calling with a handler of event load
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const uploadRecipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      ingredients: ingredients,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, uploadRecipe);
    const { recipe } = data.data;
    state.recipe = createRecipe(recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
