#!/usr/bin/env node
/**
 * Pianeta Media — ingest one-shot delle 10 immagini reali già presenti in public/og/.
 *
 * Per ogni immagine:
 *   1. Upload al bucket Supabase `pianeta-media-photos`
 *   2. Insert riga in pianeta_media_photos (status=pending)
 *   3. Upsert usages in pianeta_media_usages
 *   4. Thumbnail 480px, colore dominante, caption AI, embedding, posizionamento
 *   5. Aggiorna riga con tutti i dati → status=published
 *
 * Idempotente: se storage_path esiste già, skippa upload/insert.
 * SVG: se sharp fallisce, viene skippatp con avviso (non blocca il batch).
 *
 * Uso:
 *   cd <repo-root>
 *   node --env-file=.env.local scripts/media-ingest.mjs
 *
 * Oppure con .env.local letto manualmente (Node <20):
 *   node scripts/media-ingest.mjs
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ---------------------------------------------------------------------------
// Env loading (compatibile sia Node 20+ con --env-file, sia env già iniettato)
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// Se le variabili non sono già nel processo, prova a caricarle da .env.local
if (!process.env.BOSCO_SUPABASE_URL) {
  const envPath = resolve(REPO_ROOT, '.env.local');
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '').replace(/\\n$/, '').trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.BOSCO_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.BOSCO_SUPABASE_SERVICE_KEY;
const BUCKET = process.env.PIANETA_MEDIA_BUCKET || 'pianeta-media-photos';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TABLE = 'pianeta_media_photos';
const NEAREST_RPC = 'pianeta_media_photos_nearest';
const THUMB_WIDTH = 480;
const EMBED_MODEL = 'text-embedding-3-small';
const EMBED_DIM = 1536;
const CAPTION_MODEL = 'gpt-4o-mini';
const JITTER = 18;
const NO_EMBED_SPREAD = 15;
const PROJECT_CLUSTER_RADIUS = 240;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing BOSCO_SUPABASE_URL or BOSCO_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Manifest: le 10 immagini da ingestare
// File locale → usages [{ content_type, content_slug, field }]
// ---------------------------------------------------------------------------

const IMAGES = [
  {
    file: 'public/og/work-aries-cover.png',
    usages: [{ content_type: 'work', content_slug: 'aries-towards-smarter-sustainable-world', field: 'cover' }],
  },
  {
    file: 'public/og/work-bc3-reports-cover.png',
    usages: [{ content_type: 'work', content_slug: 'bc3-annual-reports', field: 'cover' }],
  },
  {
    file: 'public/og/work-bc3-cover.png',
    usages: [
      { content_type: 'work', content_slug: 'bc3-rebranding', field: 'cover' },
      { content_type: 'services', content_slug: 'brand-identity-rebranding', field: 'cover' },
    ],
  },
  {
    file: 'public/og/work-childfund-cover.png',
    usages: [{ content_type: 'work', content_slug: 'childfund-world-index', field: 'cover' }],
  },
  {
    file: 'public/og/work-eclag.png',
    usages: [{ content_type: 'work', content_slug: 'eclag', field: 'cover' }],
  },
  {
    file: 'public/og/work-untwist.png',
    usages: [
      { content_type: 'work', content_slug: 'untwist', field: 'cover' },
      { content_type: 'services', content_slug: 'editorial-educational-design', field: 'cover' },
    ],
  },
  {
    file: 'public/og/bollettino-swarm.png',
    usages: [{ content_type: 'bulletin', content_slug: 'swarm-neural-prediction', field: 'cover' }],
  },
  {
    file: 'public/og/bulletin-validare-campagna.png',
    usages: [{ content_type: 'bulletin', content_slug: 'validare-una-campagna-prima-di-produrla', field: 'cover' }],
  },
  {
    file: 'public/og/service-creativita-neuromarketing.png',
    usages: [{ content_type: 'services', content_slug: 'neuromarketing-lab', field: 'cover' }],
  },
  {
    // SVG — sharp tenta il processing; se fallisce, viene skippato con avviso
    file: 'public/og/chi-siamo.svg',
    usages: [{ content_type: 'bulletin', content_slug: 'chi-siamo', field: 'cover' }],
    isSvg: true,
  },
];

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

function supabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Pipeline helpers (inline — stesso algoritmo di media-pipeline.mjs)
// ---------------------------------------------------------------------------

async function extractColors(buffer) {
  const avg = await sharp(buffer).resize(1, 1).raw().toBuffer();
  const toHex = (r, g, b) =>
    '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  const avgHex = toHex(avg[0], avg[1], avg[2]);
  const { data, info } = await sharp(buffer).resize(8, 8).raw().toBuffer({ resolveWithObject: true });
  const counts = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const hex = toHex(data[i], data[i + 1], data[i + 2]);
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }
  const palette = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([h]) => h);
  return { avgHex, palette };
}

async function analyzeImage(publicUrl) {
  if (!OPENAI_API_KEY) return { caption: null, tags: [] };
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CAPTION_MODEL,
        response_format: { type: 'json_object' },
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'Analizza questa immagine di un progetto di comunicazione visiva (branding, web, print, identità) ' +
                'e rispondi SOLO con un oggetto JSON: ' +
                '{"caption": "descrizione breve in italiano, max 25 parole, concreta e visiva", ' +
                '"tags": ["array", "di", "1-3", "parole-chiave", "tra: branding web print identità fotografia illustrazione packaging UI"]}',
            },
            { type: 'image_url', image_url: { url: publicUrl } },
          ],
        }],
        max_tokens: 180,
      }),
    });
    if (!res.ok) { console.warn('  AI analysis HTTP error:', res.status); return { caption: null, tags: [] }; }
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return { caption: null, tags: [] };
    const parsed = JSON.parse(raw);
    return {
      caption: typeof parsed.caption === 'string' ? parsed.caption.trim() : null,
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t) => typeof t === 'string') : [],
    };
  } catch (e) {
    console.warn('  AI analysis error:', e.message);
    return { caption: null, tags: [] };
  }
}

async function embedText(text) {
  if (!OPENAI_API_KEY || !text?.trim()) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBED_MODEL, input: text.trim().slice(0, 8000) }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const vec = json.data?.[0]?.embedding;
    return Array.isArray(vec) && vec.length === EMBED_DIM ? vec : null;
  } catch { return null; }
}

function hash01(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) { h = (h << 5) - h + input.charCodeAt(i); h |= 0; }
  return (h >>> 0) / 4294967295;
}

function normalizeEmbedding(embedding) {
  if (!embedding) return null;
  if (Array.isArray(embedding)) return embedding;
  if (typeof embedding === 'string') {
    const trimmed = embedding.trim().replace(/^\[/, '').replace(/\]$/, '');
    if (!trimmed) return null;
    const parsed = trimmed.split(',').map(Number);
    return parsed.every(Number.isFinite) ? parsed : null;
  }
  return null;
}

async function projectAnchor(db, projectSlug) {
  if (!projectSlug) return { x: 0, y: 0 };
  const { data } = await db.from(TABLE).select('project_slug').not('project_slug', 'is', null).eq('status', 'published');
  const slugs = [...new Set((data ?? []).map((r) => r.project_slug).filter(Boolean))].sort();
  let idx = slugs.indexOf(projectSlug);
  if (idx === -1) idx = Math.floor(hash01(projectSlug) * Math.max(slugs.length, 1));
  const angle = (idx / Math.max(slugs.length, 1)) * Math.PI * 2;
  return { x: Math.cos(angle) * PROJECT_CLUSTER_RADIUS, y: Math.sin(angle) * PROJECT_CLUSTER_RADIUS };
}

async function computePosition(db, photoId, embeddingInput, projectSlug) {
  const jx = (hash01(photoId + ':x') - 0.5) * JITTER;
  const jy = (hash01(photoId + ':y') - 0.5) * JITTER;
  const anchor = await projectAnchor(db, projectSlug);
  const embedding = normalizeEmbedding(embeddingInput);
  if (!embedding) {
    const a = hash01(photoId) * Math.PI * 2;
    const r = NO_EMBED_SPREAD * (0.3 + hash01(photoId + ':r') * 0.7);
    return { x: anchor.x + Math.cos(a) * r + jx, y: anchor.y + Math.sin(a) * r + jy };
  }
  const { data, error } = await db.rpc(NEAREST_RPC, {
    query_embedding: `[${embedding.join(',')}]`,
    k: 15,
    exclude_id: photoId,
  });
  if (error || !data || data.length === 0) return { x: anchor.x + jx, y: anchor.y + jy };
  const sameProject = projectSlug ? data.filter((n) => n.project_slug === projectSlug) : [];
  const pool = sameProject.length > 0 ? sameProject : data;
  const scored = pool.map((n) => ({ x: n.pos_x, y: n.pos_y, score: 1 - n.distance }))
    .sort((a, b) => b.score - a.score).slice(0, 5);
  const cx = scored.reduce((s, n) => s + n.x, 0) / scored.length;
  const cy = scored.reduce((s, n) => s + n.y, 0) / scored.length;
  const LOCAL_OFFSET_MAX = 70;
  let offX = cx - anchor.x, offY = cy - anchor.y;
  const offDist = Math.hypot(offX, offY);
  if (offDist > LOCAL_OFFSET_MAX) { const s = LOCAL_OFFSET_MAX / offDist; offX *= s; offY *= s; }
  return { x: anchor.x + offX + jx, y: anchor.y + offY + jy };
}

// ---------------------------------------------------------------------------
// Main: ingest single image
// ---------------------------------------------------------------------------

async function ingestImage(db, entry) {
  const { file, usages, isSvg } = entry;
  const absPath = resolve(REPO_ROOT, file);
  if (!existsSync(absPath)) {
    console.warn(`  SKIP: file not found: ${absPath}`);
    return { skipped: true, reason: 'file_not_found' };
  }

  const filename = file.split('/').pop();
  const storagePath = `staff/${filename}`;

  // --- Idempotency: check for existing row ---
  const { data: existing } = await db.from(TABLE).select('id, status').eq('storage_path', storagePath).maybeSingle();
  let photoId;
  if (existing) {
    photoId = existing.id;
    console.log(`  EXISTS: ${storagePath} → id=${photoId} (status=${existing.status}), riprocesso…`);
  } else {
    // --- Upload file to Supabase Storage ---
    const fileBuffer = readFileSync(absPath);
    const contentType = isSvg ? 'image/svg+xml' : 'image/png';
    const { error: uploadErr } = await db.storage.from(BUCKET).upload(storagePath, fileBuffer, {
      contentType,
      cacheControl: '31536000',
      upsert: true,
    });
    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);
    console.log(`  Uploaded: ${storagePath}`);

    // --- Insert row ---
    const primaryUsage = usages[0];
    const projectSlugCache = `${primaryUsage.content_type}:${primaryUsage.content_slug}`;
    const { data: inserted, error: insertErr } = await db.from(TABLE).insert({
      storage_path: storagePath,
      source: 'staff',
      status: 'pending',
      project_slug: projectSlugCache,
    }).select('id').single();
    if (insertErr || !inserted) throw new Error(`Insert failed: ${insertErr?.message}`);
    photoId = inserted.id;
    console.log(`  Inserted: id=${photoId}`);
  }

  // --- Upsert usages ---
  const usageRows = usages.map((u) => ({
    photo_id: photoId,
    content_type: u.content_type,
    content_slug: u.content_slug,
    field: u.field || 'cover',
  }));
  const { error: usageErr } = await db.from('pianeta_media_usages').upsert(usageRows, {
    onConflict: 'photo_id,content_type,content_slug,field',
  });
  if (usageErr) console.warn(`  Usage upsert warning: ${usageErr.message}`);
  else console.log(`  Usages: ${usageRows.map((u) => `${u.content_type}:${u.content_slug}`).join(', ')}`);

  // --- Download from storage for processing ---
  const { data: blob, error: dlErr } = await db.storage.from(BUCKET).download(storagePath);
  if (dlErr || !blob) throw new Error(`Download for processing failed: ${dlErr?.message}`);
  const buffer = Buffer.from(await blob.arrayBuffer());

  // --- Thumbnail (skip SVG if sharp can't handle it) ---
  let thumbnailPath = null;
  try {
    // For SVG, rasterize at 2x to get a decent raster
    const sharpInput = isSvg ? sharp(buffer, { density: 144 }) : sharp(buffer);
    const thumbBuffer = await sharpInput.resize(THUMB_WIDTH).jpeg({ quality: 78 }).toBuffer();
    thumbnailPath = storagePath.replace(/\.[^.]+$/, '') + '-thumb.jpg';
    await db.storage.from(BUCKET).upload(thumbnailPath, thumbBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: true,
    });
    console.log(`  Thumbnail: ${thumbnailPath}`);
  } catch (e) {
    if (isSvg) {
      console.warn(`  SVG thumbnail skipped (sharp error): ${e.message}`);
    } else {
      throw e;
    }
  }

  // --- Colors (rasterize SVG first if needed) ---
  let colorAvgHex = null;
  let colorPalette = [];
  try {
    const rasterBuffer = isSvg
      ? await sharp(buffer, { density: 72 }).png().toBuffer()
      : buffer;
    const colors = await extractColors(rasterBuffer);
    colorAvgHex = colors.avgHex;
    colorPalette = colors.palette;
    console.log(`  Color: ${colorAvgHex}`);
  } catch (e) {
    console.warn(`  Color extraction failed: ${e.message}`);
  }

  // --- AI analysis (only for non-SVG or if thumbnail succeeded) ---
  let analysis = { caption: null, tags: [] };
  if (thumbnailPath) {
    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(thumbnailPath);
    analysis = await analyzeImage(pub.publicUrl);
    if (analysis.caption) console.log(`  Caption: ${analysis.caption}`);
  } else {
    console.log(`  AI analysis skipped (no thumbnail)`);
  }

  // --- Embedding + positioning ---
  const primaryUsage = usages[0];
  const projectSlugCache = `${primaryUsage.content_type}:${primaryUsage.content_slug}`;
  const embedding = analysis.caption ? await embedText(analysis.caption) : null;
  const position = await computePosition(db, photoId, embedding, projectSlugCache);
  console.log(`  Position: (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);

  // --- Update row: all metadata + status=published ---
  const updatePayload = {
    thumbnail_path: thumbnailPath,
    color_avg_hex: colorAvgHex,
    color_palette: colorPalette,
    caption: analysis.caption,
    tags: analysis.tags.length > 0 ? analysis.tags : null,
    embedding: embedding ? `[${embedding.join(',')}]` : null,
    pos_x: position.x,
    pos_y: position.y,
    project_slug: projectSlugCache,
    status: 'published',
    updated_at: new Date().toISOString(),
  };
  const { error: updateErr } = await db.from(TABLE).update(updatePayload).eq('id', photoId);
  if (updateErr) throw new Error(`Update failed: ${updateErr.message}`);
  console.log(`  Published: ${photoId}`);

  return { photoId, storagePath, usages, position };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const db = supabase();
const results = { ok: [], skipped: [], failed: [] };

console.log(`\nPianeta Media Ingest — ${IMAGES.length} immagini da processare`);
console.log(`Bucket: ${BUCKET}`);
console.log(`Supabase: ${SUPABASE_URL}\n`);

for (const entry of IMAGES) {
  console.log(`\n[${entry.file}]`);
  try {
    const result = await ingestImage(db, entry);
    if (result.skipped) {
      results.skipped.push({ file: entry.file, reason: result.reason });
    } else {
      results.ok.push({ file: entry.file, ...result });
    }
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
    results.failed.push({ file: entry.file, error: err.message });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n--- RIEPILOGO ---');
console.log(`OK: ${results.ok.length}`);
for (const r of results.ok) console.log(`  + ${r.file} → ${r.photoId}`);
if (results.skipped.length) {
  console.log(`Skippate: ${results.skipped.length}`);
  for (const r of results.skipped) console.log(`  ~ ${r.file} (${r.reason})`);
}
if (results.failed.length) {
  console.log(`Fallite: ${results.failed.length}`);
  for (const r of results.failed) console.log(`  ! ${r.file}: ${r.error}`);
  process.exit(1);
}
console.log('\nIngest completato.');
