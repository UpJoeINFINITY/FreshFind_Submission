const BOOKMARK_KEY = 'freshfind_bookmarks';
const NOTE_KEY_PREFIX = 'freshfind_note_';

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || [];
  } catch { return []; }
}

export function isBookmarked(id) {
  return getBookmarks().some(b => b.id === id);
}

export function toggleBookmark(item) {
  const list = getBookmarks();
  const idx = list.findIndex(b => b.id === item.id);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(item);
  }
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
  updateBookmarkBadge();
  return idx === -1; // true if now bookmarked
}

export function getNote(id) {
  return sessionStorage.getItem(NOTE_KEY_PREFIX + id) || '';
}

export function saveNote(id, text) {
  sessionStorage.setItem(NOTE_KEY_PREFIX + id, text);
}

export function updateBookmarkBadge() {
  const el = document.getElementById('bookmarkCount');
  if (el) el.textContent = getBookmarks().length;
}

export function exportBookmarks() {
  const list = getBookmarks();
  if (!list.length) return 'No saved items yet.';
  return list.map(b => `• ${b.name} (${b.type})${getNote(b.id) ? ' — note: ' + getNote(b.id) : ''}`).join('\n');
}

export function renderBookmarksPage() {
  const container = document.getElementById('bookmarksList');
  const list = getBookmarks();
  if (!list.length) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-heart-crack" style="font-size:28px; margin-bottom:10px;"></i><p>You haven't saved anything yet. Tap the heart on any market or produce card.</p></div>`;
    return;
  }
  container.innerHTML = list.map(item => `
    <div class="market-card" style="display:flex; align-items:center; gap:16px; padding:14px; margin-bottom:12px;">
      <div style="flex:1;">
        <h3 style="margin-bottom:4px;">${item.name}</h3>
        <p style="font-size:12.5px; color:var(--text-muted); margin:0 0 8px;">${item.type === 'market' ? 'Market' : 'Produce'}</p>
        <textarea class="bookmark-note" data-id="${item.id}" placeholder="Add a personal note (this session only)...">${getNote(item.id)}</textarea>
      </div>
      <button class="fav-btn saved" data-remove="${item.id}" aria-label="Remove"><i class="fa-solid fa-heart"></i></button>
    </div>
  `).join('');

  container.querySelectorAll('.bookmark-note').forEach(ta => {
    ta.addEventListener('input', e => saveNote(e.target.dataset.id, e.target.value));
  });
  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBookmark({ id: btn.dataset.remove });
      renderBookmarksPage();
    });
  });
}
