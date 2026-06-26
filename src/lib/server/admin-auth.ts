// Auth helper per /admin/* e /api/admin/*.
// Shared secret via env ADMIN_SECRET — Max + le sue colleghe usano lo stesso.
// Quando vorremo distinguere per persona, switchare a Supabase Auth.
export function requireAdmin(request: Request): { ok: true } | { ok: false; response: Response } {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret) {
    // Dev mode: nessun ADMIN_SECRET → niente gate (apri tutto)
    if (process.env.NODE_ENV !== 'production') return { ok: true };
    return { ok: false, response: new Response(JSON.stringify({ error: 'admin not configured' }), { status: 500 }) };
  }
  const provided = request.headers.get('x-admin-secret') || new URL(request.url).searchParams.get('secret') || '';
  if (provided !== secret) {
    return { ok: false, response: new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }) };
  }
  return { ok: true };
}
