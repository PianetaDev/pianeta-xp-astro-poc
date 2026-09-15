---
title: "Morsy — Quando il prodotto deve sentire come il brand"
description: "Come abbiamo progettato l'esperienza di Morsy partendo da un'identità, non da wireframe: B2B food delivery, due profili utente, un flusso che non era nel brief — e cosa abbiamo imparato."
date: 2026-09-15
authors: ["max"]
cover: "/og/bulletin-morsy.png"
ogImage: "/og/bulletin-morsy.png"
tags: ["ux", "product-design", "food-delivery", "metodo", "b2b"]
readingTime: "7 min"
locale: it
draft: true
type: bulletin
relatedWork: ["morsy"]
category: "Metodo"
---

**TLDR.** Morsy è il servizio di pranzo aziendale 100% flessibile: no costi fissi, no ordine minimo, consegne per team in sede o in smart working. Il brief sembrava chiaro: ridisegna il sito di delivery, migliora il flusso d'acquisto. Quello che abbiamo scoperto durante la discovery è che il problema di UX e il problema di brand erano la stessa cosa. Quello che segue è il racconto di tre scelte progettuali che non si vedono nei mockup.

## La tesi: flessibilità non è una feature, è un'identità

Prima di aprire Figma abbiamo fatto due workshop con il team Morsy. L'output atteso era un brief chiaro. Quello che è emerso era qualcosa di più radicale: Morsy aveva una value proposition genuinamente differenziante — nessun vincolo contrattuale, nessun ordine minimo, nessun costo fisso — ma ogni touchpoint, dall'interfaccia dell'app al copy di onboarding, comunicava il *meccanismo* del servizio invece della *sensazione* che il servizio voleva dare.

La tesi che abbiamo costruito insieme: la flessibilità di Morsy non è un'offerta commerciale, è un'identità. Un servizio che promette di adattarsi a come lavori tu non può avere un flusso d'acquisto rigido, un onboarding burocratico, un pannello HR che richiede dieci clic per fare una cosa semplice. La UX deve sentire come il brand.

Da qui è disceso tutto il resto.

## Il problema del B2B: chi paga non è chi usa

Il food delivery B2B ha una complessità che il B2C non ha: ci sono sempre almeno due utenti con bisogni diversi e spesso in conflitto.

L'HR manager o il titolare vuole controllo: budget per dipendente, report di spesa mensile, tracciabilità degli ordini per zona, gestione dei profili del team. L'impiegato vuole velocità e libertà: scegliere cosa mangiare, personalizzare il proprio ordine, non sentire il peso burocratico della policy aziendale.

Disegnare per uno a scapito dell'altro non funziona. Un prodotto che soddisfa l'HR ma frustra il dipendente vede adoption bassa e tassi di uso reale bassissimi. Un prodotto che entusiasma il dipendente ma non dà all'azienda i dati di cui ha bisogno non viene rinnovato al secondo mese.

Il mapping dell'esperienza end-to-end — separato per profilo, poi riconciliato in un sistema unico — ha tenuto entrambe le prospettive in testa in parallelo dall'inizio, non come afterthought nella fase di QA.

## Il flusso che non era nel brief

Alcune delle scelte progettuali più significative emergono dalla ricerca, non dal brief iniziale.

Il pannello HR di Morsy — quello che permette all'azienda di creare profili dipendente con ticket di spesa, importare una lista via CSV e scaricare report di spesa per singolo dipendente — non era esplicitamente richiesto. È emerso quando abbiamo mappato il journey del responsabile acquisti: a che punto del processo aveva bisogno di informazioni? Dove stava perdendo tempo? Come avrebbe giustificato la spesa al CFO?

La risposta era: aveva bisogno di un pannello dedicato. Non complicato — ma pensato per il suo flusso, non aggiunto alla fine come feature di secondo livello.

Stessa cosa per il toggle "smart working" nel flusso d'acquisto: uno dei problemi più concreti del cliente-tipo di Morsy è non sapere quanti dipendenti saranno in sede il giorno dell'ordine. Quell'interruttore — apparentemente piccolo — è la risposta di UX a un problema molto reale. Un campo nel form non avrebbe avuto lo stesso peso percettivo.

## Come abbiamo calibrato la direzione visiva

Una fase spesso sottovalutata nei racconti di progetto, ma che ha cambiato il numero di iterazioni: il metodo *Hot or Not*.

Prima di produrre mockup, abbiamo costruito una selezione di riferimenti visivi e li abbiamo mostrati al cliente uno alla volta chiedendo una reazione istintiva — sì o no. Non "ti piace questo stile", ma "questo senti che è Morsy?". Il risultato è un profilo di gusto costruito in modo collaborativo e rapido, senza presentazioni elaborate e senza ambiguità.

Il vantaggio pratico: quando arrivi ai mockup con una direzione già condivisa, le iterazioni diminuiscono perché non stai indovinando. Stai costruendo su un accordo raggiunto prima di investire nel dettaglio.

![Artefatti del processo UX su Morsy: griglia con Roadmap, User-flow, Sitemap, Wireframe, Research e Prototype](/work/morsy/morsy-artefatti-ux.png)

## La lezione che portiamo fuori

In un prodotto B2B, la coerenza tra brand promise e UX promise non è un dettaglio estetico — è un requisito funzionale.

Morsy promette flessibilità. Se il flusso d'acquisto è complicato, se l'onboarding è burocratico, se il pannello HR richiede troppe azioni per fare una cosa semplice — il prodotto nega la promessa che il brand sta facendo. L'utente non lo chiama "dissonanza di brand". Lo chiama semplicemente: "non funziona".

Ogni scelta di architettura e UX su Morsy è stata filtrata da questa domanda: questa soluzione fa *sentire* il prodotto flessibile? Se no, torniamo indietro.

→ [Morsy — il case study](/work/morsy) *(artefatti, deliverable e processo completo)*

---

## Una nota sul presidio editoriale

Parallelamente al lavoro di UX e prodotto — quello descritto sopra, fatto da Pianeta.Studio — Morsy ha avuto un presidio editoriale continuativo su Instagram e LinkedIn: piano editoriale mensile, gestione dei contenuti, partnership con Tony's Chocolonely, format ricorrenti come Weekly Menu e Fusion Best Seller. Quel lavoro è stato curato con la collaborazione di Matteo Cardamone, un professionista esterno. Due scope distinti, un sistema di brand coerente.

---

**Parla con Alba → [info@pianeta.studio](mailto:info@pianeta.studio)**

Vedi anche: [Service · App e prodotti digitali](/services/app-prodotti-digitali) · [Service · Brand positioning](/services/brand-positioning)
