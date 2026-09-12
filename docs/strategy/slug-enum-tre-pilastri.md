---
issue: PIA-1387
compiled: 2026-09-12
author: COMPASS
status: decisione-emessa
scope: Naming tecnico (slug enum) — 3 pilastri di /services
unblocks: Pianeta.Engineer (config.ts + frontmatter) · MUSE (copy intro IT+EN)
canonical-source: piano in PIA-1387 (Paperclip)
---

# Slug enum — 3 pilastri Creatività · Design · Tecnologia

> **Nota:** questo file è il riferimento permanente nel repo per la decisione di naming. La fonte primaria e authoritative è il documento `plan` su [PIA-1387](/PIA/issues/PIA-1387#document-plan).

## Decisione

| Pilastro IT (label visibile) | Slug enum (`content.config.ts`) | Label EN (`/en/services`) |
|---|---|---|
| **Creatività** | `creativity` | Creativity |
| **Design** | `design` | Design |
| **Tecnologia** | `technology` | Technology |

## Ragionamento

### `creativity` — Creatività

Gli slug attuali del codebase sono tutti inglesi kebab-case (`strategic-design-consultancy`, `visualization-storytelling`, `products-systems`, `data-ai`). Usare `creativita` (senza accento — gli accenti non appartengono agli slug) introdurrebbe un identifier ibrido IT in un sistema EN. `creativity` è consistente con la convenzione esistente, non ha ambiguità di encoding, e mappa direttamente alla EN label senza strato di traduzione aggiuntivo.

### `design` — Design

Invariante IT/EN: la stessa stringa funziona sia come identifier tecnico sia come label visibile in entrambe le lingue. Nessuna alternativa da valutare.

### `technology` — Tecnologia

Stesso ragionamento di `creativity`: `tecnologia` è un ibrido rispetto al pattern EN del codebase. `technology` è il termine tecnico consolidato, privo di ambiguità, e si presta a essere usato direttamente come label EN senza ulteriore mapping.

## Dove appare lo slug nel codice

- **`src/content/config.ts` riga 16** — Zod enum (schema validation):
  ```ts
  // DA:
  category: z.enum(['strategic-design-consultancy', 'visualization-storytelling', 'products-systems', 'data-ai']).optional(),
  // A:
  category: z.enum(['creativity', 'design', 'technology']).optional(),
  ```
  (stesso change per `servicesEn`)

- **`src/lib/services-categories.ts`** — `ServiceCategory.key` type union e array `SERVICE_CATEGORIES`:
  ```ts
  key: 'creativity' | 'design' | 'technology'
  ```

- **`src/pages/services/index.astro` riga 63** — attributo `id` su `<article>` → diventa HTML anchor `/services#creativity`. Non è un segmento di URL path.

- **Frontmatter di tutti i 16 file `src/content/services/*.md` e `*.en.md`** — campo `category`.

## Mappatura servizi → slug

Già fissata nella spec `docs/superpowers/specs/2026-09-12-tre-pilastri-servizi-design.md` ([PR #122](https://github.com/PianetaDev/pianeta-xp-astro-poc/pull/122)):

| Slug | Servizi |
|---|---|
| `creativity` | brand-audit, brand-positioning, brand-vision-strategy, pianeta-centric-design-strategy, ai-validation-swarm, neuromarketing-lab |
| `design` | brand-identity-rebranding, editorial-educational-design, illustrazione-infografica, microsites-data-stories, design-system-multi-brand |
| `technology` | app-prodotti-digitali, web-sostenibile, greenmeter-audit-co2 (+ piattaforme-dashboard, esg-framework-atlas in `draft: true`) |

## Cosa NON è deciso qui

- Label UI (`title`, `intro`) per ciascun pilastro su `/services` — spetta a MUSE (PIA-1388, completato).
- Posizionamento AI (`ai-validation-swarm`, `neuromarketing-lab`) — restano in `creativity` come placeholder, workstream dedicato separato.
