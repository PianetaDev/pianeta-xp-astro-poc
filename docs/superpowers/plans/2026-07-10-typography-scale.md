# Scala Tipografica Canonica — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidare la tipografia del sito pianeta.studio sulle classi semantiche già esistenti in `global.css`, colmando i due buchi reali trovati (nessuna classe di eyebrow condivisa, nessuna classe per titolo/lead/fine-print delle pagine di utilità) e migrando le pagine che oggi usano dimensioni Tailwind arbitrarie e colori hardcoded non theme-aware.

**Architecture:** Aggiunta di 4 classi CSS a `src/styles/global.css` (`.eyebrow`, `.page-title`, `.lead`, `.fine-print`), poi sostituzione delle classi Tailwind arbitrarie in 14 pagine Astro (privacy/cookie/contact/bulletin, IT+EN) con le nuove classi semantiche. Nessuna modifica a componenti Vue, nessuna modifica a `IndexCard.astro`/pagine hub (già conformi, vedi "Correzione di scope" sotto).

**Tech Stack:** Astro 7 (SSR), CSS custom properties, Tailwind utility classes (invariato per spaziatura/layout, solo il testo cambia classe).

**Ambiente locale:** il Node di sistema (25.6.1, Homebrew) ha una libreria rotta (`libsimdjson`) indipendente da questo lavoro e fa fallire `pnpm`/`node` invocati senza percorso esplicito. Tutti i comandi in questo piano vanno eseguiti con:
```bash
PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build
```
(Node 22 è già installato via `brew install node@22`, non tocca il Node di sistema.)

---

## Correzione di scope rispetto allo spec

Lo spec (`docs/superpowers/specs/2026-07-10-typography-scale-design.md`) elencava `ContentCard.astro`, `Hero.astro` e i componenti newsletter come "alta priorità". Verificando l'uso reale dei file prima di scrivere questo piano:

- **`ContentCard.astro` e `Hero.astro` non sono importati da nessuna pagina** (`grep -rn "ContentCard\|components/Hero"` su tutto `src/` non trova import). Sono codice morto — migrarli non avrebbe alcun effetto visibile. **Esclusi da questo piano.**
- **Il vero componente card usato ovunque** (work/team/lab/careers/bulletin, IT+EN) è `src/components/detail/IndexCard.astro`, che **già usa correttamente** `index-card-kicker`/`index-card-title`/`index-card-deck` — nessuna migrazione necessaria.
- **I componenti newsletter** (`NewsletterForm.vue`, `NewsletterPopup.vue`) hanno sfondo nero fisso (`bg-black text-white`) — applicarci le classi semantiche (che assumono testo scuro su sfondo chiaro, es. `.lead` usa `var(--pianeta-muted-strong)` ≈ grigio scuro) renderebbe il testo illeggibile sul nero. Il loro problema reale è colore/posizione/forma del banner, non la scala tipografica — già correttamente fuori scope nello spec originale ("Redesign newsletter banner... spec successivi"). **Esclusi da questo piano**, restano nel lotto del futuro spec sul newsletter banner.

Ciò che resta, verificato file-per-file, è concreto e reale: le 14 pagine privacy/cookie/contact/bulletin (IT+EN) usano `text-4xl font-black` fisso (non responsive) per i titoli e colori hardcoded `text-black/70` / `text-black/55` / `text-black/50` per lead e fine-print — che **non si adattano al dark mode** (a differenza di `var(--pianeta-muted-strong)`/`var(--pianeta-muted)`, già usati nel resto del sito e già dotati di varianti dark in `global.css`). Questo è anche un contributo diretto al bug "dark mode a volte rompe la leggibilità dei testi" segnalato da Francesca.

**Nota:** la generalizzazione di `team-section-title` (in `src/pages/team/index.astro`, stile scoped locale) non è inclusa: oggi ha un solo consumatore, funziona correttamente, nessun bug visibile — introdurre una classe condivisa per un solo utilizzo sarebbe astrazione prematura senza beneficio misurabile.

---

### Task 1: Nuove classi in global.css

**Files:**
- Modify: `src/styles/global.css:167` (consolidamento eyebrow)
- Modify: `src/styles/global.css:223` (consolidamento eyebrow)
- Modify: `src/styles/global.css:239` (inserimento nuove classi dopo questa riga)

- [ ] **Step 1: Consolidare `.detail-eyebrow`/`.index-eyebrow` su una base condivisa `.eyebrow`**

In `src/styles/global.css`, sostituisci la riga 167:
```css
.detail-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(14,17,22,0.55); margin: 0 0 28px; }
```
con:
```css
.eyebrow, .detail-eyebrow, .index-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(14,17,22,0.55); }
.detail-eyebrow { margin: 0 0 28px; }
```

Poi sostituisci la riga 223 (ora spostata di una riga più in basso per l'inserimento sopra, verifica con grep prima di editare):
```css
.index-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(14,17,22,0.55); margin: 0 0 16px; }
```
con:
```css
.index-eyebrow { margin: 0 0 16px; }
```

Questo preserva esattamente il comportamento visivo esistente (stesso font-size/transform/spacing/colore, stessi margini per-selettore) — è un puro raggruppamento, zero rischio visivo.

- [ ] **Step 2: Verificare che non resti una dichiarazione duplicata**

Run: `grep -n "eyebrow" src/styles/global.css`
Expected: 4 righe totali — la riga con la dichiarazione condivisa (`.eyebrow, .detail-eyebrow, .index-eyebrow { ... }`), `.detail-eyebrow { margin... }`, `.index-eyebrow { margin... }`, e le due righe `.detail-eyebrow a` / `.detail-eyebrow a:hover` invariate.

- [ ] **Step 3: Aggiungere `.page-title`, `.lead`, `.fine-print`**

Subito dopo la riga `.index-empty { ... }` (quella che precede il commento `/* Print CSS */`), aggiungi:

```css

/* Pagine di utilità — privacy/cookie/contact/bulletin flow */
.page-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 900; letter-spacing: -0.02em; line-height: 1.1; }
.lead { font-size: 1.0625rem; color: var(--pianeta-muted-strong); line-height: 1.5; }
.fine-print { font-size: 0.8125rem; color: var(--pianeta-muted); line-height: 1.4; }
```

`var(--pianeta-muted-strong)` e `var(--pianeta-muted)` sono già definiti (root + `[data-theme="dark"]`) — a differenza di `text-black/70`/`text-black/55` che restano neri anche in dark mode, queste si adattano automaticamente.

- [ ] **Step 4: Verificare che il file sia CSS valido e che il build passi**

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: build completo senza errori (`[build] Complete!`), nessun errore di parsing CSS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(typography): consolida eyebrow, aggiunge page-title/lead/fine-print"
```

---

### Task 2: Migrare privacy.astro (IT + EN)

**Files:**
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/en/privacy.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/privacy.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Privacy — Pianeta.Studio" chrome={false}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Privacy</h1>
    <div class="prose-eclag"><p>Informativa privacy ai sensi del GDPR. Per richieste: <a class='underline' href='mailto:info@pianeta.studio'>info@pianeta.studio</a>.</p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/privacy.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout title="Privacy — Pianeta.Studio" chrome={false}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Privacy</h1>
    <div class="prose-eclag"><p>Privacy notice pursuant to GDPR. For requests: <a class='underline' href='mailto:info@pianeta.studio'>info@pianeta.studio</a>.</p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verificare che `text-4xl font-black` sia sparito e il build passi**

Run: `grep -c "text-4xl font-black" src/pages/privacy.astro src/pages/en/privacy.astro`
Expected: `0` per entrambi i file (grep esce con status 1 e nessun match, oppure stampa `file:0` a seconda della versione — verifica che non ci sia output di match).

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy.astro src/pages/en/privacy.astro
git commit -m "feat(typography): migra privacy.astro a page-title"
```

---

### Task 3: Migrare cookie.astro (IT + EN)

**Files:**
- Modify: `src/pages/cookie.astro`
- Modify: `src/pages/en/cookie.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/cookie.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Cookie — Pianeta.Studio" chrome={false}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Cookie</h1>
    <div class="prose-eclag"><p>Cookie policy. Usiamo cookie tecnici e, previo consenso, di analisi.</p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/cookie.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout title="Cookie — Pianeta.Studio" chrome={false}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Cookie</h1>
    <div class="prose-eclag"><p>Cookie policy. We use technical cookies and, with your consent, analytics cookies.</p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -c "text-4xl font-black" src/pages/cookie.astro src/pages/en/cookie.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/cookie.astro src/pages/en/cookie.astro
git commit -m "feat(typography): migra cookie.astro a page-title"
```

---

### Task 4: Migrare contact.astro (IT + EN)

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/en/contact.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Contact — Pianeta.Studio" chrome={true}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Contact</h1>
    <div class="prose-eclag"><p class='lead'>Scrivici: <a class='underline' href='mailto:info@pianeta.studio'>info@pianeta.studio</a></p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/contact.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout title="Contact — Pianeta.Studio" chrome={true}>
  <article class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-6">Contact</h1>
    <div class="prose-eclag"><p class='lead'>Write to us: <a class='underline' href='mailto:info@pianeta.studio'>info@pianeta.studio</a></p></div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -cE "text-4xl font-black|text-lg" src/pages/contact.astro src/pages/en/contact.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/contact.astro src/pages/en/contact.astro
git commit -m "feat(typography): migra contact.astro a page-title/lead"
```

---

### Task 5: Migrare bulletin/iscrivimi.astro (IT + EN)

**Files:**
- Modify: `src/pages/bulletin/iscrivimi.astro`
- Modify: `src/pages/en/bulletin/iscrivimi.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/bulletin/iscrivimi.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout title="Iscriviti al Bulletin — Pianeta.Studio">
  <section class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-4">Iscriviti al Bulletin</h1>
    <p class="lead mb-8">Una mail al mese su sustainable creativity, design e tecnologia.</p>
    <form action="/api/newsletter/subscribe" method="post" class="flex flex-col gap-4 max-w-md">
      <input type="hidden" name="locale" value="it" />
      <input type="email" name="email" required placeholder="tu@email.it" class="border border-black/20 rounded-md px-4 py-3 bg-white"/>
      <button type="submit" class="bg-ink text-bg px-6 py-3 rounded-md font-semibold">Iscrivimi</button>
    </form>
    <p class="fine-print mt-4">Iscrivendoti accetti la nostra <a class="underline" href="/privacy">privacy</a>.</p>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/bulletin/iscrivimi.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
---
<BaseLayout title="Subscribe to the Bulletin — Pianeta.Studio">
  <section class="px-6 lg:px-12 pt-16 pb-16 max-w-[720px]">
    <h1 class="page-title mb-4">Subscribe to the Bulletin</h1>
    <p class="lead mb-8">One email a month on sustainable creativity, design and technology.</p>
    <form action="/api/newsletter/subscribe" method="post" class="flex flex-col gap-4 max-w-md">
      <input type="hidden" name="locale" value="en" />
      <input type="email" name="email" required placeholder="you@email.com" class="border border-black/20 rounded-md px-4 py-3 bg-white"/>
      <button type="submit" class="bg-ink text-bg px-6 py-3 rounded-md font-semibold">Subscribe</button>
    </form>
    <p class="fine-print mt-4">By subscribing you accept our <a class="underline" href="/en/privacy">privacy policy</a>.</p>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -cE "text-black/70|text-xs text-black/50|text-4xl font-black" src/pages/bulletin/iscrivimi.astro src/pages/en/bulletin/iscrivimi.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/bulletin/iscrivimi.astro src/pages/en/bulletin/iscrivimi.astro
git commit -m "feat(typography): migra bulletin/iscrivimi.astro"
```

---

### Task 6: Migrare bulletin/confermato.astro (IT + EN)

**Files:**
- Modify: `src/pages/bulletin/confermato.astro`
- Modify: `src/pages/en/bulletin/confermato.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/bulletin/confermato.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
const already = Astro.url.searchParams.get('already') === '1';
---
<BaseLayout title={already ? 'Già iscritto · Bulletin Pianeta' : 'Iscrizione confermata · Bulletin Pianeta'} description="Iscrizione attiva.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">🌱</p>
    <h1 class="page-title">
      {already ? 'Iscrizione già attiva' : 'Iscrizione confermata'}
    </h1>
    <p class="mt-6 lead">
      {already ? (
        <span>{email && <strong class="text-black">{email}</strong>} risulta già iscritto. Tutto a posto.</span>
      ) : (
        <span>Da oggi riceverai il Bulletin di Pianeta.Studio{email && ` a `}{email && <strong class="text-black">{email}</strong>}.</span>
      )}
    </p>
    <p class="mt-4 fine-print">Ti abbiamo mandato un'email di benvenuto col link al centro preferenze.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a href="/bulletin" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">Leggi gli articoli →</a>
      <a href="/" class="inline-block border border-black/15 px-5 py-3 rounded-full text-sm font-medium hover:border-black">Vai alla home</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/bulletin/confermato.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
const already = Astro.url.searchParams.get('already') === '1';
---
<BaseLayout title={already ? 'Already subscribed · Pianeta Bulletin' : 'Subscription confirmed · Pianeta Bulletin'} description="Subscription active.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">🌱</p>
    <h1 class="page-title">
      {already ? 'Subscription already active' : 'Subscription confirmed'}
    </h1>
    <p class="mt-6 lead">
      {already ? (
        <span>{email && <strong class="text-black">{email}</strong>} is already subscribed. All good.</span>
      ) : (
        <span>From today you'll receive Pianeta.Studio's Bulletin{email && ` at `}{email && <strong class="text-black">{email}</strong>}.</span>
      )}
    </p>
    <p class="mt-4 fine-print">We sent you a welcome email with the link to your preferences.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a href="/en/bulletin" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">Read the articles →</a>
      <a href="/en" class="inline-block border border-black/15 px-5 py-3 rounded-full text-sm font-medium hover:border-black">Go to homepage</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -cE "text-3xl md:text-4xl|text-lg text-black/70|text-sm text-black/55" src/pages/bulletin/confermato.astro src/pages/en/bulletin/confermato.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/bulletin/confermato.astro src/pages/en/bulletin/confermato.astro
git commit -m "feat(typography): migra bulletin/confermato.astro"
```

---

### Task 7: Migrare bulletin/disiscritto.astro (IT + EN)

**Files:**
- Modify: `src/pages/bulletin/disiscritto.astro`
- Modify: `src/pages/en/bulletin/disiscritto.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/bulletin/disiscritto.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
---
<BaseLayout title="Disiscritto · Bulletin Pianeta" description="Iscrizione rimossa.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">🌱</p>
    <h1 class="page-title">Confermato</h1>
    <p class="mt-6 lead">
      {email ? (
        <span><strong class="text-black">{email}</strong> è stato rimosso dalla lista.</span>
      ) : (
        <span>L'iscrizione è stata rimossa.</span>
      )}
    </p>
    <p class="mt-4 fine-print">Non riceverai più nostre email. Grazie per averci letto fin qui.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a href="/" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">Vai alla home</a>
      <a href="/bulletin/iscrivimi" class="inline-block border border-black/15 px-5 py-3 rounded-full text-sm font-medium hover:border-black">Riscriviti</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/bulletin/disiscritto.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
---
<BaseLayout title="Unsubscribed · Pianeta Bulletin" description="Subscription removed.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">🌱</p>
    <h1 class="page-title">Confirmed</h1>
    <p class="mt-6 lead">
      {email ? (
        <span><strong class="text-black">{email}</strong> has been removed from the list.</span>
      ) : (
        <span>The subscription has been removed.</span>
      )}
    </p>
    <p class="mt-4 fine-print">You won't receive any more emails from us. Thanks for reading this far.</p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a href="/en" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">Go to homepage</a>
      <a href="/en/bulletin/iscrivimi" class="inline-block border border-black/15 px-5 py-3 rounded-full text-sm font-medium hover:border-black">Subscribe again</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -cE "text-3xl md:text-4xl|text-lg text-black/70|text-sm text-black/55" src/pages/bulletin/disiscritto.astro src/pages/en/bulletin/disiscritto.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/bulletin/disiscritto.astro src/pages/en/bulletin/disiscritto.astro
git commit -m "feat(typography): migra bulletin/disiscritto.astro"
```

---

### Task 8: Migrare bulletin/grazie.astro (IT + EN)

**Files:**
- Modify: `src/pages/bulletin/grazie.astro`
- Modify: `src/pages/en/bulletin/grazie.astro`

- [ ] **Step 1: Sostituire il contenuto di `src/pages/bulletin/grazie.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
---
<BaseLayout title="Grazie · Bulletin Pianeta" description="Controlla la casella email per confermare l'iscrizione.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">📬</p>
    <h1 class="page-title">Controlla la tua casella</h1>
    <p class="mt-6 lead">
      Ti abbiamo mandato un'email{email && ` a `}{email && <strong class="text-black">{email}</strong>} con il link per confermare l'iscrizione.
    </p>
    <p class="mt-4 fine-print">
      Se non la trovi in pochi minuti, controlla in spam o scrivici a <a href="mailto:bulletin@pianeta.studio" class="underline">bulletin@pianeta.studio</a>.
    </p>
    <div class="mt-10">
      <a href="/bulletin" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">← Torna al Bulletin</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Sostituire il contenuto di `src/pages/en/bulletin/grazie.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
const email = Astro.url.searchParams.get('email') || '';
---
<BaseLayout title="Thanks · Pianeta Bulletin" description="Check your inbox to confirm the subscription.">
  <div class="px-6 lg:px-10 py-16 md:py-24 max-w-[640px] mx-auto text-center">
    <p class="text-5xl mb-6">📬</p>
    <h1 class="page-title">Check your inbox</h1>
    <p class="mt-6 lead">
      We sent you an email{email && ` at `}{email && <strong class="text-black">{email}</strong>} with the link to confirm your subscription.
    </p>
    <p class="mt-4 fine-print">
      Can't find it in a few minutes? Check spam or write us at <a href="mailto:bulletin@pianeta.studio" class="underline">bulletin@pianeta.studio</a>.
    </p>
    <div class="mt-10">
      <a href="/en/bulletin" class="inline-block bg-black text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-black/85">← Back to the Bulletin</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verificare e buildare**

Run: `grep -cE "text-3xl md:text-4xl|text-lg text-black/70|text-sm text-black/55" src/pages/bulletin/grazie.astro src/pages/en/bulletin/grazie.astro`
Expected: nessun match.

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run build`
Expected: `[build] Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/bulletin/grazie.astro src/pages/en/bulletin/grazie.astro
git commit -m "feat(typography): migra bulletin/grazie.astro"
```

---

### Task 9: Verifica finale

**Files:** nessuna modifica, solo verifica.

- [ ] **Step 1: Suite di test esistente**

Run: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm test`
Expected: tutti i test esistenti passano (nessuna di queste pagine ha test dedicati — questo è solo un controllo di non-regressione sul resto del repo).

- [ ] **Step 2: Grep di sicurezza — nessun residuo delle classi vecchie in nessuno dei 14 file**

Run:
```bash
grep -rlE "text-4xl font-black|text-3xl md:text-4xl font-black|text-black/70|text-black/5[05]" \
  src/pages/privacy.astro src/pages/cookie.astro src/pages/contact.astro \
  src/pages/bulletin/{confermato,disiscritto,grazie,iscrivimi}.astro \
  src/pages/en/privacy.astro src/pages/en/cookie.astro src/pages/en/contact.astro \
  src/pages/en/bulletin/{confermato,disiscritto,grazie,iscrivimi}.astro
```
Expected: nessun file stampato (nessun match residuo).

- [ ] **Step 3: Dev server + screenshot delle pagine toccate e della pagina di riferimento**

Avvia il dev server (`PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm run dev`) e usa il tool di preview del browser disponibile nell'ambiente per uno screenshot di ciascuna:
- `/privacy`, `/cookie`, `/contact`, `/bulletin/iscrivimi`, `/bulletin/grazie` (verifica visiva: titolo ben proporzionato, nessuna regressione di leggibilità)
- **`/lavoriamo-insieme`** — pagina di riferimento, NON toccata da questo piano: deve apparire visivamente identica a prima. Se qualcosa è cambiato qui, c'è stata una regressione in `global.css` da investigare prima di procedere.

- [ ] **Step 4: Controllo contrasto dark mode**

Sulle pagine `/privacy` e `/bulletin/grazie`, attiva il dark mode (toggle in `SiteRail` o forzando `data-theme="dark"` su `<html>` via devtools) e verifica che `.lead`/`.fine-print` restino leggibili (dovrebbero, dato che usano `var(--pianeta-muted-strong)`/`var(--pianeta-muted)` che hanno varianti dark già definite in `global.css`). Confronta con il comportamento precedente di `text-black/70` (che restava nero anche in dark mode — il bug che questo piano risolve indirettamente).

- [ ] **Step 5: Riportare risultato**

Se tutto passa, il lavoro su questo piano è completo. Riportare a Max: quali pagine sono cambiate, che il dark mode ora è corretto su queste pagine, e che `ContentCard.astro`/`Hero.astro` risultano codice morto (segnalare come possibile cleanup futuro, non rimosso in questo piano).
