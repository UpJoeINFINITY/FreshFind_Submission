import { isBookmarked, toggleBookmark } from './bookmarks.js';

let ALL_PRODUCE = [];

export async function loadProduce() {
  const res = await fetch('data/produce.json');
  ALL_PRODUCE = await res.json();
  return ALL_PRODUCE;
}

function produceCard(p) {
  const saved = isBookmarked(p.id);
  return `
  <div class="produce-card" style="position:relative;">
    <div class="thumb" style="background-color:#dfeee1;"></div>
    <button class="fav-btn ${saved ? 'saved' : ''}" data-bookmark="${p.id}" style="position:absolute; top:8px; right:8px;" aria-label="Save produce">
      <i class="fa-solid fa-heart"></i>
    </button>
    <div class="body">
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
    </div>
  </div>`;
}

function attachCardEvents(container) {
  container.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = ALL_PRODUCE.find(x => x.id === btn.dataset.bookmark);
      const nowSaved = toggleBookmark({ id: p.id, name: p.name, type: 'produce' });
      btn.classList.toggle('saved', nowSaved);
    });
  });
}

export function renderSeasonalPreview() {
  const grid = document.getElementById('seasonalProduceGrid');
  grid.innerHTML = ALL_PRODUCE.slice(0, 4).map(produceCard).join('');
  attachCardEvents(grid);
}

export function populateProduceFilters() {
  const bar = document.getElementById('produceFilterBar');
  const cats = [...new Set(ALL_PRODUCE.map(p => p.category))];
  cats.forEach(c => bar.insertAdjacentHTML('beforeend', `<button class="filter-chip" data-cat="${c}">${c}</button>`));
  bar.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProduceGuide(btn.dataset.cat);
    });
  });
}

export function renderProduceGuide(category = '') {
  const grid = document.getElementById('produceGuideGrid');
  const list = category ? ALL_PRODUCE.filter(p => p.category === category) : ALL_PRODUCE;
  grid.innerHTML = list.length
    ? list.map(p => `
      <div class="produce-card" style="text-align:left; position:relative;">
        <div class="thumb" style="background-color:#dfeee1;"></div>
        <button class="fav-btn ${isBookmarked(p.id) ? 'saved' : ''}" data-bookmark="${p.id}" style="position:absolute; top:8px; right:8px;" aria-label="Save produce">
          <i class="fa-solid fa-heart"></i>
        </button>
        <div class="body">
          <h3>${p.name}</h3>
          <p style="margin:4px 0;">In season: ${p.season}</p>
          <p style="font-size:12px;">${p.description}</p>
        </div>
      </div>`).join('')
    : `<div class="empty-state">No produce found in this category.</div>`;
  attachCardEvents(grid);
}
