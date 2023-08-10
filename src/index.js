import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchBreeds } from './js/functions';
import { createMarkupPictures } from './js/functions';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38710040-e4c1e1eb16f2bb925e73b2921';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'orientation';
const SAFE_SERACH = 'true';
let SEARCH_TERM = '';
let PER_PAGE = '6';
let TOTAL_HITS = 1;
let PAGE = 1;

const form = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const list = document.querySelector('ul.gallery');
const loadMore = document.querySelector('.load-more');

//налаштування для Notflix
Notiflix.Notify.init({
  width: '480px',
  position: 'right-top',
  distance: '90px',
  opacity: 1,
  fontSize: '20px',
  clickToClose: true,
  timeout: 3000,
  // ...
});

//налаштування для simpleLightBox
let lightbox = new SimpleLightbox('.gallery a', {
  caption: true,
  captionsData: 'alt',
  captionDelay: 250,
});

lightbox.refresh();

//слідкувач для кнопки запускає ф-цію getPictures
form.addEventListener('submit', getPictures);
loadMore.addEventListener('click', getApiPictures);

//ф-ція з input витягує текст і викликає ф-цію, яка з цим текстом витягує з сервера фото
function getPictures(e) {
  e.preventDefault();
  resetData();
  const { searchQuery } = e.currentTarget.elements;
  SEARCH_TERM = searchQuery.value;
  getApiPictures(PAGE);
}

//ф-ція примайє сторінку, на якій потрібно взяти дані з API
function getApiPictures(page = 1) {
  let url = `${BASE_URL}?key=${API_KEY}&q=
               ${SEARCH_TERM}&image_type=${IMAGE_TYPE}&orientation=
               ${ORIENTATION}&safesearch=${SAFE_SERACH}&per_page=${PER_PAGE}&page=${PAGE}`;

  fetchBreeds(url).then(renderData).catch(errorfetchData);
}

//якщо дані витягуємо вдало, то кладемо їх в масив
function renderData(dataPictures) {
  if (dataPictures.total === 0) {
    Notiflix.Notify.failure('Немає інформації по цьому запиту!');
    return;
  }

  TOTAL_HITS = dataPictures.totalHits;
  console.log(TOTAL_HITS);
  console.log(PER_PAGE * PAGE);
  console.log();
  let markup = createMarkupPictures(dataPictures);
  list.insertAdjacentHTML('beforeend', markup);

  showBtnLoad();

  if (PAGE === 1) {
    Notiflix.Notify.success(`Hooray! We found ${TOTAL_HITS} images.`);
  }
  PAGE += 1;
}

//якщо дані витягуємо невдало
function errorfetchData() {
  btnLoadMore.hidden = true;
  Notiflix.Notify.failure('Не вдалося загрузити картинки з серверу!');
}

function showBtnLoad() {
  btnLoadMore.hidden = PER_PAGE * PAGE !== TOTAL_HITS ? false : true;
  // if (PER_PAGE * PAGE !== TOTAL_HITS) {
  //   btnLoadMore.hidden = false;
  // } else {
  //   btnLoadMore.hidden = true;
  // }
}

//ф-ція скидає усі дані і очищає сторінку
function resetData() {
  btnLoadMore.hidden = true;
  list.innerHTML = '';
  PAGE = 1;
}