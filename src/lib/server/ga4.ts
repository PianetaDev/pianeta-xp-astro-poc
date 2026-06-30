// GA4 Measurement Protocol — eventi lato server verso GA4 (G-T6BP1GCG7P).
// Affidabile: non dipende dal browser. Degrada in silenzio se manca config/client_id.
import { env } from './env';

interface Ga4Event { name: string; params?: Record<string, any> }

/** Estrae il client_id GA4 dal cookie `_ga` (formato GA1.1.<id>.<ts> → "<id>.<ts>"). */
export function ga4ClientIdFromCookie(gaCookie: string | undefined | null): string {
  if (!gaCookie) return '';
  const parts = String(gaCookie).split('.');
  return parts.length >= 4 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : '';
}

/** Manda uno o più eventi a GA4 via Measurement Protocol. clientId obbligatorio per l'attribuzione. */
export async function ga4Send(clientId: string, events: Ga4Event[]): Promise<void> {
  const mid = env('GA4_MEASUREMENT_ID');
  const secret = env('GA4_API_SECRET');
  if (!mid || !secret || !clientId || !events.length) return;
  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${mid}&api_secret=${secret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, events }),
    });
  } catch (e) {
    console.error('[ga4] send error:', e);
  }
}
