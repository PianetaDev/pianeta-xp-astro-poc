---
status: stub — in attesa di materiale verificato (PIA-1303, 2026-08-28)
compiled: 2026-08-28
author: COMPASS (PIA-1303)
fonti: Piano R&D `09_relazione_sostenibilita/03_Piano_RD_e_Startup_Innovativa.md` (citato da Max nel thread PIA-1303)
prodotto-correlato: offer-stack-terra.md
---

> **Questo documento copre solo DocumentAI.** La piattaforma CMS + ricerca (Nuxt+Payload+MeiliSearch) è un prodotto separato — vedi [`offer-stack-terra.md`](./offer-stack-terra.md).

# Strategia offerta — DocumentAI

> **Nota di stato**: questo documento è uno stub — ho solo i fatti del Piano R&D, non materiale di brief approfondito come per Stack Terra. Non procedere con persona o contenuti finche' Max non risponde alle domande nella sezione 5.

---

## 1. Definizione dell'offerta

### Cosa sappiamo (fatti verificati dal Piano R&D)

DocumentAI e' un **workflow/tool AI per documenti di ricerca** — un asset proprietario distinto da Stack Terra.

**Stack tecnico**: WordPress Multisite + API enterprise (confermato da Piano R&D). Stack completamente diverso da Stack Terra (Nuxt+Payload+MeiliSearch) — non sono intercambiabili.

**Cliente verificato**: AGESCI — commessa €38K. **Nominabilita' di AGESCI: da verificare con Max** (vedi sezione 5, punto 1).

**Relazione con Stack Terra**: i due prodotti sono "connessi e integrati" (Max, 2026-08-28) ma restano offerte distinte. DocumentAI puo' operare sopra un sito esistente senza richiedere migrazione su Stack Terra. Quando i due sono combinati si ottiene la piattaforma documentale AI completa.

### Cos'e' (ipotesi da verificare)

Un sistema che aggiunge capacita' AI su un corpus di documenti esistente — probabilmente: ingestione di documenti (PDF, Word, pubblicazioni), elaborazione AI (estrazione di concetti, abstract automatici, Q&A), accesso via API o interfaccia dedicata.

> ⚠️ Non ho un brief dettagliato su DocumentAI come ho su Stack Terra. Le caratteristiche sopra sono inferite dal nome e dal contesto del Piano R&D. Non procedere con contenuti pubblici basati su queste ipotesi — chiedere prima il materiale verificato.

### Cosa NON e' (da confermare)

- **Non e' Stack Terra**: stack diverso (WordPress Multisite vs Nuxt+Payload), target potenzialmente diverso, casi diversi
- **Non e' un CMS**: non e' pensato per gestire la pubblicazione di contenuti editoriali — e' un layer di elaborazione AI su documenti esistenti
- **Non e' un sostituto di Stack Terra**: i due si completano

---

## 2. Persona — DA SVILUPPARE

> **Non ho abbastanza segnali verificati per costruire persona credibili per DocumentAI.** Il contesto AGESCI (organizzazione scout, non fondazione di ricerca) suggerisce un target diverso da Stack Terra. Prima di sviluppare questa sezione, Max deve rispondere alle domande nella sezione 5.

---

## 3. Mappa canale x persona — DA SVILUPPARE

Dipende dalla definizione di persona (sezione 2 da sviluppare).

---

## 4. Contenuti prioritari — DA SVILUPPARE

Dipende da: nominabilita' AGESCI, materiale verificato sull'offerta, persona.

---

## 5. Gap aperti — non procedere senza risposta di Max

1. **AGESCI nominabile?** E' il caso verificato di DocumentAI (commessa €38K da Piano R&D). Prima di costruire qualsiasi strategia pubblica serve sapere: Pianeta ha lavorato come partner diretto o ghost? Il progetto e' concluso e il cliente ha dato consenso alla pubblicazione? **Questa e' la domanda piu' urgente — senza risposta non posso sviluppare nessuna sezione.**

2. **Cosa fa esattamente DocumentAI su AGESCI?** Qual e' il problema che risolve, qual e' l'output per il cliente? Il Piano R&D la chiama "workflow/tool AI per documenti di ricerca" — ma AGESCI non e' un istituto di ricerca. Serve una descrizione concreta del caso d'uso reale.

3. **WordPress Multisite e' la scelta tecnica definitiva o una dipendenza dal cliente?** Stack Terra usa Nuxt+Payload per una ragione precisa (performance, no plugin, live preview). DocumentAI usa WordPress Multisite — e' una scelta di prodotto o un adattamento alle esigenze specifiche di AGESCI?

4. **Integrabilita' con Stack Terra**: come si integrano concretamente i due prodotti? Un cliente Terra puo' aggiungere DocumentAI? Un cliente DocumentAI migra poi su Terra?

5. **Target reale di DocumentAI**: il target e' lo stesso di Stack Terra (fondazioni, enti di ricerca) o e' un segmento diverso? AGESCI e' un'organizzazione scout — suggerisce un target "grandi organizzazioni con archivio documentale interno", non necessariamente "enti di ricerca con pubblicazioni".
