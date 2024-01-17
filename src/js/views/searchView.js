import { View } from './View';
import previewView from './previewView';

class SearchView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _formSearch = document.querySelector('.search');
  _inputSearch = document.querySelector('.search__field');

  addHandlerSearch(handler) {
    this._formSearch.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._inputSearch.value;
    this._clearSearchInput();
    return query;
  }

  _clearSearchInput() {
    this._inputSearch.value = '';
  }

  _generateMarkup() {
    return this._data.map(previewView.generatePreviewMarkup).join('');
  }
}
export default new SearchView();
