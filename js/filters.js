// Search + filters + sorting. Filter options are generated from the loaded data.
import { DB } from './data.js';
import { card, esc, PR } from './brands.js';
const $ = s => document.querySelector(s);
export const st = { q: '', sort: 'Featured', f: { category: [], style: [], location: [], price: [], type: [] } };
export const resetFilters = () => { st.q = ''; Object.keys(st.f).forEach(k => st.f[k] = []); };
const DEM = { Spain: 'spanish', France: 'french', Japan: 'japanese', Denmark: 'danish scandinavian', Sweden: 'swedish scandinavian', Norway: 'norwegian scandinavian', UK: 'british english', Italy: 'italian', Portugal: 'portuguese', Germany: 'german', USA: 'american', Brazil: 'brazilian', 'South Korea': 'korean', Australia: 'australian' };
const uniq = a => [...new Set(a.filter(Boolean))].sort((x, y) => x.localeCompare(y));

export function facets() {
  const B = DB.brands;
  return { category: uniq(B.flatMap(b => b.categories)), style: uniq(B.flatMap(b => b.styles)), location: uniq(B.map(b => b.country)),
    price: [...new Set(B.map(b => b.priceRange))].sort().map(n => PR[n - 1]), type: uniq(B.map(b => b.brandType)) };
}
function match(b) {
  const f = st.f, q = st.q.trim().toLowerCase();
  const hay = [b.name, b.shortDescription, b.description, b.city, b.country, DEM[b.country] || '', ...b.categories, ...b.styles, b.brandType].join(' ').toLowerCase();
  return (!q || q.split(/\s+/).every(w => hay.includes(w)))
    && (!f.category.length || f.category.some(x => b.categories.includes(x)))
    && (!f.style.length || f.style.some(x => b.styles.includes(x)))
    && (!f.location.length || f.location.includes(b.country))
    && (!f.price.length || f.price.includes(PR[b.priceRange - 1]))
    && (!f.type.length || f.type.includes(b.brandType));
}
const SORT = { Featured: (a, b) => b.featured - a.featured || a.name.localeCompare(b.name), Newest: (a, b) => b.createdAt.localeCompare(a.createdAt), 'A–Z': (a, b) => a.name.localeCompare(b.name), 'Most viewed': (a, b) => b.views - a.views };
const chips = (k, a) => a.length ? `<div class="fg"><b>${k.toUpperCase()}</b>${a.map(x => `<button class="ch${st.f[k].includes(x) ? ' on' : ''}" data-f="${k}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : '';

export function results() {
  const r = DB.brands.filter(match).sort(SORT[st.sort]);
  $('#res').innerHTML = r.length ? `<div class="m" style="margin-bottom:20px">${r.length} brands</div><div class="grid f${r.length < 4 ? 3 : ''}">${r.map(card).join('')}</div>`
    : `<div class="none"><h2>NOTHING FOUND.</h2><p class="sub">Try another search or remove some filters.</p><button class="btn" data-clear>CLEAR FILTERS</button></div>`;
}
export function filtersUI() {
  const F = facets();
  $('#fl').innerHTML = `<div class="fg" style="border:0"><b>SORT</b><select id="so">${Object.keys(SORT).map(x => `<option${st.sort == x ? ' selected' : ''}>${x}</option>`).join('')}</select></div>` + Object.keys(F).map(k => chips(k, F[k])).join('') + `<button class="btn x" style="width:100%" data-close>SHOW RESULTS</button>`;
}
export const refresh = () => { filtersUI(); results(); };
export const exploreHTML = (title = 'EXPLORE BRANDS') => `<section class="sec" id="explore"><h2>${esc(title)}</h2><p class="sub">Search by name, style, city or country. Combine with filters.</p>
<div class="bar"><input id="q" value="${esc(st.q)}" placeholder="Search brands..." aria-label="Search brands"></div>
<button class="fb" data-open>FILTER + SORT</button><div class="lay" style="margin-top:28px"><aside class="fl" id="fl"></aside><div id="res"></div></div></section>`;
