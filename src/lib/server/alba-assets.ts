// Loader degli asset Alba sincronizzati dal repo PianetaDev/alba.
// Sync: `pnpm sync:alba` (vedi scripts/sync-alba.mjs)
import systemPromptRaw from '@/lib/alba-assets/system-prompt.md?raw';
import toolsJson from '@/lib/alba-assets/tools.json';
import kbJson from '@/lib/alba-assets/kb.json';
import syncedFrom from '@/lib/alba-assets/_synced-from.json';

export interface AlbaTool {
  name: string;
  description: string;
  input_schema: Record<string, any>;
}
export interface AlbaKBEntry {
  path: string;
  section: string;
  slug: string;
  weight: number;
  tags: string[];
  body: string;
}

export const albaSystemPrompt: string = systemPromptRaw as unknown as string;
export const albaTools: AlbaTool[] = (toolsJson as any).tools || [];
export const albaKB: AlbaKBEntry[] = (kbJson as any).entries || [];
export const albaSyncMeta = syncedFrom as { repo: string; branch: string; syncedAt: string };

/** Plain-text dump del KB per inserirlo in un system prompt. */
export function albaKBAsText(): string {
  return albaKB
    .map(e => `### ${e.section}/${e.slug}\n${e.body}\n`)
    .join('\n---\n\n');
}

/** Filtra il KB per sezioni. */
export function albaKBFilter(sections?: string[]): AlbaKBEntry[] {
  if (!sections || sections.length === 0) return albaKB;
  const set = new Set(sections);
  return albaKB.filter(e => set.has(e.section));
}
