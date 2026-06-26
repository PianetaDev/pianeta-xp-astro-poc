import type { APIRoute } from 'astro';
import { albaSupabase } from '../../../../lib/server/alba/supabase';

export const prerender = false;

// GET /api/oauth/google/callback?code=...&state=...
// Google redirige qui dopo il consent. Scambia code per refresh_token + access_token,
// salva su alba_integrations(provider=google_calendar, owner_email).

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) return new Response(`OAuth error: ${error}`, { status: 400 });
  if (!code) return new Response('missing code', { status: 400 });

  const expected = process.env.NARRATOR_SECRET;
  if (!expected || state !== expected) {
    return new Response('state mismatch — possible CSRF', { status: 403 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return new Response('Google OAuth env mancanti (GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI)', { status: 500 });
  }

  // Exchange code → tokens
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const tokRes = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body });
  if (!tokRes.ok) {
    return new Response(`token exchange failed: ${tokRes.status} ${await tokRes.text()}`, { status: 500 });
  }
  const tok = (await tokRes.json()) as { access_token: string; refresh_token?: string; expires_in: number; id_token?: string };
  if (!tok.refresh_token) {
    return new Response('No refresh_token returned. Probabilmente hai già autorizzato prima — vai su https://myaccount.google.com/permissions, revoca "Alba Pianeta", poi ritenta /api/oauth/google/start.', { status: 500 });
  }

  // Estrai email owner da id_token (decodifica JWT senza verifica firma — qui ci fidiamo perché è Google che ha appena risposto)
  let ownerEmail = process.env.ALBA_CALENDAR_OWNER_EMAIL || 'info@pianeta.studio';
  if (tok.id_token) {
    try {
      const payload = JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64').toString('utf8'));
      if (payload.email) ownerEmail = payload.email;
    } catch { /* keep default */ }
  }

  const sb = albaSupabase();
  const expAt = new Date(Date.now() + (tok.expires_in - 60) * 1000).toISOString();
  await sb.from('alba_integrations').upsert({
    provider: 'google_calendar',
    owner_email: ownerEmail,
    refresh_token: tok.refresh_token,
    access_token: tok.access_token,
    access_token_exp: expAt,
    scopes: ['calendar.events'],
    meta: { calendar_id: 'primary' },
    updated_at: new Date().toISOString(),
  }, { onConflict: 'provider,owner_email' });

  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Alba Google Calendar — autorizzato</title>
<style>body{font-family:system-ui;max-width:560px;margin:64px auto;padding:24px;line-height:1.5}h1{margin:0 0 16px}code{background:#f4f4f4;padding:2px 6px;border-radius:4px}</style>
<h1>✅ Alba ora può creare eventi sul tuo Google Calendar</h1>
<p><b>Owner</b>: <code>${ownerEmail}</code></p>
<p>Setup completo. Alba userà questo refresh_token quando l'utente concorda uno slot.</p>
<p><a href="/">→ Torna al sito</a></p>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
};
