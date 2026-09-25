import { isBookmarked, toggleBookmark } from './bookmarks.js';

let ALL_MARKETS = [];

export async function loadMarkets() {
  const res = await fetch('data/markets.json');
  ALL_MARKETS = await res.json();
  return ALL_MARKETS;
}

export function getMarketById(id) {
  return ALL_MARKETS.find(m => m.id === id);
}

function statusLabel(status) {
  return { open: 'Open Now', tomorrow: 'Opens Tomorrow', closed: 'Closed' }[status] || status;
}

function marketCard(m) {
  const saved = isBookmarked(m.id);
  return `
  <div class="market-card">
    <div class="thumb" style="background-color:#cfe3d2;">
      <span class="status-pill ${m.status}">${statusLabel(m.status)}</span>
      <button class="fav-btn ${saved ? 'saved' : ''}" data-bookmark="${m.id}" aria-label="Save market">
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
    <div class="body">
      <h3>${m.name}</h3>
      <div class="meta-line"><i class="fa-solid fa-location-dot"></i> ${m.area}</div>
      <div class="meta-line"><i class="fa-regular fa-clock"></i> ${m.days.join(' & ')} · ${m.hours}</div>
      <p style="font-size:11.5px; color:var(--text-muted); margin:8px 0 0;">Typical Produce</p>
      <div class="produce-tags">${m.produce.map(p => `<span>${p}</span>`).join('')}</div>
      <a href="#market/${m.id}" class="btn-view">View Details →</a>
    </div>
  </div>`;
}

function attachCardEvents(container) {
  container.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const m = getMarketById(btn.dataset.bookmark);
      const nowSaved = toggleBookmark({ id: m.id, name: m.name, type: 'market' });
      btn.classList.toggle('saved', nowSaved);
    });
  });
}

export function renderFeaturedMarkets() {
  const grid = document.getElementById('featuredMarketsGrid');
  const featured = ALL_MARKETS.slice(0, 4);
  grid.innerHTML = featured.map(marketCard).join('');
  attachCardEvents(grid);
}

export function renderDirectory(filters = {}) {
  const grid = document.getElementById('directoryGrid');
  let list = [...ALL_MARKETS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.produce.some(p => p.toLowerCase().includes(q)));
  }
  if (filters.day) list = list.filter(m => m.days.includes(filters.day));
  if (filters.produce) list = list.filter(m => m.produce.includes(filters.produce));

  if (filters.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === 'next') {
    const order = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    list.sort((a, b) => Math.min(...a.days.map(d => order.indexOf(d))) - Math.min(...b.days.map(d => order.indexOf(d))));
  }
  if (filters.nearMe && filters.userLat != null) {
    list.sort((a, b) => dist(filters.userLat, filters.userLng, a) - dist(filters.userLat, filters.userLng, b));
  }

  grid.innerHTML = list.length
    ? list.map(marketCard).join('')
    : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass" style="font-size:24px;"></i><p>No markets match those filters. Try broadening your search.</p></div>`;
  attachCardEvents(grid);
}

function dist(lat, lng, m) {
  return Math.hypot(lat - m.lat, lng - m.lng);
}

export function populateDirectoryFilters() {
  const days = [...new Set(ALL_MARKETS.flatMap(m => m.days))];
  const produce = [...new Set(ALL_MARKETS.flatMap(m => m.produce))].sort();
  const dayEl = document.getElementById('dirDayFilter');
  const prodEl = document.getElementById('dirProduceFilter');
  days.forEach(d => dayEl.insertAdjacentHTML('beforeend', `<option value="${d}">${d}</option>`));
  produce.forEach(p => prodEl.insertAdjacentHTML('beforeend', `<option value="${p}">${p}</option>`));
}

export function renderMarketDetail(id) {
  const m = getMarketById(id);
  const container = document.getElementById('marketDetailContent');
  const crumb = document.getElementById('detailBreadcrumb');
  if (!m) { container.innerHTML = `<p>Market not found.</p>`; return; }
  crumb.textContent = m.name;
  const saved = isBookmarked(m.id);

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap;">
      <div>
        <span class="status-pill ${m.status}" style="position:static; display:inline-block; margin-bottom:8px;">${statusLabel(m.status)}</span>
        <h2>${m.name}</h2>
        <p style="color:var(--text-muted); max-width:520px;">${m.description}</p>
      </div>
      <button class="btn-outline" id="detailBookmarkBtn"><i class="fa-solid fa-heart" style="color:${saved ? 'var(--heart-red)' : 'inherit'}"></i> ${saved ? 'Saved' : 'Save market'}</button>
    </div>
    <div class="detail-grid">
      <div>
        <iframe src="https://www.google.com/maps?q=${encodeURIComponent(m.address)}&output=embed" loading="lazy"></iframe>
        <p style="font-size:13px; color:var(--text-muted); margin-top:8px;"><i class="fa-solid fa-location-dot"></i> ${m.address}</p>
      </div>
      <div>
        <h3 style="font-size:15px;">Weekly Schedule</h3>
        <table class="schedule-table">
          ${m.days.map(d => `<tr><td>${d}</td><td style="text-align:right;">${m.hours}</td></tr>`).join('')}
        </table>
        <h3 style="font-size:15px;">Typically Available</h3>
        <div class="product-grid">${m.produce.map(p => `<span>${p}</span>`).join('')}</div>
      </div>
    </div>
  `;

  document.getElementById('detailBookmarkBtn').addEventListener('click', (e) => {
    const nowSaved = toggleBookmark({ id: m.id, name: m.name, type: 'market' });
    e.currentTarget.innerHTML = `<i class="fa-solid fa-heart" style="color:${nowSaved ? 'var(--heart-red)' : 'inherit'}"></i> ${nowSaved ? 'Saved' : 'Save market'}`;
  });
}
