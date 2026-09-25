import { loadMarkets, renderFeaturedMarkets, renderDirectory, populateDirectoryFilters, renderMarketDetail } from './market.js';
import { loadProduce, renderSeasonalPreview, renderProduceGuide, populateProduceFilters } from './produce.js';
import { loadChatbotData, initChatbot } from './chatbot.js';
import { updateBookmarkBadge, renderBookmarksPage, exportBookmarks } from './bookmarks.js';

const PAGES = ['home', 'market-directory', 'market-detail', 'produce-guide', 'bookmarks', 'about', 'contact'];

/* ---------- Router ---------- */
function showPage(routeKey) {
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('active', p === routeKey);
  });
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === routeKey);
  });
  window.scrollTo(0, 0);
}

function handleRoute() {
  const hash = location.hash.replace('#', '') || 'home';

  if (hash.startsWith('market/')) {
    const id = hash.split('/')[1];
    renderMarketDetail(id);
    showPage('market-detail');
    return;
  }

  if (PAGES.includes(hash)) {
    if (hash === 'market-directory') { renderDirectory(); }
    if (hash === 'produce-guide') { renderProduceGuide(); }
    if (hash === 'bookmarks') { renderBookmarksPage(); }
    showPage(hash);
  } else {
    showPage('home');
  }
}

/* ---------- Visitor counter (simulated, localStorage) ---------- */
function initVisitorCounter() {
  let count = parseInt(localStorage.getItem('freshfind_visitors') || '005866', 10);
  if (!sessionStorage.getItem('freshfind_counted')) {
    count += 1;
    localStorage.setItem('freshfind_visitors', count);
    sessionStorage.setItem('freshfind_counted', 'true');
  }
  document.getElementById('visitorCount').textContent = String(count).padStart(6, '0');
}

/* ---------- Real-time clock ---------- */
function initClock() {
  const el = document.getElementById('liveClock');
  function tick() {
    el.textContent = new Date().toLocaleString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
  tick();
  setInterval(tick, 1000 * 30);
}

/* ---------- Directory filter wiring ---------- */
function initDirectoryFilters() {
  const search = document.getElementById('dirSearchInput');
  const day = document.getElementById('dirDayFilter');
  const produce = document.getElementById('dirProduceFilter');
  const sort = document.getElementById('dirSort');
  const geoBtn = document.getElementById('dirGeoBtn');
  let geo = {};

  function apply() {
    renderDirectory({
      search: search.value, day: day.value, produce: produce.value, sort: sort.value, ...geo
    });
  }
  [search, day, produce, sort].forEach(el => el.addEventListener('input', apply));

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => { geo = { nearMe: true, userLat: pos.coords.latitude, userLng: pos.coords.longitude }; apply(); },
      () => { alert('Location access denied — showing all markets instead.'); }
    );
  });
}

/* ---------- Hero search -> directory ---------- */
function initHeroSearch() {
  document.getElementById('heroSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('heroSearchInput').value;
    const day = document.getElementById('heroDayFilter').value;
    location.hash = 'market-directory';
    setTimeout(() => {
      document.getElementById('dirSearchInput').value = q;
      document.getElementById('dirDayFilter').value = day;
      renderDirectory({ search: q, day });
    }, 0);
  });
}

/* ---------- Contact form (client-side only) ---------- */
function initContactForm() {
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contactConfirm').classList.add('show');
    e.target.reset();
  });
}

/* ---------- Dummy login/signup ---------- */
function initDummyAuth() {
  document.getElementById('loginBtn').addEventListener('click', () => alert('Login is for UI demonstration only in this build.'));
  document.getElementById('signupBtn').addEventListener('click', () => alert('Sign up is for UI demonstration only in this build.'));
}

/* ---------- Export bookmarks ---------- */
function initExportBookmarks() {
  document.getElementById('exportBookmarksBtn').addEventListener('click', () => {
    alert(exportBookmarks());
  });
}

/* ---------- Boot ---------- */
async function boot() {
  await Promise.all([loadMarkets(), loadProduce(), loadChatbotData()]);

  renderFeaturedMarkets();
  renderSeasonalPreview();
  populateDirectoryFilters();
  populateProduceFilters();
  updateBookmarkBadge();
  initChatbot();
  initVisitorCounter();
  initClock();
  initDirectoryFilters();
  initHeroSearch();
  initContactForm();
  initDummyAuth();
  initExportBookmarks();

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

boot();
