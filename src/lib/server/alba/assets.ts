// Asset Alba bundled at build time via Vite import — garantito incluso nel
// bundle Vercel serverless. Aggiornamento: `pnpm sync:alba` + commit + push.
import kbJson from './_assets/kb.json';
import toolsJson from './_assets/tools.json';
import systemPromptRaw from './_assets/system-prompt.md?raw';

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

export async function getKb(): Promise<KbCompiled> {
  return kbJson as unknown as KbCompiled;
}

export async function getSystemPrompt(): Promise<string> {
  return systemPromptRaw as string;
}

export async function getTools(): Promise<AlbaToolRegistry> {
  return toolsJson as unknown as AlbaToolRegistry;
}
