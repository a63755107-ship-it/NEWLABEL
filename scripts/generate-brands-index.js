// Scans data/brands/*/brand.json and writes data/brands-index.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'data', 'brands');
const slugs = [];
for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const file = path.join(dir, e.name, 'brand.json');
  if (!fs.existsSync(file)) { console.warn(`! ${e.name}: no brand.json, skipped`); continue; }
  try { JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (err) { console.warn(`! ${e.name}: invalid JSON (${err.message}), skipped`); continue; }
  if (!fs.existsSync(path.join(root, 'images', 'brands', e.name, 'cover.jpg'))) console.warn(`  ${e.name}: no cover.jpg yet (placeholder will be used)`);
  slugs.push(e.name);
}
slugs.sort();
fs.writeFileSync(path.join(root, 'data', 'brands-index.json'), JSON.stringify(slugs, null, 2) + '\n');
console.log(`brands-index.json: ${slugs.length} brands`);
