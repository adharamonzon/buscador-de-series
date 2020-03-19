'use strict';

const bnt = document.querySelector('.js-btn');
const list = document.querySelector('.js-list');

let series = [];

function getSerie() {
  const newInput = document.querySelector('.js-input').value;

  fetch(`http://api.tvmaze.com/shows?q=${newInput}`)
    .then(response => response.json())
    .then(data => {
      series = data;
    });
  paintCard();
}

bnt.addEventListener('click', getSerie);

function paintCard() {
  let listCode = '';
  listCode += `<li class="js-li">`;
  listCode += `<h3 class="serie-title">nombre de la serie </h3>`; //${input.name}
  listCode += `<img class"image" src="" title="serie (nombre de la serie" alt="fotografía de la serie: (nombre de la serie")">`; //${input.src}
  listCode += `<p>descripción de la serie </p>`;
  listCode += `</li>`;
  list.innerHTML = listCode;
}
getSerie();
paintCard();
