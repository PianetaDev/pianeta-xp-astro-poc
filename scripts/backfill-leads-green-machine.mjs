#!/usr/bin/env node
// One-off: backfill tabella `leads` con i 32 prospect reali già raccolti da GreenMachine.
// Fonte: CRM_GreenMachine.md (Google Drive, Pianeta CFO/26X07_Portfolio_Servizi/GreenMachine).
//
// Run: node scripts/backfill-leads-green-machine.mjs [--dry-run]
// Richiede SUPABASE_URL + SUPABASE_SERVICE_KEY in .env.local (pnpm vercel env pull .env.local --environment=production).

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback su .env se presente

const CRM_PATH =
  '/Users/massimilianomauro/Library/CloudStorage/GoogleDrive-info@mmxx.studio/Il mio Drive/MX Pianeta office/Pianeta CFO/26X07_Portfolio_Servizi/GreenMachine/CRM_GreenMachine.md';

const DRY_RUN = process.argv.includes('--dry-run');

const STATUS_MAP = {
  '📝 Bozza': 'draft',
  '✉️ Inviato': 'sent',
  '💬 Risposto': 'replied',
  '📞 Call': 'call',
  '🤝 Chiuso': 'won',
  '❌ Scartato': 'discarded',
};

function splitContact(raw) {
  const m = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) return { name: m[1].trim(), role: m[2].trim() };
  return { name: raw.trim(), role: null };
}

function clean(v) {
  const t = (v ?? '').trim();
  return t === '' || t === '—' ? null : t;
}

function parseStatus(raw) {
  // Prende l'emoji+parola nota all'inizio della cella, ignora suffissi tipo "⭐ TOP PRIORITY" o "⚠️".
  const key = Object.keys(STATUS_MAP).find((k) => raw.startsWith(k) || raw.trim() === k);
  return key ? STATUS_MAP[key] : 'draft';
}

function parseCrm(markdown) {
  const lines = markdown.split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('| ')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 11) continue;
    const [num, data, azienda, contatto, email, url, settore, greenMeter, co2, status, note] = cells;
    if (num === '#' || /^-+$/.test(num)) continue; // header / separator
    if (!/^\d+$/.test(num)) continue;

    const { name, role } = splitContact(contatto);
    rows.push({
      source: 'green_machine',
      company: clean(azienda),
      contact_name: clean(name),
      contact_role: clean(role),
      email: clean(email),
      url: clean(url),
      sector: clean(settore),
      rating: clean(greenMeter),
      co2_per_visit: clean(co2),
      status: parseStatus(status),
      notes: clean(note),
      week_label: clean(data),
    });
  }
  return rows;
}

async function main() {
  const markdown = readFileSync(CRM_PATH, 'utf8');
  const rows = parseCrm(markdown);
  console.log(`Parsed ${rows.length} righe dal CRM.`);

  if (rows.length !== 32) {
    console.warn(`⚠ Attese 32 righe, trovate ${rows.length}. Verifica il parsing prima di procedere.`);
  }

  if (DRY_RUN) {
    console.log(JSON.stringify(rows, null, 2));
    console.log('Dry run — nessun insert eseguito.');
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY mancanti in .env.local — pull con `vercel env pull .env.local --environment=production`.');
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });

  // Idempotenza: evita doppioni se lo script viene rilanciato — match su (source, company, email).
  const { data: existing, error: existErr } = await sb
    .from('leads')
    .select('company, email')
    .eq('source', 'green_machine');
  if (existErr) throw existErr;
  const existingKeys = new Set((existing ?? []).map((r) => `${r.company}::${r.email}`));

  const toInsert = rows.filter((r) => !existingKeys.has(`${r.company}::${r.email}`));
  if (toInsert.length === 0) {
    console.log('Tutte le righe risultano già presenti — nessun insert necessario.');
    return;
  }

  const { data, error } = await sb.from('leads').insert(toInsert).select('id, company');
  if (error) throw error;
  console.log(`✓ Inserite ${data.length} righe in leads (source=green_machine).`);
  if (rows.length - toInsert.length > 0) {
    console.log(`  (${rows.length - toInsert.length} già presenti, saltate)`);
  }
}

main().catch((err) => {
  console.error('✗ Backfill fallito:', err.message);
  process.exitCode = 1;
});
