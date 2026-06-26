import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '_assets');

export interface KbEntry {
  path: string;
  section: string;
  slug: string;
  weight: number;
  tags: string[];
  body: string;
}

export interface KbCompiled {
  generatedAt: string;
  entries: KbEntry[];
}

export interface AlbaToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface AlbaToolRegistry {
  version: string;
  tools: AlbaToolDef[];
}

let kbCache: KbCompiled | null = null;
let promptCache: string | null = null;
let toolsCache: AlbaToolRegistry | null = null;

export async function getKb(): Promise<KbCompiled> {
  if (kbCache) return kbCache;
  const raw = await readFile(join(ASSETS_DIR, 'kb.json'), 'utf8');
  kbCache = JSON.parse(raw) as KbCompiled;
  return kbCache;
}

export async function getSystemPrompt(): Promise<string> {
  if (promptCache !== null) return promptCache;
  promptCache = await readFile(join(ASSETS_DIR, 'system-prompt.md'), 'utf8');
  return promptCache;
}

export async function getTools(): Promise<AlbaToolRegistry> {
  if (toolsCache) return toolsCache;
  const raw = await readFile(join(ASSETS_DIR, 'tools.json'), 'utf8');
  toolsCache = JSON.parse(raw) as AlbaToolRegistry;
  return toolsCache;
}
