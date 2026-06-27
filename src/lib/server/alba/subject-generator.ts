import Anthropic from '@anthropic-ai/sdk';

export interface SubjectGenInput {
  type: 'bulletin' | 'work' | 'services';
  slug: string;
  title: string;
  description?: string;
  body?: string;
  tags?: string[];
}

export interface SubjectGenResult {
  ok: boolean;
  subjects?: string[];
  preview?: string;
  error?: string;
}

const SYSTEM = `Sei la voce editoriale di Pianeta.Studio per la newsletter Bulletin.
Genera 3 subject line alternative per email newsletter.
Regole: italiano, 6-9 parole, max 60 caratteri. Niente clickbait, emoji o "Scopri…/Tutto quello che…".
Tono diretto, leggermente provocatorio. Uno con numero, uno domanda, uno affermativo. Niente "Pianeta.Studio" nel subject.
Output JSON SOLO: {"subjects":["...","...","..."],"preview":"sentence max 90 char"}`;

export async function generateSubjects(input: SubjectGenInput): Promise<SubjectGenResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, error: 'ANTHROPIC_API_KEY missing' };
  const userMsg = [
    `Tipo: ${input.type}`,
    `Slug: ${input.slug}`,
    `Titolo: ${input.title}`,
    input.description ? `Descrizione: ${input.description}` : '',
    input.tags?.length ? `Tag: ${input.tags.join(', ')}` : '',
    input.body ? `\nEstratto:\n${input.body.slice(0, 1500)}` : '',
  ].filter(Boolean).join('\n');
  const anthropic = new Anthropic({ apiKey });
  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });
    const text = res.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return { ok: false, error: 'no JSON: ' + text.slice(0, 200) };
    const parsed = JSON.parse(m[0]);
    if (!Array.isArray(parsed.subjects)) return { ok: false, error: 'subjects missing' };
    return { ok: true, subjects: parsed.subjects.slice(0, 3), preview: parsed.preview };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'unknown' };
  }
}
