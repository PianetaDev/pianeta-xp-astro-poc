#!/usr/bin/env node
// Copia KB compilata + system prompt + tool registry dal repo Alba al sito.
// Default path: ../../alba (override via env ALBA_REPO_PATH).
import { readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, '..');
const ALBA_ROOT = resolve(process.env.ALBA_REPO_PATH || join(SITE_ROOT, '..', 'alba'));
const OUT_DIR = join(SITE_ROOT, 'src', 'lib', 'server', 'alba', '_assets');

const ASSETS = [
  { from: 'kb/_compiled/kb.json', to: 'kb.json' },
  { from: 'prompts/system/current.md', to: 'system-prompt.md' },
  { from: 'tools/registry.json', to: 'tools.json' },
];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

await mkdir(OUT_DIR, { recursive: true });

for (const { from, to } of ASSETS) {
  const src = join(ALBA_ROOT, from);
  if (!(await exists(src))) {
    console.warn(`[sync-alba-assets] skip (alba repo non clonato come sibling): ${from}`);
    continue;
  }
  const content = await readFile(src);
  await writeFile(join(OUT_DIR, to), content);
  console.log(`  ${from} → ${to} (${content.length} bytes)`);
}

console.log(`Synced ${ASSETS.length} alba assets from ${ALBA_ROOT}`);
