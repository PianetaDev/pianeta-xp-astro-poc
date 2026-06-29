import type { APIRoute } from 'astro';
import { offerBySlug } from '@/data/offers';

export const prerender = false;

// Dati offerta per l'overlay (pattern moderno: API + overlay, niente navigazione a pagina).
export const GET: APIRoute = ({ params, url }) => {
  const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'it';
  const offer = offerBySlug(params.slug ?? '', locale);
  if (!offer) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify(offer), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' },
  });
};
