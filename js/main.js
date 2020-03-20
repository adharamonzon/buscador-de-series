'use strict';

const bnt = document.querySelector('.js-btn');
const list = document.querySelector('.js-list');
let favoritesList = document.querySelector('.js-favorite-list');

let series = [];
let favorites = [];

function getSerie(ev) {
  ev.preventDefalut;
  const newInput = document.querySelector('.js-input').value;
  fetch(`http://api.tvmaze.com/search/shows?q=${newInput}`)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        series.push({ id: data[i].show.id, name: data[i].show.name, image: data[i].show.image.medium });
        if (series.image === null) {
          serie.image('https://via.placeholder.com/210x295/ffffff/666666/? text=TV');
        }
      }
    });
  favorites.push(series[0]);
  paintCard();
}

bnt.addEventListener('click', getSerie);

function paintCard() {
  let listCode = '';
  for (const serie of series) {
    listCode += `<li class="list-item" id="${serie.id}">`;
    listCode += `<h3 class="serie-title">${serie.name} </h3>`;
    listCode += `<div class="image-container"><img class"image" src="${serie.image}" title="serie ${serie.name}" alt="fotografía de la serie: ${serie.name})</div>">`;
    listCode += `</li>`;
    list.innerHTML = listCode;
  }
  favoritesList.innerHTML = listCode;
}
