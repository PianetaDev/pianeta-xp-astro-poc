/**
 * PIA-1541 Fase 2 — Integrity tests per posts/reels/embeds
 *
 * 1. embeds_integrity: ogni embed { type, slug } in work/bulletin
 *    deve puntare a uno slug esistente nella collezione corrispondente (posts/reels)
 *    che NON sia in draft.
 *
 * 2. photo_refs_integrity: ogni photoId/posterPhotoId in posts/reels
 *    deve esistere in pianeta_media_photos con status='published' su Supabase
 *    (fyflddqouoqtdnilqhms — Pianeta.Watchers/Bosco project).
 *
 * I test passano trivialmente quando le collezioni posts/reels sono vuote.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentRoot = join(__dirname, '..', '..', 'src', 'content');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Estrae il blocco YAML frontmatter grezzo */
function extractYamlBlock(content: string): string {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/** true se il frontmatter contiene draft: true */
function isDraft(yaml: string): boolean {
  return /^draft:\s*true\s*$/m.test(yaml);
}

/**
 * Estrae photoIds dall'yaml. Supporta due formati:
 *   photoIds:
 *     - "uuid"
 * oppure inline (raro ma gestito):
 *   photoIds: ["uuid"]
 */
function extractPhotoIds(yaml: string): string[] {
  // Trova il blocco lista di photoIds
  const blockMatch = yaml.match(/^photoIds:\s*\n((?:[ \t]*-[^\n]*\n?)*)/m);
  if (blockMatch) {
    return blockMatch[1]
      .split('\n')
      .map(l => l.replace(/^[ \t]*-\s*["']?/, '').replace(/["']?\s*$/, '').trim())
      .filter(Boolean);
  }
  // Inline array (es. photoIds: ["a", "b"])
  const inlineMatch = yaml.match(/^photoIds:\s*\[([^\]]*)\]/m);
  if (inlineMatch) {
    return inlineMatch[1]
      .split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return [];
}

/** Estrae posterPhotoId (singolo UUID opzionale) */
function extractPosterPhotoId(yaml: string): string | null {
  const m = yaml.match(/^posterPhotoId:\s*["']?([0-9a-f-]{36})["']?\s*$/m);
  return m ? m[1] : null;
}

/**
 * Estrae il blocco embeds. Ogni item ha type: post|reel e slug: <slug>.
 * Formato atteso:
 *   embeds:
 *     - type: post
 *       slug: some-slug
 */
function extractEmbeds(yaml: string): Array<{ type: string; slug: string }> {
  const result: Array<{ type: string; slug: string }> = [];
  const blockMatch = yaml.match(/^embeds:\s*\n([\s\S]*?)(?=^\S|\z)/m);
  if (!blockMatch) return result;
  const block = blockMatch[1];
  const items = block.split(/\n[ \t]*-[ \t]+/);
  for (const item of items) {
    const typeMatch = item.match(/type:\s*(\S+)/);
    const slugMatch = item.match(/slug:\s*(\S+)/);
    if (typeMatch && slugMatch) {
      result.push({ type: typeMatch[1].trim(), slug: slugMatch[1].trim() });
    }
  }
  return result;
}

/**
 * Carica tutti i file .md (non .en.md) da una collezione.
 * Ritorna array di { slug, yaml, isDraft }.
 */
function loadCollection(name: string): Array<{ slug: string; yaml: string; draft: boolean }> {
  const dir = join(contentRoot, name);
  if (!existsSync(dir)) return [];
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter(f => f.endsWith('.md') && !f.endsWith('.en.md') && !f.startsWith('.'))
    .map(f => {
      const yaml = extractYamlBlock(readFileSync(join(dir, f), 'utf-8'));
      return { slug: f.replace(/\.md$/, ''), yaml, draft: isDraft(yaml) };
    });
}

// ── Test 1: embeds interni puntano a slug esistenti e non-draft ─────────────

describe('embeds_integrity', () => {
  const postsLive = new Set(loadCollection('posts').filter(e => !e.draft).map(e => e.slug));
  const reelsLive = new Set(loadCollection('reels').filter(e => !e.draft).map(e => e.slug));

  for (const collection of ['work', 'bulletin'] as const) {
    const entries = loadCollection(collection);
    for (const entry of entries) {
      const embeds = extractEmbeds(entry.yaml);
      if (embeds.length === 0) continue;

      it(`${collection}/${entry.slug} — tutti gli embeds puntano a slug live`, () => {
        for (const embed of embeds) {
          const liveSet = embed.type === 'post' ? postsLive : reelsLive;
          expect(
            liveSet.has(embed.slug),
            `${collection}/${entry.slug}: embed ${embed.type}/${embed.slug} non trovato o è in draft`,
          ).toBe(true);
        }
      });
    }
  }

  it('(baseline) i set post/reel live non contengono entry in draft', () => {
    const postsDraft = loadCollection('posts').filter(e => e.draft);
    const reelsDraft = loadCollection('reels').filter(e => e.draft);
    for (const d of postsDraft) expect(postsLive.has(d.slug)).toBe(false);
    for (const d of reelsDraft) expect(reelsLive.has(d.slug)).toBe(false);
  });
});

// ── Test 2: photoIds/posterPhotoId esistono nel DB con status='published' ───

describe('photo_refs_integrity', () => {
  const supabaseUrl = process.env.BOSCO_SUPABASE_URL?.replace(/\\n$/, '');
  const supabaseKey = process.env.BOSCO_SUPABASE_SERVICE_KEY?.replace(/\\n$/, '');

  // Se le env var non sono disponibili (CI senza segreti), skippa silenziosamente
  const hasCredentials = !!(supabaseUrl && supabaseKey);

  it('photoIds di ogni post esistono in pianeta_media_photos (published)', async () => {
    if (!hasCredentials) {
      console.warn('BOSCO_SUPABASE credentials mancanti — test skippato');
      return;
    }
    const db = createClient(supabaseUrl!, supabaseKey!);
    const postEntries = loadCollection('posts').filter(e => !e.draft);
    for (const entry of postEntries) {
      const ids = extractPhotoIds(entry.yaml);
      if (ids.length === 0) continue;
      const { data, error } = await db
        .from('pianeta_media_photos')
        .select('id, status')
        .in('id', ids);
      expect(error, `query error for posts/${entry.slug}`).toBeNull();
      const found = new Set((data ?? []).map((r: any) => r.id));
      for (const id of ids) {
        expect(found.has(id), `posts/${entry.slug}: photoId ${id} non trovato`).toBe(true);
        const row = (data ?? []).find((r: any) => r.id === id);
        expect(row?.status, `posts/${entry.slug}: photoId ${id} non published`).toBe('published');
      }
    }
  });

  it('posterPhotoId di ogni reel esiste in pianeta_media_photos (published)', async () => {
    if (!hasCredentials) {
      console.warn('BOSCO_SUPABASE credentials mancanti — test skippato');
      return;
    }
    const db = createClient(supabaseUrl!, supabaseKey!);
    const reelEntries = loadCollection('reels').filter(e => !e.draft);
    for (const entry of reelEntries) {
      const pid = extractPosterPhotoId(entry.yaml);
      if (!pid) continue;
      const { data, error } = await db
        .from('pianeta_media_photos')
        .select('id, status')
        .eq('id', pid)
        .single();
      expect(error, `query error for reels/${entry.slug}`).toBeNull();
      expect(data?.status, `reels/${entry.slug}: posterPhotoId ${pid} non published`).toBe('published');
    }
  });
});
