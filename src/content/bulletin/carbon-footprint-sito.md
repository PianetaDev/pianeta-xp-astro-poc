---
title: "Il carbon footprint del tuo sito — cos'è, come si misura, dove si riduce"
description: "Un sito web medio produce 1,76g di CO₂ per visita. Se il tuo brand si posiziona come sostenibile, il sito che stai mostrando ai clienti potrebbe contraddirlo — e dalla fine di settembre 2026 la UE lo considera un problema normativo, non solo reputazionale."
date: 2026-09-07
draft: true
locale: it
tags: ["web-sostenibile", "greenmeter", "carbon-footprint", "direttiva-eu", "performance"]
type: bulletin
authors: ["max"]
readingTime: "5 min"
category: "Web sostenibile"
---

<!-- BOZZA COMPASS (PIA-1333) — richiede revisione prosa MUSE prima di rimuovere draft: true -->
<!-- Struttura e messaggi chiave confermati. Blocchi verbatim da pianeta.green indicati [VERBATIM]. CTA target: GreenMeter su pianeta.green. -->

**TLDR.** Un sito web medio produce 1,76g di CO₂ per visita. Il tuo sito potrebbe produrne molto di più — e se il tuo brand si posiziona come sostenibile, questa è una contraddizione misurabile. Dal 27 settembre 2026 la Direttiva UE 2024/825 rende quella contraddizione anche un rischio normativo concreto.

## Il numero che nessuno ha misurato

Ogni visita a un sito web consuma energia: server che rispondono, dati che viaggiano sui cavi, schermi che renderizzano. La media del web è **1,76g di CO₂ per visita**. Per un sito con 10.000 visitatori mensili, sono 210kg di CO₂ all'anno — equivalenti a un volo Milano-Roma.

Il problema non è il numero in sé. Il problema è quando quel numero non c'è — quando nessuno ha mai misurato il footprint del sito, eppure il sito dichiara che l'azienda è sostenibile.

Per i brand della moda green, della cosmesi naturale, della detergenza eco, dell'alimentare sostenibile, questa asimmetria è visibile. I visitatori, i buyer, i partner di filiera la vedono.

## Dal 27 settembre 2026: non è più solo reputazione

La Direttiva UE 2024/825 — EmpCo, Empowering Consumers for the Green Transition — entra in enforcement il 27 settembre 2026. Vieta le dichiarazioni ambientali generiche non verificabili. Sanzioni fino al **4% del fatturato annuo**.

Non riguarda solo ciò che è scritto sulle etichette dei prodotti. Riguarda qualsiasi comunicazione ambientale — incluso il sito web.

Un sito che dichiara "siamo sostenibili" senza metriche verificabili è esattamente il tipo di dichiarazione che la direttiva prende di mira.

## Carbon budget e performance budget come vincoli tecnici

[VERBATIM da pianeta.green] "Ogni progetto ha un performance budget e un carbon budget definiti a monte, misurabili e rendicontabili esattamente come il budget economico."

Questa è la differenza tra sostenibilità come posizionamento e sostenibilità come metodo. Un carbon budget non è un'intenzione: è un valore soglia verificato ad ogni deploy, integrato nel CI pipeline, rendicontabile a richiesta.

Gli stessi principi valgono per il performance budget: tempo di caricamento, dimensione totale della pagina, Core Web Vitals — tutto misurato, tutto documentato.

## Come si misura il footprint del tuo sito

Lo strumento è GreenMeter — un'analisi del sito in tempo reale che restituisce:
- grammi di CO₂ stimati per visita
- confronto con la media del web e con il nostro benchmark
- principali fonti di inefficienza (immagini non ottimizzate, font pesanti, script di terze parti, hosting non rinnovabile)

Non richiede accesso al codice. Funziona su qualsiasi URL.

**→ Misura il tuo sito su [pianeta.green](https://pianeta.green)**

## Dove si riduce — i tre layer

I nostri siti producono il **70% di CO₂ in meno** rispetto alla media web. Non per una singola ottimizzazione, ma per come è costruito il sistema:

**Mycelium — hosting** [VERBATIM] "Alimentato al 100% da energia rinnovabile certificata. CDN Cloudflare con edge node italiano."

**Terra — CMS e architettura** Stack headless con Payload CMS e Nuxt. Niente plugin inutilizzati, niente query non ottimizzate. Il codice è pulito per definizione di stack, non per pulizia successiva.

**Hederae — design system** Componenti Vue con token-based, ottimizzati per peso. WCAG 2.1 AA integrata — non retrofittata.

[VERBATIM] "Non ottimizziamo singoli componenti. Progettiamo sistemi che si ottimizzano insieme — ogni layer conosce gli altri."

## Il passo successivo

Se il tuo sito non è mai stato misurato, la prima cosa da fare è misurarlo. GreenMeter dà il quadro in due minuti.

Se il quadro mostra un problema — footprint alto, performance sotto soglia, hosting non rinnovabile — possiamo costruire il percorso per risolverlo. Con numeri di partenza, obiettivi verificabili, e la documentazione per dimostrarlo.

Inizia dalla misurazione: **[pianeta.green](https://pianeta.green)**

---

*Hai domande o vuoi parlare del tuo caso specifico? Scrivi a [info@pianeta.studio](mailto:info@pianeta.studio) oppure parla con Alba direttamente — è disponibile qui sul sito.*
