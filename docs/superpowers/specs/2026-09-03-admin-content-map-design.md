# Admin Content Map — Design

**Goal:** una pagina interna, `/admin/content`, che mostra lo stato pubblicato/draft di tutti i contenuti editoriali (IT + EN affiancati), con link diretto per modificarli su GitHub.

## Contesto

`/admin` ha già `campaigns` e `leads`, entrambi protetti da cookie di sessione (`isAdminAuthed`, redirect a `/admin/login`). Manca una vista cross-collection dei contenuti editoriali: oggi per sapere cosa è draft bisogna grepparlo a mano.

## Scope

Collection incluse: `lab`, `work`, `bulletin`, `services`, `team`, `careers` (+ le rispettive `*En`). Escluse: `campaigns`, `team` (letto ma non serve status IT/EN — ha comunque `draft`, resta dentro), `alba/*` (progetto separato, non tocca `src/content`).

Fuori scope: nessuna scrittura/toggle da questa pagina (read-only), nessun riepilogo campagne/lead (restano nelle loro pagine).

## Dati

Per ogni collection, `getCollection('<name>')` e `getCollection('<name>En')`. Le collection EN usano `generateId` che rimuove il suffisso `.en.md`, quindi l'`id` IT e l'`id` EN dello stesso contenuto combaciano già (es. entrambi `future-seeds`) — non serve normalizzazione.

Merge: per ogni `id` unico nell'unione dei due set, una riga con:
- `title`: titolo IT se presente, altrimenti titolo EN
- `statusIt`: `'live' | 'draft' | 'missing'` (live = entry IT presente e `draft !== true`; draft = presente e `draft === true`; missing = nessuna entry IT)
- `statusEn`: stessa logica sull'entry EN
- `date`: la più recente tra le due entry, se presente

## UI

Riusa `BaseLayout` e le classi `.index-page/.index-head/.index-eyebrow/.index-title/.index-deck` già usate da `/admin/campaigns`. Guard di auth identico a `/admin/leads` (redirect a login se non autenticato).

In cima, una riga di riepilogo testuale: `"N pubblicati · N draft · N senza EN"` calcolata sul totale di tutte le collection (live = entrambe le lingue live o almeno IT live; draft = almeno una draft; senza EN = statusEn === 'missing').

Sotto, una sezione per collection (titolo `<h2>` + tabella), stesso stile tabella di `/admin/campaigns/index.astro` (`.campaigns-table` → nuova classe `.content-table`, stesso CSS). Colonne: Titolo, Stato IT, Stato EN, Data, Modifica IT (link), Modifica EN (link).

Badge stato (stessa convenzione emoji di `statusLabel` in campaigns): 🟢 Live, 📝 Draft, ⚪ — (missing). Link "Modifica" punta a `https://github.com/PianetaDev/pianeta-xp-astro-poc/blob/main/src/content/<collection>/<id>.md` (IT) o `<id>.en.md` (EN); se la lingua manca, nessun link (testo `—`).

Collection senza risultati non mostrano la sezione (skip, non tabella vuota).

## File toccati

- Nuovo: `src/pages/admin/content/index.astro`

Nessun altro file cambia — niente nuove API, niente modifiche allo schema di `src/content/config.ts`.

## Verifica

- `npm run build` pulito.
- Verifica visiva locale: login admin, poi `/admin/content` mostra tutte le 6 collection con conteggi coerenti con quelli osservati oggi (lab 2 draft su 5, work 1 draft su 8, careers 1 draft su 2, bulletin/services/team 0 draft).
- Link "Modifica" aprono il file giusto su GitHub (verifica almeno un caso per collection).
- Redirect a `/admin/login` se non autenticato.
