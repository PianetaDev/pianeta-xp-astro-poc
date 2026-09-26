import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

// Convenzione (vedi docs/IMAGE_FORMATS.md): tre derivati per immagine sorgente.
//   1) <base>.webp      → hero detail page (max 1280px lato lungo)
//   2) <base>-card.webp → card indice + "Continua a leggere" (max 720px)
//   3) <base>-tile.webp → tile bento home (max 1440px lato lungo, q80) — PIA-1645
// AVIF non è usato in nessun <picture> del sito: pipeline semplificata.
const ROOT = 'public';
const DIRS = ['og', 'choosetoseethem', 'team'];
const MIN_SIZE = 5 * 1024;
const MAX_DIM = 1280;
const CARD_DIM = 720;
const TILE_DIM = 1440;
const WEBP_QUALITY = 72;
const CARD_QUALITY = 60;
const TILE_QUALITY = 80;
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

    // Generate smaller WebP card thumbnail @ CARD_DIM
    const cardPath = join(dir, base + '-card.webp');
    try {
      await sharp(file).rotate().resize(CARD_DIM, CARD_DIM, { fit: 'inside', withoutEnlargement: true }).webp({ quality: CARD_QUALITY, effort: 6 }).toFile(cardPath);
    } catch (e) { console.error('card fail', file, e.message); }

    // Generate large WebP tile @ TILE_DIM (bento home) — PIA-1645
    const tilePath = join(dir, base + '-tile.webp');
    try {
      await sharp(file).rotate().resize(TILE_DIM, TILE_DIM, { fit: 'inside', withoutEnlargement: true }).webp({ quality: TILE_QUALITY, effort: 6 }).toFile(tilePath);
    } catch (e) { console.error('tile fail', file, e.message); }

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
