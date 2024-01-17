import icons from 'url:../../img/icons.svg';
import { View } from './View';
import { PAGE_ELEMENTS } from '../config';

export class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _listOfPageElements = [];
  _currPage = 0;
  // makeList(markupList) {
  //   for (let i = 0; i < markupList.length; i = i + 10)
  //     this._markupList.push(markupList.slice(i, i + 10).join(''));
  // }
  makeListOfPageElements(list) {
    this._listOfPageElements = [];
    this._currPage = 0;

    for (let i = 0; i < list.length; i += PAGE_ELEMENTS)
      this._listOfPageElements.push(list.slice(i, i + PAGE_ELEMENTS));
    return this._listOfPageElements[0];
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler();
    });
  }

  getPage() {
    return this._listOfPageElements[this._currPage];
    // return this._listOfPageElements.slice(
    //   currElement,
    //   currElement + PAGE_ELEMENTS
    // );
  }

  getNextPage() {
    if (this._currPage < this._listOfPageElements.length - 1) this._currPage++;
    return this.getPage();
  }

  getPrevPage() {
    if (this._currPage > 0) this._currPage--;
    return this.getPage();
  }

  _generateMarkup() {
    if (this._listOfPageElements.length < 2) return '';

    const markupNext = `
      <button class="btn--inline pagination__btn--next">
        <span>Page ${this._currPage + 2}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    const markupPrev = `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._currPage}</span>
      </button>
    `;
    if (this._currPage === 0) return markupNext;
    if (this._currPage === this._listOfPageElements.length - 1)
      return markupPrev;
    return markupPrev + markupNext;
  }
}
