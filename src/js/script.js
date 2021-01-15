const template = {
  bookMenu: Handlebars.compile(document.querySelector('#template-book').innerHTML),
};
const select = {
  booksList: '.books-list',
  filters: '.filters form',
  bookRating: '.book__rating__fill',
  bookImage: '.book__image',
};
const classNames = {
  bookImage: 'book__image',
  hidden: 'hidden',
  favorite: 'favorite',
};
class BooksList {
  constructor(data) {
    const thisBooksList = this;
    thisBooksList.data = data;
    thisBooksList.getElements();
    thisBooksList.booksRender();
    thisBooksList.initActions();
    
  }
  getElements() {
    const thisBooksList = this;

    thisBooksList.dom = {};
    thisBooksList.dom.booksContainer = document.querySelector(select.booksList);
    thisBooksList.dom.filtersForm = document.querySelector(select.filters);
  }
  booksRender() {
    const thisBooksList = this;
    for (let book of thisBooksList.data) {
      const generatedHTML = template.bookMenu(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      const bookRatingStyle = generatedDOM.querySelector(select.bookRating).style;
      const newBookRating = book.rating * 10;
      const bookRatingWidth = newBookRating + '%';
      bookRatingStyle.background = thisBooksList.bookRatingBgc(book.rating);
      bookRatingStyle.width = bookRatingWidth;
      thisBooksList.dom.booksContainer.appendChild(generatedDOM);
    }
  }
  bookRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
  initActions() {
    const thisBooksList = this;

    const favoritesBooks = [];
    thisBooksList.filters = [];
    
    thisBooksList.dom.booksContainer.addEventListener('dblclick', function (event) {
      event.preventDefault();
      const clickedElement = event.target.offsetParent;
      if (clickedElement.classList.contains(classNames.bookImage)) {
        if (favoritesBooks.includes(clickedElement.dataset)) {
          clickedElement.classList.remove(classNames.favorite);
          const bookIndex = favoritesBooks.indexOf(clickedElement.dataset);
          favoritesBooks.splice(bookIndex, 1);
        } else {
          clickedElement.classList.add(classNames.favorite);
          favoritesBooks.push(clickedElement.dataset);
        }
      }
    });
    thisBooksList.dom.filtersForm.addEventListener('click', function (event) {
      const clickedElement = event.target;
      if (clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
        if (clickedElement.checked == true) {
          thisBooksList.filters.push(clickedElement.value);
        } else {
          const index = thisBooksList.filters.indexOf(clickedElement.value);
          thisBooksList.filters.splice(index, 1);
        }
        thisBooksList.filterBooks();
      }
    });
  }
  filterBooks(){
    const thisBooksList = this;
    for (let book of dataSource.books) {
      const bookToBeHidden = document.querySelector(select.bookImage + '[data-id="' + book.id + '"]');
      let shouldBeHidden = false;
      for (let filter of thisBooksList.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        bookToBeHidden.classList.add(classNames.hidden);
      } else {
        bookToBeHidden.classList.remove(classNames.hidden);
      }
    }
  }
}
const app = new BooksList(dataSource.books);
app();