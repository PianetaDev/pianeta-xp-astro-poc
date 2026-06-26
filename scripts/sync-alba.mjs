#!/usr/bin/env node
// Sync assets dalla repo PianetaDev/alba → src/lib/alba-assets/
// Usa `gh api` per i repo privati (auth via gh CLI).
// Run: `pnpm sync:alba` o automaticamente pre-build via `pnpm prebuild`.

import { execFileSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const REPO = 'PianetaDev/alba';
const BRANCH = 'main';
const OUT_DIR = 'src/lib/alba-assets';

const FILES = [
  { src: 'prompts/system/current.md',  dst: 'system-prompt.md' },
  { src: 'tools/registry.json',        dst: 'tools.json' },
  { src: 'kb/_compiled/kb.json',       dst: 'kb.json' },
];

function fetchFile(path) {
  const out = execFileSync(
    'gh',
    ['api', `repos/${REPO}/contents/${path}?ref=${BRANCH}`, '-H', 'Accept: application/vnd.github.raw'],
    { encoding: 'utf8' }
  );
  return out;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const { src, dst } of FILES) {
  try {
    const body = fetchFile(src);
    const outPath = join(OUT_DIR, dst);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, body);
    console.log(`✓ ${src} → ${outPath}  (${body.length} bytes)`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message.split('\n')[0]}`);
    process.exitCode = 1;
  }
}

const meta = { repo: REPO, branch: BRANCH, syncedAt: new Date().toISOString().slice(0, 10) };
writeFileSync(join(OUT_DIR, '_synced-from.json'), JSON.stringify(meta, null, 2));
console.log(`\nSynced from ${REPO}@${BRANCH}`);
