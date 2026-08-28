---
status: attivo — modulo add-on di Stack Terra (PIA-1309, 2026-08-28)
compiled: 2026-08-28
revised: 2026-08-28
author: COMPASS (PIA-1303, PIA-1309)
fonti: Piano R&D (riferimento parziale — stack WordPress Multisite superato, vedi nota); BRIEF.md Susdef; thread PIA-1303/PIA-1309 (Max)
prodotto-correlato: offer-stack-terra.md
---

> **Questo documento descrive il modulo DocumentAI di Stack Terra.** Non è un prodotto standalone — si vende come add-on a chi sceglie Terra. La strategia di mercato (persona, canali, contenuti) vive in [`offer-stack-terra.md`](./offer-stack-terra.md); qui si specifica cosa fa il modulo, cosa NON fa, e i gap da chiudere prima di produrre contenuti sull'AI nello specifico.

> **⚠️ Vincolo ghost EPOS-ERIC — rispettare sempre**
>
> Stessa regola di `offer-stack-terra.md`: il cliente non nominabile mai in pubblico. Il caso nominabile è **solo Susdef**.

> **Nota su stack WordPress Multisite**: il Piano R&D citava WordPress Multisite come implementazione tecnica di DocumentAI. Questa indicazione è da considerare superata o riferita a un contesto diverso (ipotesi: primo prototipo per AGESCI, progetto mai finalizzato). L'implementazione verificata di DocumentAI è il layer AI sopra Stack Terra (Payload CMS + Nuxt 3 + MeiliSearch) — confermato dal fatto che Susdef usa queste capacità dentro il loro sito Terra.

---

## 1. Cos'è il modulo DocumentAI

DocumentAI è il **layer AI che estende Stack Terra** su archivi documentali grandi. Terra da sola fornisce CMS strutturato + ricerca full-text (MeiliSearch). DocumentAI aggiunge le capacità che richiedono elaborazione AI sul corpus:

**Capacità confermate a livello concettuale (Susdef è il caso verificato):**
- Ingestione e normalizzazione di documenti (PDF, Word, pubblicazioni) su scala
- Generazione automatica di abstract/riassunti per documenti lunghi
- Ricerca semantica / Q&A sul corpus — oltre la keyword search di MeiliSearch

**Cosa NON è:**
- Non è un chatbot generico — l'AI lavora sul corpus documentale specifico dell'organizzazione, non su dati generali
- Non è un'alternativa a MeiliSearch — i due lavorano in complementarità: MeiliSearch per ricerca full-text rapida, DocumentAI per ricerca semantica e abstract
- Non è un prodotto standalone — non si propone senza Stack Terra
- Non è un SaaS con abbonamento separato — è parte dell'offerta Terra a progetto

---

## 2. Cliente verificato

**Fondazione per lo Sviluppo Sostenibile (Susdef)** — unico caso nominabile pubblicamente.

Susdef usa DocumentAI inside il loro sito Terra (Nuxt+Payload+MeiliSearch). Il sito è live dal 16 luglio 2026, >33.000 record migrati. Le capacità AI specifiche sono parte del loro sistema.

> ⚠️ **Gap aperto (sezione 4, punto 1)**: quali specifiche funzionalità AI sono già live su Susdef? Abstract automatici, ricerca semantica, o entrambe? Prima di produrre contenuti che nominano le capacità AI del case study Susdef, Max deve confermare cosa è in produzione ora vs cosa è in roadmap.

---

## 3. Persona — identiche a Stack Terra

Le persona di DocumentAI sono le stesse di `offer-stack-terra.md` (Persona A, B, C). Il modulo si vende alla stessa organizzazione che sceglie Terra, non a un target separato.

**Come il modulo cambia la conversazione per ciascuna persona:**

- **Persona A (Comm fondazione di ricerca)** — DocumentAI risolve un problema che MeiliSearch da solo non risolve: "voglio che i ricercatori possano fare domande in linguaggio naturale al nostro archivio, non solo cercare per parole chiave." L'abstract automatico riduce anche il lavoro redazionale (non dover scrivere manualmente la sinossi per >33.000 documenti).

- **Persona B (IT/Dev fondazione)** — La sua obiezione principale cambia: se DocumentAI usa API esterne (OpenAI, ecc.), i documenti dell'organizzazione passano fuori dal perimetro GDPR. Deve sapere se il layer AI è self-hosted o cloud, e con quale provider. **Questo gap è critico per la persona B — vedi sezione 4, punto 2.**

- **Persona C (Comm consorzio europeo)** — Ha deliverable con embargo che non possono alimentare modelli di terzi. Il Q&A semantico è molto rilevante ("voglio che i partner possano interrogare l'archivio senza leggere 400 PDF"), ma solo se la governance dati è garantita.

---

## 4. Gap aperti — non produrre contenuti sull'AI senza queste risposte

**1. Quali capacità AI sono live su Susdef oggi?**
Susdef usa abstract automatici? Ricerca semantica/Q&A? O per ora solo MeiliSearch full-text e le capacità AI sono in roadmap?
— **Importante per**: case study Susdef (non possiamo affermare capacità non verificate), mappa canale × persona

**2. Il layer AI usa API esterne o è self-hosted?**
Quale provider AI (OpenAI, Mistral, Ollama self-hosted, altro)? I documenti dell'organizzazione vengono inviati a server di terzi?
— **Importante per**: persona B (obiezione GDPR), persona C (embargo). Se il layer è cloud-based, la proposta va riformulata per i consorzi europei con governance dati stringente.

**3. Pricing del modulo DocumentAI**
È un add-on a tariffa fissa? A volume di documenti? A progetto? Parte del preventivo Terra base?
— **Importante per**: contenuti di conversione (landing/case study non possono citare prezzi se non chiari)

**4. Come si posiziona sulla pagina Terra (pianeta.green)?**
DocumentAI è già menzionato su pianeta.green come funzionalità? O è implicito nel profilo Hub Editoriale? Capire dove vive nella comunicazione esistente prima di produrre nuovi contenuti.

---

## 5. Contenuti che devono esistere per DocumentAI

**Non sono contenuti standalone** — sono sezioni o angoli dentro i contenuti già previsti per Stack Terra (vedi `offer-stack-terra.md`, sezione 4).

| Contenuto | Dove vive | Cosa aggiunge il modulo AI | Prerequisito |
|---|---|---|---|
| Case study `/work/susdef` | Sezione tecnica (per Persona B) | "Le capacità AI: abstract automatici su >33k documenti, ricerca semantica" | Gap 1 risolto (conferma cosa è live) |
| Bulletin "il percorso Susdef" | Angolo narrativo per Persona A | Può menzionare l'AI se rilevante nella storia — solo se Gap 1 risolto | Gap 1 risolto |
| Landing / Hub Editoriale (pianeta.green) | Sezione capacità avanzate | "Con il modulo DocumentAI: abstract automatici, Q&A semantico" | Gap 1 + 2 risolti |

**Non esiste un contenuto "DocumentAI" separato** finché il modulo non raggiunge un volume di casi sufficiente per giustificarlo. Per ora DocumentAI è parte del racconto di Stack Terra, non un racconto suo.
