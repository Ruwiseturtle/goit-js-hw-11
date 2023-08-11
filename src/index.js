import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchBreeds, createMarkupPictures } from './js/functions';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38710040-e4c1e1eb16f2bb925e73b2921';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'orientation';
const SAFE_SERACH = 'true';
let SEARCH_TERM = '';
const PER_PAGE = '10';
let TOTAL_HITS = 1;
let PAGE = 1;

const form = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const list = document.querySelector('ul.gallery');

//--------налаштування для simpleLightBox---------
let lightbox = new SimpleLightbox('.gallery a', {
  caption: true,
  captionsData: 'alt',
  captionDelay: 250,
});

//-----створення та налаштування обсервера --------
const options = {
    threshold: 1
}

const callback = function (entries, observer) {
    entries.forEach(entry => {
        const { target, isIntersecting, intersectionRatio } = entry;

        if (isIntersecting) {
            hideLoading();
            getApiPictures(PAGE);
        }
    })
}

const observer = new IntersectionObserver(callback, options);
observer.observe(btnLoadMore);

//-------------------------------------------------


//слідкувач для кнопки запускає ф-цію getPictures
form.addEventListener('submit', getPictures);

//ф-ція з input витягує текст і викликає ф-цію, яка з цим текстом витягує з сервера фото
function getPictures(e) {
  e.preventDefault();
    resetData();
    
  const { searchQuery } = e.currentTarget.elements;
  SEARCH_TERM = searchQuery.value;
  
//   getApiPictures(PAGE);
    showLoading();
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
    if (dataPictures.total === 0 || SEARCH_TERM === '') {
        Notiflix.Notify.failure('Немає інформації по цьому запиту!');
        resetData();
    return;
  }
    
    TOTAL_HITS = dataPictures.totalHits;
    let markup = createMarkupPictures(dataPictures);
    list.insertAdjacentHTML('beforeend', markup);

  if (PAGE === 1) {
     Notiflix.Notify.success(`Hooray! We found ${TOTAL_HITS} images.`);
  }
    nextPage();
}

//якщо дані витягуємо невдало
function errorfetchData() {
    
  resetData();
  Notiflix.Notify.failure('Не вдалося загрузити картинки з серверу!');
}

function nextPage() {
  if (PER_PAGE * PAGE !== TOTAL_HITS && TOTAL_HITS >= PER_PAGE) {
      PAGE += 1;
      showLoading();
    } 
  else {
      hideLoading();
    }
  lightbox.refresh();
}

//ф-ція скидає усі дані і очищає сторінку
function resetData() {
  list.innerHTML = '';
  PAGE = 1;
}

function showLoading() {
     btnLoadMore.hidden = false;
}

function hideLoading() {
  btnLoadMore.hidden = true;
}

//налаштування для Notflix
Notiflix.Notify.init({
  width: '480px',
  position: 'right-top',
  distance: '10px',
  opacity: 1,
  fontSize: '20px',
  clickToClose: true,
  timeout: 3000,
  // ...
});
