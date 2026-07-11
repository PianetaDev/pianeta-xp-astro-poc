# Formati immagine — convenzione

Regola: **due soli derivati per ogni sorgente**. Niente crop custom, niente varianti extra.

## Sorgente
- `public/og/<slug>.jpg` o `<slug>.png` — file originale ad alta risoluzione
- Vengono ridimensionate in-place a max 1280px lato lungo dalla pipeline

## Derivati (generati da `scripts/optimize-images.mjs`)
| File | Uso | Dim max | Quality |
|------|-----|---------|---------|
| `<slug>.webp` | Hero detail page (`.detail-hero`) | 1280px | 72 |
| `<slug>-card.webp` | Card indice (`IndexCard`), "Continua a leggere" (`.detail-next-img`), bento tile | 720px | 60 |

## Cosa NON generare
- Nessun `-hero-card.webp`, `-thumb.webp`, `-og.webp`, `-mobile.webp`, ecc.
- Nessun AVIF (rimosso a luglio 2026 — non era referenziato da alcun `<picture>` nel codice)
- OG social image = generata dinamicamente da `/api/og/[slug]` (non usa questi derivati)

## Pattern di riferimento nel codice
```astro
<!-- Hero -->
<source srcset={cover.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />

<!-- Card / next-item -->
<source srcset={cover.replace(/\.(png|jpe?g)$/i, '-card.webp')} type="image/webp" />
```

## Comando
```bash
node scripts/optimize-images.mjs
```
Elabora `public/og/`, `public/choosetoseethem/`, `public/team/`. Salta file < 5KB.
