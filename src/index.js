import Notiflix from 'notiflix';
import { getItems } from './api';
import { createCardItem } from './utils';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let searchQuery = '';
let maxPage = 1;

const formEl = document.querySelector('#search-form');
formEl.addEventListener('submit', onSubmitForm);

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.addEventListener('click', onloadMore);
loadMoreBtn.style.display = 'none';

const galleryEl = document.querySelector('.gallery');

const scrollDown = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

function createCards(itemArr) {
  const galleryItems = itemArr.map(el => {
    return createCardItem(el);
  });

  galleryEl.insertAdjacentHTML('beforeend', galleryItems.join(''));
  let lightbox = new SimpleLightbox('.gallery a', {
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

async function onSubmitForm(event) {
  event.preventDefault();
  const value = event.target.elements[0].value.trim();
  if (!value || searchQuery === value) {
    return;
  }
  loadMoreBtn.style.display = 'none';
  page = 1;
  galleryEl.innerHTML = '';
  searchQuery = value;

  const result = await getItems(searchQuery);
  if (!result || result.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  createCards(result.hits);
  Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
  maxPage = Math.ceil(result.totalHits / 40);
  loadMoreBtn.style.display = maxPage > 1 ? 'block' : 'none';

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
async function onloadMore() {
  page += 1;
  const result = await getItems(searchQuery, page);
  createCards(result.hits);
  scrollDown();
  if (maxPage === page) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
