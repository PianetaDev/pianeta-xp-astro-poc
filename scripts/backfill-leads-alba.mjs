#!/usr/bin/env node
// One-off: backfill tabella `leads` con gli utenti Alba che hanno già lasciato la propria email.
// Fonte: alba_users (tabella live della chat pubblica) — sola lettura, nessuna modifica ad alba_*.
//
// Run: node scripts/backfill-leads-alba.mjs [--dry-run]
// Richiede SUPABASE_URL + SUPABASE_SERVICE_KEY in .env.local (pnpm vercel env pull .env.local --environment=production).
//
// Status: 'draft' di default per tutti. Se l'utente ha un evento `call_booked` andato a
// buon fine su Google Calendar (alba_events.event='call_booked' && payload.gcal_ok=true),
// lo status diventa 'call' — è l'unico segnale non ambiguo disponibile in alba_events per
// capire se un contatto Alba è "andato oltre" la semplice email. Per Alba non esiste un
// concetto di 'sent'/'replied' (il contatto è sempre inbound, non c'è outreach da parte
// nostra), quindi questi status non vengono mai assegnati da questo backfill.

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback su .env se presente

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_KEY mancanti in .env.local — pull con `vercel env pull .env.local --environment=production`.'
    );
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const { data: users, error: usersErr } = await sb
    .from('alba_users')
    .select('uid, email, first_name')
    .not('email', 'is', null);
  if (usersErr) throw usersErr;

  console.log(`Trovati ${users.length} alba_users con email.`);

  // Segnale "call" — evento call_booked con gcal_ok true (creazione riuscita su Google Calendar).
  const { data: callEvents, error: eventsErr } = await sb
    .from('alba_events')
    .select('uid, payload')
    .eq('event', 'call_booked');
  if (eventsErr) throw eventsErr;

  const uidsWithCall = new Set(
    (callEvents ?? [])
      .filter((e) => e.payload && e.payload.gcal_ok === true)
      .map((e) => e.uid)
  );

  // Dedup per email (stesso indirizzo può comparire su più uid, raro ma possibile):
  // se una qualsiasi occorrenza ha status 'call', vince quella.
  const byEmail = new Map();
  for (const u of users) {
    const email = (u.email ?? '').trim();
    if (!email) continue;
    const status = uidsWithCall.has(u.uid) ? 'call' : 'draft';
    const prev = byEmail.get(email);
    if (!prev || (status === 'call' && prev.status !== 'call')) {
      byEmail.set(email, {
        source: 'alba',
        company: null,
        contact_name: u.first_name ?? null,
        email,
        status,
      });
    }
  }
  const rows = [...byEmail.values()];

  if (DRY_RUN) {
    console.log(JSON.stringify(rows, null, 2));
    console.log(`Dry run — ${rows.length} righe pronte, nessun insert eseguito.`);
    return;
  }

  // Idempotenza: evita doppioni se lo script viene rilanciato — match su (source='alba', email).
  const { data: existing, error: existErr } = await sb.from('leads').select('email').eq('source', 'alba');
  if (existErr) throw existErr;
  const existingEmails = new Set((existing ?? []).map((r) => r.email));

  const toInsert = rows.filter((r) => !existingEmails.has(r.email));
  if (toInsert.length === 0) {
    console.log('Tutte le righe risultano già presenti — nessun insert necessario.');
    return;
  }

  const { data, error } = await sb.from('leads').insert(toInsert).select('id, email');
  if (error) throw error;
  console.log(`✓ Inserite ${data.length} righe in leads (source=alba).`);
  if (rows.length - toInsert.length > 0) {
    console.log(`  (${rows.length - toInsert.length} già presenti, saltate)`);
  }
}

main().catch((err) => {
  console.error('✗ Backfill fallito:', err.message);
  process.exitCode = 1;
});
