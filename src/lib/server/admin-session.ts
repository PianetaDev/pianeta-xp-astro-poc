// Cookie-based auth per l'area /admin/* interna (pattern "Segnale": secret condiviso,
// niente multi-utente). Complementare a admin-auth.ts (che gestisce header/query per
// alcune API già esistenti) — questo file copre il flusso pagina con cookie httpOnly.
import type { AstroCookies } from 'astro';

export const ADMIN_COOKIE_NAME = 'pianeta_admin_session';

function adminSecret(): string {
  return process.env.ADMIN_SECRET || '';
}

/** True se non c'è nessun ADMIN_SECRET configurato e siamo fuori produzione (dev locale aperto). */
export function adminGateDisabled(): boolean {
  return !adminSecret() && process.env.NODE_ENV !== 'production';
}

/** Verifica la password inserita nel form di login contro ADMIN_SECRET. */
export function checkAdminPassword(password: string): boolean {
  const secret = adminSecret();
  return !!secret && password === secret;
}

/** Legge i cookie e dice se la sessione admin è valida. */
export function isAdminAuthed(cookies: AstroCookies): boolean {
  if (adminGateDisabled()) return true;
  const secret = adminSecret();
  if (!secret) return false;
  const cookie = cookies.get(ADMIN_COOKIE_NAME)?.value || '';
  return cookie === secret;
}

/** Imposta il cookie di sessione dopo un login riuscito. */
export function setAdminCookie(cookies: AstroCookies) {
  cookies.set(ADMIN_COOKIE_NAME, adminSecret(), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 giorni
  });
}

export function clearAdminCookie(cookies: AstroCookies) {
  cookies.delete(ADMIN_COOKIE_NAME, { path: '/' });
}

/** Verifica per le API (stesso cookie) — usare quando la chiamata arriva via fetch same-origin dal browser. */
export function requireAdminCookie(cookies: AstroCookies): { ok: true } | { ok: false; response: Response } {
  if (isAdminAuthed(cookies)) return { ok: true };
  return {
    ok: false,
    response: new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    }),
  };
}
