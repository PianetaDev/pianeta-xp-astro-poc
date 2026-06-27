import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const ROOT = 'public';
const DIRS = ['og', 'choosetoseethem', 'team'];
const MIN_SIZE = 5 * 1024;
const MAX_DIM = 1280;       // era 1600 — più che sufficiente per hero detail page
const CARD_DIM = 720;       // era 800 — index card thumb
const WEBP_QUALITY = 72;    // era 80
const CARD_QUALITY = 60;    // era 72
const AVIF_QUALITY = 50;    // AVIF è più efficiente di webp
const PNG_QUALITY = 80;

async function walk(dir) {
  const out = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(p)));
      else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(p);
    }
  } catch { /* missing dir ok */ }
  return out;
}

function fmt(b) { return (b / 1024).toFixed(0) + 'KB'; }

let total = 0;
let saved = 0;
let processed = 0;

for (const d of DIRS) {
  const files = await walk(join(ROOT, d));
  for (const file of files) {
    const s = (await stat(file)).size;
    if (s < MIN_SIZE) continue;
    const ext = extname(file).toLowerCase();
    const dir = dirname(file);
    const base = basename(file, ext);

    // Generate WebP @ MAX_DIM (hero) — strip metadata
    const webpPath = join(dir, base + '.webp');
    try {
      await sharp(file).rotate().resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true }).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(webpPath);
    } catch (e) { console.error('webp fail', file, e.message); continue; }

    // Generate AVIF (better compression than webp) — hero
    const avifPath = join(dir, base + '.avif');
    try {
      await sharp(file).rotate().resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true }).avif({ quality: AVIF_QUALITY, effort: 6 }).toFile(avifPath);
    } catch (e) { console.error('avif fail', file, e.message); }

    // Generate smaller WebP card thumbnail @ CARD_DIM
    const cardPath = join(dir, base + '-card.webp');
    try {
      await sharp(file).rotate().resize(CARD_DIM, CARD_DIM, { fit: 'inside', withoutEnlargement: true }).webp({ quality: CARD_QUALITY, effort: 6 }).toFile(cardPath);
    } catch (e) { console.error('card fail', file, e.message); }

    // Generate AVIF card thumb
    const cardAvifPath = join(dir, base + '-card.avif');
    try {
      await sharp(file).rotate().resize(CARD_DIM, CARD_DIM, { fit: 'inside', withoutEnlargement: true }).avif({ quality: AVIF_QUALITY - 5, effort: 6 }).toFile(cardAvifPath);
    } catch (e) { /* ok */ }

    // Shrink original png/jpg in place
    const tmpPath = file + '.tmp';
    try {
      const meta = await sharp(file).metadata();
      const pipe = sharp(file).resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
      if (ext === '.png') await pipe.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmpPath);
      else await pipe.jpeg({ quality: 82, mozjpeg: true }).toFile(tmpPath);
      const newSize = (await stat(tmpPath)).size;
      if (newSize < s) {
        await sharp(tmpPath).toFile(file + '.bak');
        await sharp(tmpPath).toFile(file);
      }
      await (await import('fs/promises')).unlink(tmpPath).catch(() => {});
      await (await import('fs/promises')).unlink(file + '.bak').catch(() => {});
    } catch (e) { console.error('png fail', file, e.message); }

    const w = (await stat(webpPath)).size;
    const p = (await stat(file)).size;
    total += s;
    saved += (s - Math.min(w, p));
    processed++;
    console.log(`  ${file.replace(ROOT + '/', '')}  ${fmt(s)} → png ${fmt(p)} · webp ${fmt(w)}`);
  }
}

console.log(`\n${processed} files. Total before: ${fmt(total)}. Saved (vs webp): ${fmt(saved)}.`);
