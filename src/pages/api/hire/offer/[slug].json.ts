import type { APIRoute } from 'astro';
import { offerBySlug } from '@/data/offers';

export const prerender = false;

// Dati offerta per l'overlay (pattern moderno: API + overlay, niente navigazione a pagina).
export const GET: APIRoute = ({ params }) => {
  const offer = offerBySlug(params.slug ?? '');
  if (!offer) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify(offer), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' },
  });
};
