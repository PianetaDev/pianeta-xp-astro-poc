import type { APIRoute } from 'astro';

export const prerender = false;

// GET /api/oauth/google/start — redirect a Google consent screen.
// Usato ONE-SHOT da Max per autorizzare Alba a leggere/scrivere il suo Google Calendar.
// Protetto da query secret: ?key=<NARRATOR_SECRET> per evitare random visitatori.

export const GET: APIRoute = async ({ url, redirect }) => {
  const expected = process.env.NARRATOR_SECRET;
  if (!expected || url.searchParams.get('key') !== expected) {
    return new Response('forbidden — usa ?key=<NARRATOR_SECRET>', { status: 403 });
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return new Response('GOOGLE_CLIENT_ID o GOOGLE_OAUTH_REDIRECT_URI mancanti', { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly openid email',
    access_type: 'offline',           // produce refresh_token
    prompt: 'consent',                // forza il consenso ogni volta → refresh_token sempre
    state: expected,                  // riusa il NARRATOR_SECRET come state (verifica nel callback)
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, 302);
};
