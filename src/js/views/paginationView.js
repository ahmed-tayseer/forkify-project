import icons from 'url:../../img/icons.svg';
import { View } from './View';
import { PAGE_ELEMENTS } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Implemented eventListenr and handler of markup buttons that doesn't exist in the begining by event delegation using the parent that exists in the beginning
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(Number(btn.dataset.goto));
    });
  }

  // Store needed page in the btn html element to pass that number to the getSearchResultsPage(pageNum) function instead of making func for next and previous pages
  _generateBtnMarkup(type) {
    const btnPage = type === 'next' ? this._data.page + 1 : this._data.page - 1;
    return `
      <button data-goto="${btnPage}" class="btn--inline pagination__btn--${type}">
        <span>Page ${btnPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
        </svg>
      </button>
    `;
  }
  _generateMarkup() {
    // Number of pages for the search query
    const pagesNum = Math.ceil(this._data.results.length / PAGE_ELEMENTS);

    // Only one page
    if (pagesNum < 2) return '';

    const markupNext = this._generateBtnMarkup('next');
    const markupPrev = this._generateBtnMarkup('prev');

    // The first page
    if (this._data.page === 1) return markupNext;

    // The last page
    if (this._data.page === pagesNum) return markupPrev;

    // More than one page and not the first or the last one
    return markupPrev + markupNext;
  }
}

export default new PaginationView();
