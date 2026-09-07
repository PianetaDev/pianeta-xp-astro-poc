---
title: "Il carbon footprint del tuo sito — cos'è, come si misura, dove si riduce"
description: "Un sito web medio produce 1.76g di CO₂ a visita. Dal 27 settembre 2026 la Direttiva UE 2024/825 rende sanzionabili i claim green non documentati. Come misurare l'impatto del tuo sito e dove agire."
date: 2026-09-07
draft: true
locale: it
tags: ["web sostenibile", "carbon footprint", "greenmeter", "performance", "direttiva EU", "EmpCo"]
type: bulletin
authors: ["max"]
readingTime: "5 min"
category: "Web sostenibile"
---

**TLDR.** Un sito web medio produce 1.76g di CO₂ per visita. I nostri producono il 70% in meno. Ma prima ancora del numero, conta il metodo: carbon budget e performance budget come vincoli tecnici verificabili, definiti a monte, non dichiarazioni di intenti post-lancio. Dal 27 settembre 2026 la Direttiva UE 2024/825 rende sanzionabili i claim ambientali non documentati — fino al 4% del fatturato. Ecco come misurare e dove ridurre.

## Quanto pesa davvero un sito web

Ogni volta che qualcuno apre una pagina del tuo sito accade qualcosa di fisico: server che rispondono, dati che viaggiano su cavi e antenne, dispositivi che elaborano. Tutto questo consuma energia. Una parte di quell'energia — dipende da dove viene prodotta — genera CO₂.

Il numero di riferimento: **1.76g di CO₂ per visita** è la media globale (fonte: Website Carbon Calculator, 2023). Per un sito con 50.000 visite al mese sono circa 1.05 tonnellate di CO₂ l'anno — l'equivalente di tre voli Roma-Londra a settimana.

Per un'organizzazione che fa del posizionamento sostenibile il proprio business, questo numero è rilevante in due modi:
1. **Coerenza**: un sito pesante e lento contraddice il messaggio
2. **Compliance**: dal 27 settembre 2026 non basta *dire* che sei green — devi *dimostrarlo*

## La Direttiva UE 2024/825 — cosa cambia concretamente

La Direttiva Europea 2024/825 (EmpCo — Empowering Consumers for the Green Transition) vieta le dichiarazioni ambientali generiche non documentate. "Eco-friendly", "carbon neutral", "sostenibile" sul tuo sito o nelle tue comunicazioni senza dati verificabili a supporto diventano sanzionabili dall'enforcement del **27 settembre 2026**.

Sanzioni: fino al **4% del fatturato annuo**.

Il tuo sito web è una dichiarazione ambientale. Se il sito dice "siamo green" e il sito stesso pesa 5MB per pagina, gira su server a carbone e carica in 6 secondi, c'è una contraddizione documentabile.

## Come si misura il carbon footprint di un sito

Esistono due livelli:

**Livello 1 — Stima automatica (gratuita)**
Tool come [GreenMeter](https://pianeta.green) calcolano l'impronta stimata di ogni pagina in base al peso del trasferimento, al tipo di hosting e alla fonte energetica del server. Il risultato è un grade (A+ → F) e un'stima in grammi di CO₂ per visita.

È il punto di partenza — non la risposta definitiva, ma sufficiente per capire se il problema è strutturale o marginale.

**Livello 2 — Audit assistito**
L'audit assistito va più in profondità: breakdown per pagina, analisi per tipologia di risorsa (immagini, script, font, video), confronto con benchmark di settore, recommendation prioritizzate. Il risultato è una roadmap di riduzione con impatto stimato per ogni intervento.

## Dove si riduce concretamente

Non si ottimizzano singoli componenti in isolamento — si progettano sistemi che si ottimizzano insieme. I tre livelli di intervento:

**Infrastruttura (Mycelium)**: hosting su server alimentati al 100% da energia rinnovabile certificata, CDN con edge node italiano che riduce la distanza fisica dei dati. Il layer più impattante sul footprint energetico, il meno visibile.

**Dati e contenuti (Terra)**: architettura headless che separa i dati dalla presentazione — niente query ridondanti, niente dati scaricati che non servono alla pagina. Performance budget definito nel CMS, non retrofittato.

**Esperienza (Hederae)**: design system con componenti ottimizzati, immagini servite nel formato corretto, font subset, nessuno script di terze parti non necessario. Il layer più visibile ma non il più impattante — agire qui senza cambiare i primi due è ottimizzazione cosmetica.

## Il carbon budget come vincolo di progetto

**Ogni progetto ha un performance budget e un carbon budget definiti a monte, misurabili e rendicontabili esattamente come il budget economico.**

Questo significa che il target di CO₂ per visita non è un'aspirazione finale — è un vincolo durante lo sviluppo, verificato in CI (integrazione continua) a ogni deploy. Se una modifica fa superare il budget, il sistema lo segnala prima che vada in produzione.

Il risultato: numeri tracciabili in dashboard, non "ipse dixit". La differenza tra un claim green documentato e uno sanzionabile.

## Il primo passo: misura

Prima di qualsiasi intervento, misura. Il GreenMeter su pianeta.green è gratuito e richiede solo l'URL.

Il risultato ti dice dove sei rispetto al benchmark. Se il grade è C o peggio, hai un problema sia di performance che di compliance futura. Se è A o B, l'audit assistito ti mostra dove migliorare ulteriormente e come documentarlo.

**[Misura il carbon footprint del tuo sito ↗](https://pianeta.green)**

---

*Carbon budget verificabile, hosting rinnovabile, codice consegnato — senza lock-in. Se vuoi sapere come funziona in un progetto reale, parti da [come abbiamo costruito il sito di Susdef](/bulletin/percorso-susdef).*
