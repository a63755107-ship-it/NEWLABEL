// Hash router: #/ #/brands #/brand/<slug> #/categories #/category/<name> #/saved #/about #/submit
import { DB } from './data.js';
import { card, brandPage, categoriesPage, savedPage } from './brands.js';
import { st, resetFilters, exploreHTML, refresh } from './filters.js';
const app = document.querySelector('#app');
const page = h => { app.innerHTML = `<div class="fade">${h}</div>`; scrollTo(0, 0); };
export const showFatal = () => page(`<div class="none"><h2>NO BRANDS LOADED.</h2><p class="sub">Run <b>npm run generate-brands</b> and open the site through a local server (<b>npm start</b> or Live Server), not file://. Details in the browser console.</p></div>`);
const FIELDS = ['Brand name', 'Website', 'Instagram', 'Country', 'City', 'Category', 'Style', 'Price range', 'Contact email'];

export function route() {
  document.querySelector('#mn').classList.remove('open');
  const p = location.hash.replace('#/', '').split('/'), v = p[0];
  if (v === 'brand') { const b = DB.brands.find(x => x.slug === p[1]); return page(b ? brandPage(b) : '<div class="none"><h2>NOTHING FOUND.</h2><a class="btn" href="#/brands">ALL BRANDS</a></div>'); }
  if (v === 'categories') return page(categoriesPage());
  if (v === 'saved') return page(savedPage());
  if (v === 'category') { resetFilters(); st.f.category = [decodeURIComponent(p[1] || '')]; page(exploreHTML(st.f.category[0].toUpperCase())); return refresh(); }
  if (v === 'brands') { page(exploreHTML()); return refresh(); }
  if (v === 'about') return page(`<h1 class="bh" style="font-size:clamp(56px,18vw,88px)">NEWLABEL</h1><p class="ab">NEWLABEL IS A CURATED DIRECTORY FOR THE NEXT GENERATION OF FASHION.</p><p class="ed">Most independent labels never reach the big marketplaces. NEWLABEL exists to put them in front of people who care: one place to find them, filter them and follow them back to their own websites. We don't sell clothes. We point you to the people making them.</p>`);
  if (v === 'submit') return page(`<section class="sec"><h2>SUBMIT YOUR BRAND</h2><p class="sub">Are you building something worth discovering?</p><form id="sf">${FIELDS.map(l => `<div><label>${l.toUpperCase()}</label><input name="${l}" type="${l === 'Contact email' ? 'email' : 'text'}" required></div>`).join('')}<div class="f"><label>DESCRIPTION</label><textarea name="Description" rows="3"></textarea></div><div><label>LOGO</label><input name="logo" type="file"></div><div><label>BRAND IMAGES</label><input name="images" type="file" multiple></div><div class="f"><button class="btn">SUBMIT BRAND →</button><p class="m" style="margin-top:10px" id="sm">All submissions are reviewed before being published.</p></div></form></section>`);
  resetFilters();
  const ft = DB.brands.filter(b => b.featured);
  page(`<section class="hero"><h1>DISCOVER<br>WHAT'S<br>NEXT.</h1><p>Discover independent fashion brands before everyone else does.</p><div class="bar"><input id="hq" placeholder="Search brands, styles, countries..." aria-label="Search"></div></section>
${ft.length ? `<section class="sec" style="padding-top:24px"><h2>FEATURED BRANDS</h2><p class="sub">Independent labels worth knowing.</p><div class="grid">${ft.map(card).join('')}</div></section>` : ''}${exploreHTML()}<div style="margin-top:48px"><a class="btn o" href="#/submit">SUBMIT A BRAND →</a></div>`);
  refresh();
}
