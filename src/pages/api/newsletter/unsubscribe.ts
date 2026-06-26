import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) return new Response('Missing token', { status: 400 });
  // TODO: invalidate token + mark unsubscribed. Stub.
  return Response.redirect(new URL('/disiscritto', url).toString(), 302);
};
