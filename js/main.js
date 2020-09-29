'use strict';

const bnt = document.querySelector('.js-btn');
const list = document.querySelector('.js-list');
let favoritesList = document.querySelector('.js-favorite-list');
const form = document.querySelector('.js-form');

let series = [];
let favorites = []; //array local storage

//función para coger las series que estoy buscando del servidor
function getSerie(ev) {
  ev.preventDefault();
  const newInput = document.querySelector('.js-input').value;
  fetch(`https://api.tvmaze.com/search/shows?q=${newInput}`)
    .then((response) => response.json())
    .then((data) => {
      series = [];
      for (let i = 0; i < data.length; i++) {
        series.push({ id: data[i].show.id, name: data[i].show.name, image: data[i].show.image, status: data[i].show.status, genres: data[i].show.genres, link: data[i].show.officialSite });
        if (series[i].image === null) {
          series[i].image = 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV';
        } else {
          series[i].image = data[i].show.image.medium;
        }
      }
      paintCard();
    });
}
bnt.addEventListener('click', getSerie);
form.addEventListener('submit', getSerie);

//escuchar favoritos (añadir y borrar)
const listenAddFavoriteSerie = () => {
  const clickSerie = document.querySelectorAll('.js-li');
  for (const selected of clickSerie) {
    selected.addEventListener('click', handleClick);
  }
};
const listenRemoveFavoriteSerie = () => {
  const clickSerie = document.querySelectorAll('.js-li-fav');
  for (const selected of clickSerie) {
    selected.addEventListener('click', handleClick);
  }
};
//función para marcar una serie como favorita
const handleClick = (ev) => {
  ev.preventDefault();
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const indexFavorites = favorites.findIndex((favorites) => favorites.id === clickedSerieId);
  const indexSeries = series.findIndex((series) => series.id === clickedSerieId);
  if (indexFavorites === -1) {
    favorites.push({ id: series[indexSeries].id, name: series[indexSeries].name, image: series[indexSeries].image });
  } else {
    favorites.splice(indexFavorites, 1);
  }
  paintCard();
  paintFavCard();
  setInLocalStorage();
};

//pintar la lista de series buscadas
function paintCard() {
  let listCode = '';
  for (const serie of series) {
    const indexFavorites = favorites.findIndex((favorites) => favorites.id === serie.id);
    if (indexFavorites !== -1) {
      //estructura de serie favorita
      listCode += `<li class="js-li is-fav main--series__list--item" id="${serie.id}">`;
      listCode += `<h3 class="js-serie-title main--series__list--item__title is-fav__title">${serie.name}`;
      listCode += `<img class="main--series__list--item__favorite-icon" src="./assets/images/palomitas.png" alt="serie en favoritos">`;
      listCode += `</h3>`;
      listCode += `<div class="js-image-container main--series__list--item__image ">`;
      listCode += `<img  class="is-fav__image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    } else {
      //estructura serie no favoritos
      listCode += `<li class="js-li main--series__list--item" id="${serie.id}">`;
      listCode += `<h3 class="js-serie-title main--series__list--item__title">${serie.name} </h3>`;
      listCode += `<div class="js-image-container main--series__list--item__image">`;
      listCode += `<img  class"fav-image info" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    }
    //sección de información extra
    listCode += `<div class="js-info-container info-container">`;
    listCode += `<h4 class="genre"> Géneros: </h4>`;
    listCode += `<ul>`;
    for (const gender of serie.genres) {
      listCode += `<li class="genre__item">`;
      listCode += `<p>${gender}</p>`;
      listCode += `</li>`;
    }
    listCode += `</ul>`;
    if (serie.status === 'Ended') {
      listCode += `<h4>Estado: `;
      listCode += `<p>Terminada</p>`;
      listCode += `</h4>`;
    } else if (serie.status === 'Running') {
      listCode += `<h4>Estado: `;
      listCode += `<p>En emisión</p>`;
      listCode += `</h4>`;
    } else {
      listCode += `<h4>Estado:`;
      listCode += `<p>Sin información</p></h4>`;
    }

    listCode += `</div>`;
    listCode += `</li>`;
  }
  list.innerHTML = listCode;
  listenAddFavoriteSerie();
  trigerEvent();
  getMoreInfo();
}
//más información
const infoContainer = document.querySelectorAll('.info-container');

const trigerEvent = () => {
  const infoTrigers = document.querySelectorAll('.js-li');
  for (const triger of infoTrigers) {
    triger.addEventListener('mouseover', getMoreInfo);
  }
};

/* const handleClick = (ev) => {
  ev.preventDefault();
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const indexFavorites = favorites.findIndex((favorites) => favorites.id === clickedSerieId);
  const indexSeries = series.findIndex((series) => series.id === clickedSerieId);
  if (indexFavorites === -1) {
    favorites.push({ id: series[indexSeries].id, name: series[indexSeries].name, image: series[indexSeries].image });
  } else {
    favorites.splice(indexFavorites, 1);
  } */

const getMoreInfo = (ev) => {
  ev.preventDefault();
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const indexSeries = series.findIndex((series) => series.id === clickedSerieId);
  indexSeries.classList.add('show');
  /*   infoContainer.forEach((container) => container.classList.add('show'));
   */

  paintCard();
};

/* 
infoTrigers.forEach((triger) => {
  triger.addEventListener('mouseover', getMoreInfo);
});  */

//pintar las series favoritas en la sección favoritos
function paintFavCard() {
  let listCode = '';
  for (const serie of favorites) {
    listCode += `<li class="js-li-fav favorites--list-item" id="${serie.id}">`;
    listCode += `<h3 class="favorites--list-item__title">${serie.name}`;
    listCode += `<img class="favorites--list-item__trash-icon" src="./assets/images/trash.svg" title="borrar esta serie" alt="icono para borrar la serie">`;
    listCode += `</h3>`;
    listCode += `<div class="js-image-container image-container">`;
    listCode += `<img class"image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    listCode += `</li>`;
  }
  favoritesList.innerHTML = listCode;
  listenRemoveFavoriteSerie();
}

//delete All favorites

const deleteAll = document.querySelector('.js-delete-all');

const deletedFavorites = () => {
  favorites = [];
  paintCard();
  paintFavCard();
  setInLocalStorage();
};

deleteAll.addEventListener('click', deletedFavorites);

//mensaje de error con la búsqueda
if (series.length >= 0) {
  const message = document.querySelector('.js-message');
  message.innerHTML = 'Ninguna serie encontrada';
} else {
  message.innerHTML = 'Resultados de tu búsqueda:';
}

//local storage

const getFromLocalStorage = () => {
  const localStorageFavorite = localStorage.getItem('favoutiresSeries');
  if (localStorageFavorite !== null) {
    favorites = JSON.parse(localStorageFavorite);
    paintFavCard();
  }
};

const setInLocalStorage = () => {
  const stringifyFavorites = JSON.stringify(favorites);
  localStorage.setItem('favoutiresSeries', stringifyFavorites);
};

getFromLocalStorage();
