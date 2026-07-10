# Scala tipografica canonica — design spec

**Data:** 2026-07-10
**Contesto:** Francesca (design) ha segnalato incoerenze tipografiche diffuse sul sito pianeta.studio (dimensioni font, kerning, interlinea) e ha indicato la pagina `/lavoriamo-insieme` come miglior riferimento esistente. La palette colori resta fuori scope — task separato assegnato a Francesca via Slack.

## Problema

`global.css` contiene già una convenzione tipografica semantica coerente e ben fatta (`detail-title`, `detail-eyebrow`, `detail-deck`, `index-title`, `index-card-title`, ecc. — tutte su pattern condiviso: eyebrow 11px/uppercase/tracking 2px, title `clamp()` + weight 900 + letter-spacing -0.02em, deck muted 65%/line-height 1.5). Il problema non è l'assenza di uno standard, ma la sua **adozione incompleta**: 26 file usano classi Tailwind arbitrarie (`text-base`, `text-sm`, `text-[11px]`, ecc.) invece delle classi semantiche, creando la deriva visiva che Francesca osserva. In particolare manca un livello "card" nella scala — `ContentCard.astro` (usato in hub/work) è il caso più visibile, con font-size e pesi decisi ad-hoc.

## Scala tipografica (fonte di verità)

Estende la convenzione esistente in `global.css`, aggiungendo solo i due livelli mancanti (`card-title`, `card-meta`) e rinominando `team-section-title` come tier generico riusabile.

| Classe | font-size | weight | letter-spacing | line-height | colore | Note |
|---|---|---|---|---|---|---|
| `.eyebrow` | 11px | 500 | 2px, uppercase | — | muted 55% | già esiste come `detail-eyebrow`/`index-eyebrow`, si consolida in un'unica classe |
| `.hero-title` | `clamp(2.25rem, 5vw, 4.25rem)` | 900 | -0.02em | 1.05 | text | già esiste come `detail-title` |
| `.section-title` | `clamp(1.4rem, 2.2vw, 1.85rem)` | 900 | -0.02em | 1.15 | text | generalizza `team-section-title` |
| `.card-title` **(nuova)** | `clamp(1rem, 1.5vw, 1.125rem)` | 800 | -0.01em | 1.25 | text | colma il buco usato oggi da `ContentCard.astro` con `font-bold text-base` |
| `.card-meta` **(nuova)** | 10–11px | 500 | 1.5px, uppercase | — | muted 50% | per kicker/meta nelle card, oggi `text-[11px]` ad-hoc |
| `.deck` | `clamp(1.05rem, 1.8vw, 1.35rem)` | 400 | — | 1.5 | muted 65% | già esiste come `detail-deck`, per hero/testata pagina |
| `.section-deck` | 1.125rem | 400 | — | 1.5 | muted 65% | già esiste come `index-deck`, per introduzioni di sezione |
| `.card-deck` | 0.875rem | 400 | — | 1.45 | muted 65% | già esiste come `index-card-deck`, per il testo dentro le card |
| `.prose` | 1.0625rem | 400 | — | 1.7 | text | testo lungo (già `detail-prose`) |

Font-family invariata: `Inter` (già in uso, nessuna richiesta di cambio).

## Componenti da migrare (26 file)

Tutti i file identificati con classi Tailwind arbitrarie per il testo, raggruppati per priorità visiva:

**Alta priorità (gerarchia editoriale visibile):**
- `src/components/ContentCard.astro` — meta → `.card-meta`, title → `.card-title`, excerpt → `.card-deck` (esistente)
- `src/components/Hero.astro`
- Team cards (`src/pages/team/index.astro` e componenti correlati)
- Newsletter: `NewsletterForm.vue`, `NewsletterPopup.vue`, `NewsletterPreferences.vue`

**Bassa priorità (pagine legali/transazionali, testo semplice ma incluse per coerenza end-to-end come richiesto):**
- `src/pages/{privacy,cookie,contact}.astro` + varianti `/en/`
- `src/pages/bulletin/{confermato,disiscritto,grazie,iscrivimi}.astro` + varianti `/en/`

**Esplicitamente fuori scope:** componenti chat/prodotto (`AlbaChat.vue`, `AlbaConversation.vue`, `HireUsHeader.vue`, `QuickReplyChip.vue`, `MobileMenu.vue`, `SiteRailFlyout.vue`, `SiteArtifactPane.vue`, `CookieConsent.vue` banner) — sono UI applicativa/interattiva, non contenuto editoriale, e non fanno parte della lamentela di Francesca sulla gerarchia dei testi.

## Migrazione

Per ciascun file in scope: sostituire le classi Tailwind arbitrarie di testo con la classe semantica corrispondente dalla tabella sopra. Nessuna modifica al markup HTML/struttura, solo alle classi CSS applicate. Le classi esistenti (`detail-*`, `index-*`) restano invariate — si aggiungono solo `.eyebrow`, `.card-title`, `.card-meta`, `.section-title` come nuove entry in `global.css`, con `detail-eyebrow`/`index-eyebrow`/`team-section-title` che diventano alias o vengono sostituite dalle nuove classi generiche (da valutare in fase di implementazione se serve mantenere retrocompatibilità con selettori esistenti altrove nel CSS).

## Verifica

- Screenshot before/after delle pagine chiave: hub (`/work`), team (`/team`), `/lavoriamo-insieme` (riferimento, non deve cambiare visivamente).
- Contrast checker sui testi muted (55%/65%/70% su sfondo chiaro e scuro), dato che Francesca ha segnalato anche leggibilità in dark mode.
- Verifica visiva responsive (mobile/desktop) per i `clamp()`.

## Fuori scope (esplicito)

- Palette colori — task assegnato a Francesca via Slack.
- Bug funzionali elencati da Francesca (color mode toggle, dark mode contrast bug, link rotti, carosello) — gestiti come fix diretti separati, non richiedono design.
- Redesign di footer, newsletter banner (layout/posizionamento), formati immagine, pagina Alba, pagina dettaglio, pagina team (overlay profilo) — spec successivi, che useranno questa scala come fondamenta.
