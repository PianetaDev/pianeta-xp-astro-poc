const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadInput = {
  email: string;
  description: string;
  name?: string;
  company?: string;
  budget_range?: string;
  timeline?: string;
  transcript?: any;
  albaSessionId?: string;
};

export function validateLeadInput(input: any): { ok: true } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'invalid body' };
  if (typeof input.email !== 'string' || !EMAIL_RE.test(input.email.trim())) return { ok: false, error: 'invalid email' };
  if (typeof input.description !== 'string' || input.description.trim().length < 5) return { ok: false, error: 'description too short' };
  return { ok: true };
}
