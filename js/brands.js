// Brand rendering: images, cards, brand page, categories, saved (localStorage, by slug)
import { DB } from './data.js';
export const PR = ['€', '€€', '€€€', '€€€€'];
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let saved = [];
try { saved = JSON.parse(localStorage.getItem('newlabel:saved') || '[]').filter(x => typeof x === 'string'); } catch (e) {}
export const isSaved = s => saved.includes(s);
export const savedBrands = () => DB.brands.filter(b => saved.includes(b.slug));
export function updateCount() { const c = document.querySelector('#cnt'); if (c) c.textContent = saved.length ? `(${saved.length})` : ''; }
export function toggleSave(s) {
  saved = saved.includes(s) ? saved.filter(x => x !== s) : [...saved, s];
  try { localStorage.setItem('newlabel:saved', JSON.stringify(saved)); } catch (e) {}
  updateCount();
}

// Elegant placeholder (used when an image file is missing)
function placeholder(b, k = 0) {
  const h = [...b.slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) >>> 0, s = (h + k * 13) % 10, d = s % 2;
  const bg = d ? '#151515' : ['#ececec', '#dcdcdc', '#f4f4f4', '#cfcfcf'][s % 4], fg = d ? '#ededed' : '#0a0a0a', o = 10 + (s * 6) % 40;
  const sh = [`<rect x="${120 + o}" y="90" width="${160 - o}" height="300" fill="${fg}"/>`, `<circle cx="${160 + o}" cy="${200 + s * 6}" r="${90 + s * 5}" fill="${fg}"/>`, `<polygon points="${80 + o},400 200,${60 + s * 8} ${330 - o},400" fill="${fg}"/>`][(h + k) % 3];
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${bg}"/>${sh}<rect y="470" width="400" height="1" fill="${fg}"/></svg>`);
}
// Real image path; app.js swaps in the placeholder if the file 404s
export const img = (b, file, k = 0, extra = '') =>
  `<img src="images/brands/${b.slug}/${encodeURIComponent(file)}" data-ph="${placeholder(b, k)}" alt="${esc(b.name)}" loading="lazy" ${extra}>`;

export function card(b) {
  return `<a class="it fade" href="#/brand/${b.slug}"><div class="im">${img(b, b.cover)}<button class="sv" data-s="${b.slug}" aria-label="Save brand">${isSaved(b.slug) ? '♥' : '♡'}</button><span class="vb">VIEW BRAND →</span></div><h3>${esc(b.name)}</h3><div class="m">${esc([b.city, b.country].filter(Boolean).join(', '))}<br>${b.categories.map(esc).join(' / ')}</div><p>${esc(b.shortDescription)}</p><div class="tg">${b.styles.map(x => `<span>${esc(x)}</span>`).join('')}</div></a>`;
}

export function brandPage(b) {
  const loc = [b.city, b.country].filter(Boolean).join(', '), ig = b.instagram.replace(/^@/, '');
  const cell = (l, v) => v ? `<div><small>${l}</small>${v}</div>` : '';
  return `<a class="m lk" href="#/brands" style="display:inline-block;margin-top:24px">← ALL BRANDS</a><h1 class="bh">${esc(b.name)}</h1>
<p class="m" style="font-size:16px">${esc(loc)}<br>${b.styles.concat(b.categories).map(esc).join(' / ')}</p>
${img(b, b.cover, 0, 'style="width:100%;max-height:78vh;object-fit:cover;margin:32px 0;display:block;background:var(--g1)"')}
<p class="ed">${esc(b.description)}</p>
<div class="sec" style="padding:24px 0 0"><h2 style="font-size:40px">DETAILS</h2></div>
<div class="dt">${cell('Founded', b.foundedYear)}${cell('Location', esc(loc))}${cell('Category', b.categories.map(esc).join(' / '))}${cell('Style', b.styles.map(esc).join(' / '))}${cell('Price', PR[b.priceRange - 1])}${cell('Type', esc(b.brandType))}${ig ? cell('Instagram', `<a class="lk" href="https://instagram.com/${encodeURIComponent(ig)}" target="_blank" rel="noopener">@${esc(ig)}</a>`) : ''}</div>
${b.gallery.length ? `<div class="sec" style="padding:24px 0"><h2 style="font-size:40px">COLLECTION</h2></div><div class="grid">${b.gallery.map((f, k) => `<div class="it" style="grid-column:span 4">${img(b, f, k + 1, 'style="--r:4/5"')}</div>`).join('')}</div>` : ''}
<div style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap">${b.website ? `<a class="btn" href="${esc(b.website)}" target="_blank" rel="noopener">VISIT WEBSITE →</a>` : ''}<button class="btn o" data-s="${b.slug}" data-txt>${isSaved(b.slug) ? 'SAVED ♥' : 'SAVE BRAND ♡'}</button></div>`;
}

export function categoriesPage() {
  const m = new Map();
  DB.brands.forEach(b => b.categories.forEach(c => m.set(c, [...(m.get(c) || []), b])));
  const cats = [...m].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  return `<section class="sec"><h2>CATEGORIES</h2><p class="sub">Start with what you wear.</p><div class="ct">${cats.map(([c, l]) => `<a class="cc" href="#/category/${encodeURIComponent(c)}">${img(l[0], l[0].cover, 2)}<div><h3>${esc(c)}</h3><span class="m" style="color:#ddd">${l.length} BRAND${l.length > 1 ? 'S' : ''}</span></div></a>`).join('')}</div></section>`;
}

export function savedPage() {
  const r = savedBrands();
  return `<section class="sec"><h2>SAVED BRANDS</h2>${r.length ? `<div class="grid" style="margin-top:32px">${r.map(card).join('')}</div>` : `<p class="sub">You haven't saved any brands yet.</p><a class="btn" href="#/">START DISCOVERING →</a>`}</section>`;
}
