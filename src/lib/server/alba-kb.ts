import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

type KbEntry = {
  path: string;
  type: string;
  title: string;
  description: string;
  body: string;
  meta: Record<string, any>;
};

type Kb = { generatedAt: string; entries: KbEntry[] };

let cached: Kb | null = null;

export async function loadKB(): Promise<Kb> {
  if (cached) return cached;
  const candidates = [
    join(process.cwd(), '.kb-alba.json'),
    join(process.cwd(), 'app/.kb-alba.json'),
    join(process.cwd(), 'public/.kb-alba.json'),
  ];
  for (const path of candidates) {
    try {
      const raw = await readFile(path, 'utf-8');
      cached = JSON.parse(raw);
      return cached!;
    } catch { /* try next */ }
  }
  return { generatedAt: new Date().toISOString(), entries: [] };
}

export function kbAsText(kb: Kb): string {
  if (!kb.entries.length) return '(KB vuota — content/ ancora da popolare)';
  return kb.entries.map(e => {
    const metaLine = Object.entries(e.meta).filter(([_, v]) => v).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ');
    return `— ${e.title} (${e.path}, type: ${e.type})\n${e.description}\nMeta: ${metaLine}\n${e.body.slice(0, 800)}`;
  }).join('\n\n');
}
