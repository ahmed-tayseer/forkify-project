// https://forkify-api.herokuapp.com/v2
// showRecipe('5ed6604591c37cdc054bcd09').catch(e => console.log(e));
// fetch(
//   'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
// )

// const controlSearch = async function () {
//   // e.preventDefault();
//   // const query1 = document.querySelector('.search__field').value;
//   const searchQuery = searchView.getQuery();
//   if (!searchQuery) return;
//   try {
//     searchView.renderSpinner();
//     await model.loadSearchResults(searchQuery);
//     const firstPageElements = paginationView.makeListOfPageElements(
//       model.state.search.results
//     );
//     controlPagination(firstPageElements);
//   } catch (err) {
//     searchView.renderError();
//   }
// };

// const controlPagination = function (pageElements) {
//   searchView.render(pageElements);
//   paginationView.render();
//   paginationView.addHandlerPagination(controlNextPage, controlPrevPage);
// };
// const controlNextPage = function () {
//   const NextPageElements = paginationView.getNextPage();
//   controlPagination(NextPageElements);
// };
// const controlPrevPage = function () {
//   const prevPageElements = paginationView.getPrevPage();
//   controlPagination(prevPageElements);
// };

// class PaginationView extends View {
//   _parentElement = document.querySelector('.pagination');
//   _listOfPageElements = [];
//   _currPage = 0;

//   makeListOfPageElements(list) {
//     this._listOfPageElements = [];
//     this._currPage = 0;

//     for (let i = 0; i < list.length; i += PAGE_ELEMENTS)
//       this._listOfPageElements.push(list.slice(i, i + PAGE_ELEMENTS));
//     return this._listOfPageElements[0];
//   }

//   // Implemented eventListenr and handler of markup buttons that doesn't exist in the begining by event delegation using the parent that exists in the beginning
//   addHandlerPagination(handler) {
//     this._parentElement.addEventListener('click', function (e) {
//       e.preventDefault();
//       const btn = e.target.closest('.btn--inline');
//       if (!btn) return;
//       handler(Number(btn.dataset.goto));
//     });
//   }

//   getPage() {
//     return this._listOfPageElements[this._currPage];
//   }

//   getNextPage() {
//     if (this._currPage < this._listOfPageElements.length - 1) this._currPage++;
//     return this.getPage();
//   }

//   getPrevPage() {
//     if (this._currPage > 0) this._currPage--;
//     return this.getPage();
//   }
// }
