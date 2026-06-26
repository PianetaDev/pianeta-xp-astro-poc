import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response('Missing token', { status: 400 });
  }
  // TODO: validate token + flip Supabase status. Stub during migration.
  return Response.redirect(new URL('/confermato', url).toString(), 302);
};
