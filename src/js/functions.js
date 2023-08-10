import axios from 'axios';

const API_KEY = '38710040-e4c1e1eb16f2bb925e73b2921';

export function fetchBreeds(URL) {
  return axios.get(URL).then(result => {
    return result.data;
  });
}

export function createMarkupPictures(array) {
  return array.hits
    .map(
      event =>
        `<li class="gallery__item">
           <a class="gallery__link" href="${event.largeImageURL}" >
             <img class="gallery__image" src="${event.webformatURL}" alt="${event.tags}" loading="lazy"  />
           </a>
           <div class="info">
             <p class="info-item">
             <b>Likes</b></br>
             ${event.likes}
             </p>
             <p class="info-item">
             <b>Views</b></br>
             ${event.views}
             </p>
             <p class="info-item">
             <b>Comments</b></br>
             ${event.comments}
             </p>
             <p class="info-item">
             <b>Downloads</b></br>
             ${event.downloads}
            </p>
          </div>
        </li>`
    )
    .join('');
}
