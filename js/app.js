import { loadBrands } from './data.js';
import { toggleSave, isSaved, updateCount } from './brands.js';
import { st, resetFilters, results, refresh } from './filters.js';
import { route, showFatal } from './router.js';
import { submitBrand } from './submit.js';
const $ = s => document.querySelector(s);

// Missing image file -> elegant placeholder
document.addEventListener('error', e => { const t = e.target; if (t.tagName === 'IMG' && t.dataset.ph && !t.dataset.done) { t.dataset.done = 1; t.src = t.dataset.ph; } }, true);

document.addEventListener('click', e => {
  const t = e.target.closest('[data-s],[data-f],[data-clear],[data-open],[data-close],#menu'); if (!t) return;
  if (t.dataset.s) {
    e.preventDefault(); e.stopPropagation(); toggleSave(t.dataset.s); const on = isSaved(t.dataset.s);
    t.textContent = t.hasAttribute('data-txt') ? (on ? 'SAVED ♥' : 'SAVE BRAND ♡') : (on ? '♥' : '♡');
    if (location.hash === '#/saved') route();
  } else if (t.dataset.f) { const a = st.f[t.dataset.f], i = a.indexOf(t.dataset.v); i < 0 ? a.push(t.dataset.v) : a.splice(i, 1); refresh(); }
  else if (t.hasAttribute('data-clear')) { resetFilters(); const q = $('#q'); if (q) q.value = ''; refresh(); }
  else if (t.hasAttribute('data-open')) $('#fl').classList.add('open');
  else if (t.hasAttribute('data-close')) $('#fl').classList.remove('open');
  else if (t.id === 'menu') $('#mn').classList.toggle('open');
}, true);
document.addEventListener('input', e => {
  if (e.target.id === 'q') { st.q = e.target.value; results(); }
  if (e.target.id === 'hq') { st.q = e.target.value; $('#q').value = st.q; results(); if (st.q) $('#explore').scrollIntoView({ behavior: 'smooth' }); }
});
document.addEventListener('change', e => { if (e.target.id === 'so') { st.sort = e.target.value; results(); } });
document.addEventListener('submit', async e => {
  if (e.target.id !== 'sf') return; e.preventDefault();
  const r = await submitBrand(new FormData(e.target));
  $('#sm').textContent = r.ok ? 'Thanks. Your brand is in the review queue.' : r.reason === 'no-backend' ? 'Preview only: submissions are not stored yet (no backend connected).' : 'Could not send. Please try again.';
});
addEventListener('hashchange', route);
(async () => { updateCount(); const { fatal } = await loadBrands(); updateCount(); fatal ? showFatal() : route(); })();
