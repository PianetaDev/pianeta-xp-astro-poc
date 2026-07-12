# Design Tokens — Sistema Unico (source: /hire)

FASE 2 del refactor "sistema unico stile /hire". La pagina `/hire`
(`src/components/hire/HireLanding.astro`) è la **source of truth** per tipografia,
componenti, spacing, radii, shadow.

Tutti i token sono in `src/styles/global.css` (`:root` + `:root[data-theme="dark"]`).

---

## Colors

| Token | Light | Dark |
|-------|-------|------|
| `--pianeta-text` | `#0e1116` | `#f5f4ee` |
| `--pianeta-bg` | `#fafaf7` | `#0e1116` |
| `--pianeta-bg-card` | `#ffffff` | `#1a1d23` |
| `--pianeta-border` | `rgba(14,17,22,.10)` | `rgba(245,244,238,.10)` |
| `--pianeta-border-strong` | `rgba(14,17,22,.20)` | `rgba(245,244,238,.22)` |
| `--pianeta-muted` | `rgba(14,17,22,.55)` | `rgba(245,244,238,.58)` |
| `--pianeta-muted-strong` | `rgba(14,17,22,.70)` | `rgba(245,244,238,.78)` |
| `--cta-primary` | `#FF6B33` | `#FF6B33` |
| `--cta-primary-hover` | `#ff8458` | `#ff8458` |
| `--cta-secondary` | `#1f5b8f` | `#4a8fc4` |
| `--soft` (band background) | `#f3f2ea` | `#15181e` |
| `--band` (dark band) | `#14171c` | `#14171c` |
| `--green` (accent) | `#1f7a3a` | `#1f7a3a` |
| `--pianeta-highlight` | `#E9FF1F` | `#E9FF1F` |
| `--pianeta-cream` | `#f6efe4` | `#1a1d23` |
| `--pianeta-error` | `#cc0000` | `#ff6b6b` |

**Regole di sostituzione (hardcoded → token):**
- `rgba(14,17,22,.55)` → `var(--pianeta-muted)`
- `rgba(14,17,22,.65)` / `.70` → `var(--pianeta-muted-strong)`
- `#0e1116` (color) → `var(--pianeta-text)`
- `#fff` (bg card) → `var(--pianeta-bg-card)`
- border `rgba(14,17,22,.10)` → `var(--pianeta-border)`

---

## Layout

| Token | Value |
|-------|-------|
| `--wrap-max` | `1040px` |
| `--wrap-narrow-max` | `720px` |
| `--sec-pad-y` | `64px` |

Utility:
- `.pi-wrap` → container 1040 con padding orizzontale 24
- `.pi-wrap-narrow` → container 720
- `.pi-sec` → sezione con padding-y 64
- `.pi-sec-soft` → sezione soft (background `--soft`, gestita per dark)

---

## Typography

Scala unica, tutti i token calati da `/hire`.

| Token | Value | Uso |
|-------|-------|-----|
| `--ty-hero` | `clamp(2rem, 5.5vw, 3.25rem)` | H1 hero (detail + index + landing) |
| `--ty-hero-lh` | `1.05` | line-height hero |
| `--ty-hero-tracking` | `-0.02em` | tracking hero |
| `--ty-sub` | `1.125rem` (18px) | hero deck / sub |
| `--ty-sub-lh` | `1.5` | line-height sub |
| `--ty-eyebrow` | `0.6875rem` (11px) | eyebrow uppercase |
| `--ty-eyebrow-tracking` | `1.5px` | tracking eyebrow |
| `--ty-h2-sec` | `clamp(1.375rem, 3vw, 1.75rem)` | H2 in-page (22→28) |
| `--ty-h2-sec-tracking` | `-0.01em` | tracking H2 |
| `--ty-h2-prose` | `clamp(1.25rem, 2.5vw, 1.5rem)` | H2 dentro articoli (20→24) |
| `--ty-h3-prose` | `1.1875rem` (19px) | H3 prose |
| `--ty-body` | `1.0625rem` (17px) | copy longform |
| `--ty-body-lh` | `1.75` | line-height body |
| `--ty-meta` | `0.8125rem` (13px) | meta inline / bullets |
| `--ty-quote` | `clamp(1.25rem, 3vw, 1.625rem)` | quote (20→26) |
| `--ty-quote-lh` | `1.45` | line-height quote |

Utility typographic classes:
- `.pi-h1` — hero title
- `.pi-h2` — sezione H2
- `.pi-hero-sub` — hero deck
- `.pi-eyebrow` — kicker uppercase
- `.pi-meta-label` — 10px uppercase muted
- `.pi-meta-value` — 13px text
- `.prose-eclag` — longform (già esistente, allineato)

---

## Cards & surfaces

| Token | Value | Uso |
|-------|-------|-----|
| `--radius-card` | `18px` | Card standard (offer, foundation) |
| `--radius-card-sm` | `14px` | Card small (method, work-cover) |
| `--radius-chip` | `12px` | Client logo / chip |
| `--radius-pill` | `999px` | Pill / CTA |
| `--pad-card` | `22px` | Padding card standard |
| `--pad-card-sm` | `18px` | Padding card small |
| `--pad-card-lg` | `28px 32px` | Padding card large (foundation) |

Border pattern: `1px solid var(--pianeta-border)`, hover → `var(--pianeta-border-strong)`.

Utility: `.pi-card`, `.pi-card--sm`.

Legacy radii (in-file only, non deprecare):
`--r-sm 0.5rem`, `--r-md 1rem`, `--r-lg 1.5rem`, `--r-pill 999px`.

---

## CTAs

Sistema `.cta-btn`:
- `.cta-primary` — orange pill (`--cta-primary` bg, white ink), padding `0.75rem 1.25rem`, radius `999px`
- `.cta-secondary` — blue pill
- `.cta-ghost` — transparent + border strong

Da HireLanding: pill custom `padding: 13px 24px` variante compatta.

Transition: `background 150ms, transform 150ms`. Hover: `translateY(-1px)`.

---

## Shadows

| Token | Value |
|-------|-------|
| `--shadow-card` | `0 4px 14px rgba(14,17,22,.12)` |

---

## Transitions

| Token | Value |
|-------|-------|
| `--transition-base` | `150ms` |

Hover pattern standard: `transform: translateY(-3px)` per card cliccabili
(o `-2px` su varianti compact).

---

## Dark mode notes

Il tema dark è attivato via `:root[data-theme="dark"]` (o auto+sun=night).
Override principali sono in `global.css`:

- `--soft` passa da `#f3f2ea` → `#15181e` (le sezioni soft restano visibili)
- `--band` resta `#14171c`
- Colori card/border/text/muted sono già mappati sui token, quindi le utility
  `.pi-card`/`.pi-wrap`/etc. funzionano in dark senza override
- Alcuni componenti storici hanno bg hardcoded `#fff` → il file `global.css`
  include override espliciti (vedi blocco "Componenti che hanno colori hard-coded")

**Rule of thumb**: sostituire `#fff` bg-card e `rgba(14,17,22,.xx)` con i token
`--pianeta-*` risolve dark mode automaticamente.

---

## Utility classes riepilogo

```css
.pi-wrap           /* 1040 container */
.pi-wrap-narrow    /* 720 container */
.pi-sec            /* 64px padding-y */
.pi-sec-soft       /* 64px padding-y + bg --soft */
.pi-card           /* card standard */
.pi-card--sm       /* card small */
.pi-h1             /* hero title */
.pi-h2             /* section H2 */
.pi-hero-sub       /* hero deck */
.pi-eyebrow        /* kicker uppercase */
.pi-meta-label     /* 10px uppercase muted */
.pi-meta-value     /* 13px text */
```

---

## Source

- `src/components/hire/HireLanding.astro` — source of truth
- `src/styles/global.css` — tokens + utility
- Applicato in FASE 2 su: pagine pubbliche (index, lavoriamo-insieme,
  processo, bandi, team-as-a-service, team, 404, alba, en/*), light pass su
  admin.

NON toccare `src/components/hire/*` né `src/pages/hire/*` — la source of truth
resta canonica.
