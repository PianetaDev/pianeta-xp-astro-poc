---
issue: PIA-1333
compiled: 2026-09-07
author: COMPASS
status: completato
scope: Cluster "Web sostenibile & CMS" — outreach GreenMachine (32 lead)
fonte-live: https://pianeta.green (verificato 2026-09-07)
---

# Audit contenuti pianeta.green → cluster Web sostenibile & CMS

## Contesto

Questo documento mappa ciò che esiste su pianeta.green e ciò che manca su pianeta.studio per sostenere l'outreach verso 32 lead GreenMachine (detergenza, cosmesi, moda/food green con siti pesanti). Il lavoro di ricognizione su pianeta.green iniziato in PIA-1328 (modulo DocumentAI / Terra) viene qui esteso al cluster Web sostenibile.

---

## 1. Contenuti esistenti su pianeta.green (verificati live, 2026-09-07)

### Home page
| Elemento | Testo verbatim (o parafrasi) | Riusabilità per pianeta.studio |
|---|---|---|
| Headline principale | "Il web sostenibile è anche il web più veloce." | ✅ anchor diretto |
| Proof stats | LCP <2.5s · 100% Rinnovabile · 99.7% Uptime SLA | ✅ riusabili in scheda tecnica |
| Carbon + performance budget | "Ogni progetto ha un performance budget e un carbon budget definiti a monte, misurabili e rendicontabili esattamente come il budget economico." | ✅ verbatim per bulletin 1 |
| Layer Terra | "Payload CMS — open source, TypeScript-first. Il codice, lo schema dati e la documentazione sono vostri. Un altro dev può subentrare con un HANDOFF.md chiaro." | ✅ verbatim per web-sostenibile.md |
| Layer Hederae | "Design system con componenti Vue riutilizzabili e token-based. Accessibilità WCAG 2.1 AA strutturale." | Secondario |
| Layer Mycelium | "Hosting alimentato al 100% da energia rinnovabile certificata. CDN Cloudflare con edge node italiano." | ✅ per bulletin 1 |
| Sistemi integrati | "Progettiamo sistemi che si ottimizzano insieme — ogni layer conosce gli altri." | ✅ verbatim per bulletin 3 |
| Normativa EU | "Dal 27 settembre 2026 la Direttiva UE 2024/825 vieta il greenwashing e impone trasparenza sulle dichiarazioni ambientali. Sanzioni fino al 4% del fatturato." | ✅ leva principale outreach GreenMachine |
| GreenMeter widget | Live in home. Headline standalone: "Quanto sostenibile è il tuo sito?" | ✅ CTA per bulletin 1 |

### Pagina /offerta (verificata live, 2026-09-07)
| Profilo | Prezzo | Note per audit |
|---|---|---|
| Single Page | €990 una tantum + €19/mese hosting | 7 giorni, GreenMeter score garantito |
| Mini-Sito | €1.990 una tantum + €29/mese (3 mesi inclusi) | 2-3 settimane, report compliance EU incluso |
| Su Misura | Da €3.500 (progetto) | Architettura headless, CMS illimitato, e-commerce/booking |

**Nota**: il pricing su pianeta.green è esplicito e self-serve — diverso dal posizionamento su pianeta.studio (no prezzo in home, CTA "Parla con Alba"). I due spoke sono coerenti: Green vende il prodotto a listino, Studio vende la produzione custom.

**CO₂ claim live** (da /offerta): "Un sito web medio produce 1.76g di CO₂ per visita. I nostri siti producono il 70% in meno." — numero riusabile verbatim nel bulletin 1.

---

## 2. Contenuti esistenti su pianeta.studio (cluster Web sostenibile & CMS)

| File | Stato | Valutazione |
|---|---|---|
| `src/content/services/web-sostenibile.md` | Pubblicato (draft: false) | Thin: 39 righe, 3 sezioni brevi. Manca copy specifico su carbon/performance budget e HANDOFF.md. Arricchire — NON riscrivere. |
| `src/content/services/greenmeter-audit-co2.md` | Pubblicato | Copre l'audit assistito ma è anch'esso thin. Non intervento in questo ciclo. |
| `src/content/bulletin/percorso-susdef.md` | Pubblicato (draft: false) | Narrativa "come abbiamo vinto la gara" — già live, non toccare. ⚠️ Contiene `max@pianeta.studio` (riga 87) — violazione regola contatto. Segnalare a MUSE per fix separato. |

**Mancante:**
- Nessun bulletin sul carbon footprint / come misurarlo / dove ridurlo → **Bulletin 1 da creare**
- Nessun bulletin prima/dopo Susdef con numeri specifici (percorso-susdef è narrativa di gara, non before/after) → **Bulletin 2 da creare**
- Nessun bulletin editoriale sullo stack Terra (perché Payload+Nuxt+MeiliSearch) → **Bulletin 3 da creare**
- Nessun work/case study Susdef → segnalare a MUSE (PIA-1302 in corso — il percorso-susdef esiste ma il case study strutturato `/work/susdef` non c'è ancora)

---

## 3. Gap analysis per l'outreach GreenMachine

**Persona target dell'onda 1 outreach**: Marketing/Communication Manager di azienda green (detergenza, cosmesi, moda, food) — sito pesante, claim green non documentati, countdown normativa EU.

**Dolore primario**: sito lento e pesante che contraddice il posizionamento sostenibile del brand. Rischio normativo concreto (Direttiva 2024/825, enforcement 27 settembre 2026, sanzioni fino al 4% fatturato).

**Cosa serve come materiale editoriale che sostanzi l'email**:

| Gap | Priorità | Deliverable | Note |
|---|---|---|---|
| Nessun bulletin che spiega cos'è il carbon footprint di un sito e come si misura | **P0** | Bulletin 1 (draft: true) | Leva principale per email wave 1. CTA: GreenMeter scan su pianeta.green |
| `web-sostenibile.md` thin — manca copy su HANDOFF.md e carbon/performance budget | **P0** | Arricchimento web-sostenibile.md | 3 blocchi verbatim da pianeta.green |
| Nessun prima/dopo Susdef con numeri | **P1** | Bulletin 2 (draft: true) | Proof point per organizzazioni con archivi documentali; secondario per GreenMachine ma utile per cross-cluster |
| Nessun editoriale sullo stack Terra | **P2** | Bulletin 3 (draft: true) | Più tecnico — per valutatori che fanno due diligence |
| Fix contatto privato in percorso-susdef.md | **P2** | Fix separato da assegnare a MUSE | max@pianeta.studio → info@pianeta.studio o CTA Alba |

---

## 4. Fix fattuale pianeta.green — BLOCCATO

**Problema identificato**: la home di pianeta.green indica "Società Benefit iscritta al Registro Imprese di Milano — da sempre". Informazione errata: la sede legale è San Giovanni La Punta (CT), REA CT-459996, Registro Sud Est Sicilia. Milano è solo sede operativa di Francesca.

**Stato**: il repo/CMS di pianeta.green non è accessibile né in `~/dev` né via GitHub (deploy via CLI Vercel diretto, non da repo GitHub). Stesso blocco già incontrato in PIA-1328.

**Azione richiesta**: Max/Fabrizio Ciampini (probabile owner tecnico) devono correggere il dato direttamente. Non perdere altro tempo a cercare il repo.

---

## 5. Elenco contenuti da creare (prioritizzati)

I seguenti contenuti sono stati creati come bozze (draft: true) nel branch `feat/pia-1333-bulletins-web-sostenibile` del repo astro-poc. Richiedono revisione MUSE prima che Max rimuova draft: true.

### [P0] Bulletin 1 — "Il carbon footprint del tuo sito"
- **File**: `src/content/bulletin/carbon-footprint-sito.md`
- **Slug**: `carbon-footprint-sito`
- **Persona**: Marketing/Comm Manager azienda green con sito pesante
- **Leva principale**: Direttiva UE 2024/825, enforcement 27 settembre 2026
- **CTA**: scan GreenMeter su pianeta.green

### [P0] Arricchimento web-sostenibile.md
- **File**: `src/content/services/web-sostenibile.md`
- **Aggiunte**: copy su carbon/performance budget come vincoli verificabili, HANDOFF.md / codice consegnato, 1.76g CO₂/visita claim

### [P1] Bulletin 2 — "Susdef prima/dopo"
- **File**: `src/content/bulletin/susdef-prima-dopo.md`
- **Persona**: Comm Manager di organizzazione con archivio documentale sottoutilizzato
- **Nota**: distinto da `percorso-susdef.md` (già pubblicato, narrativa di gara) — questo è formato before/after con numeri specifici

### [P2] Bulletin 3 — "Stack Terra: perché Payload + Nuxt + MeiliSearch"
- **File**: `src/content/bulletin/stack-terra-perche.md`
- **Persona**: Valutatori tecnici, comm manager tech-savvy
- **Nota**: non nominare EPOS-ERIC mai

### [fuori scope — follow-up separato] Case study `/work/susdef`
- Dipende da screenshot disponibili + quote cliente
- Max ha già autorizzato i numeri tecnici (>33.000 record, stack, timeline)
- Segnalare come prossima issue MUSE quando screenshot pronti

### [fuori scope] Fix pianeta.green sede legale
- Blocco tecnico — assegnare a Fabrizio Ciampini
