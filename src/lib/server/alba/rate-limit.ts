import { albaSupabase } from './supabase';

export const LIMITS = {
  perSession: 20,
  perUidPerDay: 50,
  perIpPerDay: 50,
  globalPerDay: 200,
  costEurPerDay: 5,
};

const today = () => new Date().toISOString().slice(0, 10);

export interface RateLimitVerdict {
  ok: boolean;
  reason?: string;
}

async function incrementAndGet(scope: string, date: string): Promise<number> {
  const sb = albaSupabase();
  // Try RPC first (atomic). Fallback to SELECT + UPSERT if function missing.
  if (typeof (sb as any).rpc === 'function') {
    try {
      const { data, error } = await (sb as any).rpc('alba_rate_limit_inc', { p_scope: scope, p_date: date });
      if (!error && data != null) return Number(data);
    } catch { /* fall through */ }
  }
  try {
    const sel = sb.from('alba_rate_limits').select('count').eq('scope', scope).eq('date', date).maybeSingle();
    const { data: existing } = await sel;
    const next = ((existing as any)?.count ?? 0) + 1;
    await (sb.from('alba_rate_limits') as any).upsert({ scope, date, count: next }, { onConflict: 'scope,date' });
    return next;
  } catch {
    return 0; // fail-open: non bloccare il chat per problemi rate-limit infrastrutturali
  }
}

export async function checkAndIncrementRateLimit(args: {
  uid: string;
  ip: string;
  sessionMsgCount: number;
}): Promise<RateLimitVerdict> {
  if (args.sessionMsgCount >= LIMITS.perSession) {
    return { ok: false, reason: `Limite di ${LIMITS.perSession} messaggi per sessione raggiunto.` };
  }
  const date = today();
  const uidCount = await incrementAndGet(`uid:${args.uid}`, date);
  if (uidCount > LIMITS.perUidPerDay) {
    return { ok: false, reason: 'Hai raggiunto il limite giornaliero. Riprova domani o scrivici a info@pianeta.studio.' };
  }
  const ipCount = await incrementAndGet(`ip:${args.ip}`, date);
  if (ipCount > LIMITS.perIpPerDay) {
    return { ok: false, reason: 'Troppi messaggi da questa rete. Riprova più tardi.' };
  }
  const globalCount = await incrementAndGet('global', date);
  if (globalCount > LIMITS.globalPerDay) {
    return { ok: false, reason: 'Alba è in pausa per oggi (alto traffico). Scrivici a info@pianeta.studio.' };
  }
  return { ok: true };
}

export async function checkDailyCostCap(): Promise<RateLimitVerdict> {
  const sb = albaSupabase();
  const { data } = await sb.from('alba_daily_costs').select('total_eur').eq('date', today()).maybeSingle();
  const cur = Number(data?.total_eur ?? 0);
  if (cur >= LIMITS.costEurPerDay) {
    return { ok: false, reason: 'Alba è in pausa per oggi (limite di costo raggiunto). Riprova domani.' };
  }
  return { ok: true };
}

export async function addToDailyCost(eur: number): Promise<void> {
  const sb = albaSupabase();
  const date = today();
  const { data: existing } = await sb.from('alba_daily_costs').select('total_eur').eq('date', date).maybeSingle();
  const next = Number(((existing?.total_eur ?? 0) + eur).toFixed(4));
  await sb.from('alba_daily_costs').upsert({ date, total_eur: next, updated_at: new Date().toISOString() }, { onConflict: 'date' });
}
