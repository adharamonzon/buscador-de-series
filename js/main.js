'use strict';

const bnt = document.querySelector('.js-btn');
const list = document.querySelector('.js-list');
let favoritesList = document.querySelector('.js-favorite-list');

let series = [];
let favorites = []; //quiero guardar este array en el local storage

//función para coger las series que estoy buscando del servidor
function getSerie(ev) {
  ev.preventDefalut;
  const newInput = document.querySelector('.js-input').value;
  fetch(`http://api.tvmaze.com/search/shows?q=${newInput}`)
    .then(response => response.json())
    .then(data => {
      series = []; //sería igual hacer un series.splice (0); o (0,10000) al querer borrar todo vale con poner un 0.
      for (let i = 0; i < data.length; i++) {
        series.push({ id: data[i].show.id, name: data[i].show.name, image: data[i].show.image });
        if (series[i].image === null) {
          series[i].image = 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV';
        } else {
          series[i].image = data[i].show.image.medium;
        }
      }
      paintCard();
      listenFavoriteSerie();

      setInLocalSotrage();
    });
}
bnt.addEventListener('click', getSerie);

//seleccionar favoritos
const listenFavoriteSerie = () => {
  const clickSerie = document.querySelectorAll('.js-invisible-input');
  for (const selected of clickSerie) {
    selected.addEventListener('click', addSerie);
  }
};
const addSerie = ev => {
  debugger;
  const clickedSerieId = parseInt(ev.currentTarget.id);
  let favSerie;
  for (const serie of series) {
    if (serie.id === clickedSerieId) {
      favSerie = serie.id;
      favorites.push(favSerie);
    }
    paintFavCard();
  }
};

//pintar la lista de series buscadas
function paintCard() {
  let listCode = '';
  for (const serie of series) {
    listCode += `<li class="js-invisible-input list-item" id="${serie.id}">`;
    listCode += `<h3 class="serie-title">${serie.name} </h3>`;
    listCode += `<div class="image-container"><img class"image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    listCode += `</li>`;
    list.innerHTML = listCode;
  }
}
//pintar las películas favoritas
function paintFavCard() {
  let listCode = '';
  for (const serie of favorites) {
    listCode += `<li class="js-invisible-input list-item" id="${serie.id}">`;
    listCode += `<h3 class="serie-title">${serie.name} </h3>`;
    listCode += `<div class="image-container"><img class"image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name}"></div>`;
    listCode += `</li>`;
    favoritesList.innerHTML = listCode;
  }
}
//local storage

const getFromLocalStorage = () => {
  const localStorageFavorite = localStorage.getItem('favoutiresSeries');
  if (localStorageFavorite !== null) {
    favorites = JSON.parse(localStorageFavorite);
    paintFavCard();
  }
};

const setInLocalSotrage = () => {
  const stringifyFavorites = JSON.stringify(favorites);
  localStorage.setItem('favoutiresSeries', stringifyFavorites);
};

getFromLocalStorage();
