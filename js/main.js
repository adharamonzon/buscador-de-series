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
  fetch(`http://api.tvmaze.com/search/shows?q=${newInput}`)
    .then(response => response.json())
    .then(data => {
      series = [];
      for (let i = 0; i < data.length; i++) {
        series.push({ id: data[i].show.id, schedule: data[i].show.schedule.time, name: data[i].show.name, image: data[i].show.image });
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

const btnLog = document.querySelector('.js-btn-log');

function showFavorites() {
  for (const serie of favorites) {
    console.log(serie.name);
  }
}

btnLog.addEventListener('click', showFavorites);

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

const handleClick = ev => {
  ev.preventDefault();
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const indexFavorites = favorites.findIndex(favorites => favorites.id === clickedSerieId);
  const indexSeries = series.findIndex(series => series.id === clickedSerieId);
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
    const indexFavorites = favorites.findIndex(favorites => favorites.id === serie.id);
    if (indexFavorites !== -1) {
      listCode += `<li class="js-li is-fav list-item" id="${serie.id}">`;
      listCode += `<h3 class="js-serie-title serie-title">${serie.name}`;
      listCode += `<img class="icon-favorite" src="./css/images/icons8-palomitas-48.png" alt="serie en favoritos">`;
      listCode += `</h3>`;
    } else {
      listCode += `<li class="js-li list-item" id="${serie.id}">`;
      listCode += `<h3 class="js-serie-title serie-title">${serie.name} </h3>`;
    }
    listCode += `<h4> ${serie.schedule}</h4>`;
    listCode += `<div class="js-image-container image-container">`;
    listCode += `<img class"image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    listCode += `</li>`;
  }
  list.innerHTML = listCode;
  listenAddFavoriteSerie();
}
//pintar las series favoritas
function paintFavCard() {
  let listCode = '';
  for (const serie of favorites) {
    listCode += `<li class="js-li-fav list-item" id="${serie.id}">`;
    listCode += `<h3 class="serie-title">${serie.name}`;
    listCode += `<img class="cross-icon" src="./css/images/trash-alt-solid.svg" title="borrar esta serie" alt="icono para borrar la serie">`;
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
