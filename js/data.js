// Loads brands from data/brands-index.json + data/brands/<slug>/brand.json
export const DB = { brands: [] };
const list = v => Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()) : [];
const getJSON = async u => { const r = await fetch(u, { cache: 'no-cache' }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };

export function normalize(raw, folder) {
  if (!raw || typeof raw !== 'object' || !String(raw.name || '').trim()) throw new Error('missing "name"');
  const im = raw.images || {}, sd = String(raw.shortDescription || raw.description || '').trim(), p = Math.round(+raw.priceRange);
  return {
    name: raw.name.trim(), slug: folder, // folder name is the canonical slug (it also locates the images)
    city: String(raw.city || '').trim(), country: String(raw.country || '').trim(),
    categories: list(raw.categories), styles: list(raw.styles),
    priceRange: p >= 1 && p <= 4 ? p : 2, brandType: String(raw.brandType || '').trim(),
    foundedYear: +raw.foundedYear || null, featured: raw.featured === true, views: +raw.views || 0,
    createdAt: String(raw.createdAt || '1970-01-01'), shortDescription: sd, description: String(raw.description || sd),
    website: /^https?:\/\//.test(raw.website || '') ? raw.website : '', instagram: String(raw.instagram || ''),
    cover: String(im.cover || 'cover.jpg'), gallery: list(im.gallery),
  };
}

export async function loadBrands() {
  let idx;
  try { idx = await getJSON('data/brands-index.json'); }
  catch (e) { console.error('[NEWLABEL] Cannot read data/brands-index.json. Run "npm run generate-brands" and use a local server (not file://).', e); return { fatal: true }; }
  if (!Array.isArray(idx)) { console.error('[NEWLABEL] brands-index.json must be an array of folder names'); return { fatal: true }; }
  const slugs = [...new Set(idx.filter(s => typeof s === 'string' && /^[\w-]+$/.test(s)))];
  const res = await Promise.allSettled(slugs.map(s => getJSON(`data/brands/${s}/brand.json`)));
  res.forEach((r, i) => {
    if (r.status === 'rejected') return console.warn(`[NEWLABEL] skipped "${slugs[i]}":`, r.reason.message);
    try { DB.brands.push(normalize(r.value, slugs[i])); } catch (e) { console.warn(`[NEWLABEL] skipped "${slugs[i]}":`, e.message); }
  });
  return { fatal: false };
}
