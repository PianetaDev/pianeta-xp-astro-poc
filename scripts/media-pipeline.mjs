#!/usr/bin/env node
/**
 * Pianeta Media — pipeline di ingest per xp.pianeta.studio
 *
 * Adattato da bosco-observatory/api/watchers/_pipeline.mjs.
 * Processa le foto caricate nel bucket Supabase `pianeta-media-photos`
 * (Bosco Colto Supabase project, schema isolato `pianeta_media_photos`):
 *   1. Download originale → thumbnail 480px
 *   2. Estrazione colore dominante
 *   3. Analisi AI: caption IT + tag progetto (GPT-4o-mini)
 *   4. Embedding testuale (text-embedding-3-small)
 *   5. Posizionamento KNN nel canvas 2D (stessa logica centroide-KNN di Bosco)
 *   6. Aggiornamento riga pianeta_media_photos
 *
 * Uso:
 *   BOSCO_SUPABASE_URL=... BOSCO_SUPABASE_SERVICE_KEY=... \
 *   PIANETA_MEDIA_BUCKET=pianeta-media-photos \
 *   OPENAI_API_KEY=... \
 *   node scripts/media-pipeline.mjs --photo-id=<uuid>
 *
 * Oppure per processare tutti i pending:
 *   node scripts/media-pipeline.mjs --batch
 *
 * NON tocca mai watchers_photos o qualsiasi altra tabella Bosco.
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

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

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

function supabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing BOSCO_SUPABASE_URL or BOSCO_SUPABASE_SERVICE_KEY');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Color extraction
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

// ---------------------------------------------------------------------------
// AI analysis
// ---------------------------------------------------------------------------

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
                'Analizza questa foto di un progetto di comunicazione visiva (branding, web, print, identità) ' +
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
    if (!res.ok) return { caption: null, tags: [] };
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return { caption: null, tags: [] };
    const parsed = JSON.parse(raw);
    return {
      caption: typeof parsed.caption === 'string' ? parsed.caption.trim() : null,
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t) => typeof t === 'string') : [],
    };
  } catch {
    return { caption: null, tags: [] };
  }
}

// ---------------------------------------------------------------------------
// Embedding
// ---------------------------------------------------------------------------

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
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Positioning
// ---------------------------------------------------------------------------

function hash01(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
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

// Known project slugs → fixed position on a circle for cluster separation.
// New slugs get a hash-based angle (stable, non-colliding).
async function projectAnchor(db, projectSlug) {
  if (!projectSlug) return { x: 0, y: 0 };
  // Fetch existing distinct slugs to build a stable index
  const { data } = await db
    .from(TABLE)
    .select('project_slug')
    .not('project_slug', 'is', null)
    .eq('status', 'published');
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
  if (error || !data || data.length === 0) {
    return { x: anchor.x + jx, y: anchor.y + jy };
  }

  const sameProject = projectSlug ? data.filter((n) => n.project_slug === projectSlug) : [];
  const pool = sameProject.length > 0 ? sameProject : data;

  const scored = pool
    .map((n) => ({
      x: n.pos_x,
      y: n.pos_y,
      // Simple semantic score: 1 - distance (cosine similarity proxy)
      score: 1 - n.distance,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const cx = scored.reduce((s, n) => s + n.x, 0) / scored.length;
  const cy = scored.reduce((s, n) => s + n.y, 0) / scored.length;

  const LOCAL_OFFSET_MAX = 70;
  let offX = cx - anchor.x;
  let offY = cy - anchor.y;
  const offDist = Math.hypot(offX, offY);
  if (offDist > LOCAL_OFFSET_MAX) {
    const scale = LOCAL_OFFSET_MAX / offDist;
    offX *= scale;
    offY *= scale;
  }
  return { x: anchor.x + offX + jx, y: anchor.y + offY + jy };
}

// ---------------------------------------------------------------------------
// Process one photo
// ---------------------------------------------------------------------------

async function processPhoto(photoId, options = {}) {
  const db = supabase();

  // Fetch row to get storage_path and project_slug
  const { data: row, error: fetchErr } = await db
    .from(TABLE)
    .select('storage_path, project_slug')
    .eq('id', photoId)
    .single();
  if (fetchErr || !row) throw new Error(`Photo not found: ${photoId} — ${fetchErr?.message}`);

  const { storage_path: storagePath, project_slug: projectSlug } = row;
  console.log(`Processing ${photoId} (${storagePath})…`);

  // Download from Supabase Storage
  const { data: blob, error: dlErr } = await db.storage.from(BUCKET).download(storagePath);
  if (dlErr || !blob) throw new Error(`Download failed: ${dlErr?.message}`);
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Thumbnail
  const thumbBuffer = await sharp(buffer).resize(THUMB_WIDTH).jpeg({ quality: 78 }).toBuffer();
  const thumbnailPath = storagePath.replace(/\.[^.]+$/, '') + '-thumb.jpg';
  await db.storage.from(BUCKET).upload(thumbnailPath, thumbBuffer, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: true,
  });

  // Colors
  let colorAvgHex = null;
  let colorPalette = [];
  try {
    const colors = await extractColors(buffer);
    colorAvgHex = colors.avgHex;
    colorPalette = colors.palette;
  } catch { /* best-effort */ }

  // AI analysis
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(thumbnailPath);
  const analysis = options.skipAnalysis
    ? { caption: null, tags: [] }
    : await analyzeImage(pub.publicUrl);

  const embedding = analysis.caption ? await embedText(analysis.caption) : null;
  const position = await computePosition(db, photoId, embedding, projectSlug);

  // Update row
  const { error: updateErr } = await db
    .from(TABLE)
    .update({
      thumbnail_path: thumbnailPath,
      color_avg_hex: colorAvgHex,
      color_palette: colorPalette,
      caption: analysis.caption,
      tags: analysis.tags.length > 0 ? analysis.tags : undefined,
      embedding: embedding ? `[${embedding.join(',')}]` : null,
      pos_x: position.x,
      pos_y: position.y,
      updated_at: new Date().toISOString(),
    })
    .eq('id', photoId);
  if (updateErr) throw new Error(`Update failed: ${updateErr.message}`);

  console.log(`Done: ${photoId} → pos (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
  return { photoId, pos: position };
}

// ---------------------------------------------------------------------------
// Batch mode: process all published photos with missing thumbnail or pos_x
// ---------------------------------------------------------------------------

async function processBatch(options = {}) {
  const db = supabase();
  const { data, error } = await db
    .from(TABLE)
    .select('id')
    .eq('status', 'published')
    .or('thumbnail_path.is.null,pos_x.is.null');
  if (error) throw new Error(`Batch query failed: ${error.message}`);
  const ids = (data ?? []).map((r) => r.id);
  console.log(`Batch: ${ids.length} photos to process`);
  for (const id of ids) {
    try {
      await processPhoto(id, options);
    } catch (err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const photoIdArg = args.find((a) => a.startsWith('--photo-id='))?.split('=')[1];
const isBatch = args.includes('--batch');
const skipAnalysis = args.includes('--skip-analysis');

if (!photoIdArg && !isBatch) {
  console.error('Usage: node scripts/media-pipeline.mjs --photo-id=<uuid>');
  console.error('       node scripts/media-pipeline.mjs --batch [--skip-analysis]');
  process.exit(1);
}

try {
  if (isBatch) {
    await processBatch({ skipAnalysis });
  } else {
    await processPhoto(photoIdArg, { skipAnalysis });
  }
} catch (err) {
  console.error('Pipeline error:', err.message);
  process.exit(1);
}
