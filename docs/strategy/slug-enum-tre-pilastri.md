---
issue: PIA-1386
compiled: 2026-09-12
author: COMPASS
status: decisione-emessa
scope: Naming tecnico (slug enum) — 3 pilastri di /services
unblocks: Pianeta.Engineer (config.ts + frontmatter) · MUSE (copy intro IT+EN)
---

# Slug enum — 3 pilastri Creatività · Design · Tecnologia

## Decisione

I nuovi valori `category` in `config.ts` (enum Zod) sono:

| Pilastro | Slug |
|---|---|
| Creatività | `creativita` |
| Design | `design` |
| Tecnologia | `tecnologia` |

## Ragionamento

**1. Dove compare lo slug**

Il campo `category` appare in due posti nel codice:

- Come filtro interno: `all.filter((i) => i.data.category === key)` — invisibile all'utente.
- Come attributo `id` sull'`<article>` in `src/pages/services/index.astro` riga 63: `<article id={cat.key}>` — diventa ancora HTML (`/services#creativita`). Non è un segmento di URL path.

Il label mostrato in UI viene sempre da `SERVICE_CATEGORIES[].title` in `services-categories.ts` — completamente disaccoppiato dallo slug.

**2. Perché italiano (non inglese)**

Lo slug attuale è inglese (`strategic-design-consultancy`, `data-ai`, ecc.) come convenzione. Cambiarla a italiano è una scelta consapevole, non un'inconsistenza:

- I pilastri nascono da un reframe brand-first ("Creatività · Design · Tecnologia"), non da una refactoring tecnica. Lo slug deve riflettere questa rottura.
- Il sito è bilingue IT+EN, ma entrambe le collection (`services` e `servicesEn`) usano lo stesso campo `category`. Lo slug è un identificatore interno, non una stringa localizzata — va scelto una volta sola.
- "design" è invariante tra IT e EN: nessuna ambiguità.
- Slug italiani più corti e leggibili nei tool di debug rispetto agli equivalenti EN (`creativity`, `technology`).

**3. Accent stripping**

`creatività` → `creativita` (no accent) — standard per slug tecnici, evita encoding issues nel DOM id e in eventuali query string future.

## Cosa NON è deciso qui

- Label UI (`title`, `intro`) per ciascun pilastro — spetta a MUSE, separatamente (IT+EN).
- Mappatura esatta dei 16 servizi → pilastro: già stabilita nella spec `docs/superpowers/specs/2026-09-12-tre-pilastri-servizi-design.md` (PR #122).
- Posizionamento AI (`ai-validation-swarm`, `neuromarketing-lab`) — restano in `creativita` come placeholder, fuori scope.

## Cosa deve fare Pianeta.Engineer con questo

1. **`src/content/config.ts` riga 16** — sostituire enum:
   ```ts
   // DA:
   category: z.enum(['strategic-design-consultancy', 'visualization-storytelling', 'products-systems', 'data-ai']).optional(),
   // A:
   category: z.enum(['creativita', 'design', 'tecnologia']).optional(),
   ```
   (stesso change in `servicesEn` — stessa schema)

2. **`src/lib/services-categories.ts`** — sostituire le 4 voci con 3:
   ```ts
   key: 'creativita' | 'design' | 'tecnologia'
   ```
   Titoli e intro: da brief MUSE (non ancora disponibile — Engineer aspetta entrambe le deliverable).

3. **Frontmatter di tutti i 16 file `src/content/services/*.md` e `*.en.md`** — aggiornare il campo `category` con la mappatura definita nella spec:
   - `creativita`: brand-audit, brand-positioning, brand-vision-strategy, pianeta-centric-design-strategy, ai-validation-swarm, neuromarketing-lab
   - `design`: brand-identity-rebranding, editorial-educational-design, illustrazione-infografica, microsites-data-stories, design-system-multi-brand
   - `tecnologia`: app-prodotti-digitali, web-sostenibile, greenmeter-audit-co2 (+ piattaforme-dashboard e esg-framework-atlas quando torneranno da `draft: true`)

4. **`src/pages/services/index.astro` + `en/services/index.astro`** — aggiornare titolo page (`title`, `description` meta, deck) per riflettere i 3 pilastri. Testo da brief MUSE.

## Dipendenze per Engineer

| Deliverable | Owner | Status |
|---|---|---|
| Slug enum (questo doc) | COMPASS | ✅ pronto |
| Copy IT+EN per ciascun pilastro | MUSE | ⏳ da emettere |

Engineer può iniziare i punti 1, 2 (struttura schema senza titoli definitivi) e 3 (frontmatter) non appena ha questo documento. Il punto 4 (copy UI) richiede il brief MUSE.
