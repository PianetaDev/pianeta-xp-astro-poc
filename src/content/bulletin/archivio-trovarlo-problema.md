---
title: "L'archivio c'è. Trovarlo è il problema."
description: "Quattro sintomi che abbiamo visto ripetersi in fondazioni ed enti con anni di produzione documentale. Il punto non è quanti documenti ci sono — è se li trovi quando servono."
date: 2026-09-22
draft: true
locale: it
tags: ["archivio", "cms", "fondazioni", "ricerca", "documentazione", "terra"]
type: bulletin
authors: ["max"]
readingTime: "4 min"
category: "Osservazioni dal campo"
---

**TLDR.** Ogni organizzazione che accumula documenti per anni arriva a un punto in cui l'archivio è ricco ma inaccessibile. I quattro sintomi che descriviamo qui li abbiamo visti in fondazioni, enti di ricerca e consorzi — in forma quasi identica. Il problema non è che i documenti mancano. È che non si trovano.

---

La prima cosa che ci dice quasi sempre un cliente con un archivio datato non è "abbiamo bisogno di un CMS". È: "il nostro team usa Google per cercare le proprie cose."

È una frase che sembra banale. Non lo è.

Significa che l'interfaccia di ricerca interna — quella che qualcuno ha progettato, mantenuto, pagato per anni — è meno utile di un motore generalista che non conosce il contesto dell'organizzazione. Quando succede questo, l'archivio smette di essere una risorsa e diventa un peso: ci sono i documenti, ma trovarli richiede sapere già dove guardare.

## I quattro sintomi

Nel lavoro con fondazioni ed enti di ricerca abbiamo identificato quattro pattern che si presentano quasi sempre insieme.

**Ricercano su Google.** Il team usa `site:` sul motore di ricerca per trovare i propri documenti. Il CMS interno restituisce risultati irrilevanti o nessun risultato. È il segnale più chiaro che la ricerca interna è rotta — non come bug, ma come architettura.

**I partner rinunciano.** Chi accede dall'esterno — un partner di progetto, un ricercatore esterno, un funzionario di un ente finanziatore — abbandona dopo il secondo tentativo. L'archivio è innavigabile senza una mappa interna che nessuno ha mai scritto. Le informazioni finiscono via email, con tutto quello che implica in termini di versioning e tracciabilità.

**Grant review: una settimana sprecata.** Ogni revisione di progetto UE richiede raccogliere a mano i link ai deliverable — uno per uno, tra bookmark personali e richieste ai colleghi. Lavoro che non produce nulla di nuovo, si ripete ogni ciclo, e occupa persone che dovrebbero fare altro.

**Cercano risposte, non file.** Il giornalista vuole il rapporto sulla fiscalità delle rinnovabili prima del 2020. Il funzionario cerca la posizione dell'ente su un tema. L'archivio dovrebbe rispondere — invece restituisce una lista di file ordinata per data, e la risposta richiede di aprirli tutti uno per uno.

---

I quattro sintomi hanno una radice comune: l'archivio è stato costruito come deposito, non come sistema di accesso. Aggiungere documenti era la priorità; recuperarli in modo intelligente non era nel perimetro del progetto originale. Succede spesso — è il risultato di decisioni prese quando il volume era ancora gestibile.

Il problema è che il volume non rimane gestibile.

## Come abbiamo lavorato su questo

Nell'estate del 2026 abbiamo consegnato una piattaforma documentale per una fondazione per lo sviluppo sostenibile: 33.000+ documenti, 12 settimane di sviluppo tecnico, go-live 16 luglio 2026. L'archivio era ricco e inaccessibile — esattamente per le ragioni descritte sopra.

L'approccio tecnico che abbiamo sviluppato — CMS strutturato, ricerca full-text, layer semantico su PDF — è descritto sulla landing [Terra](/hire/terra). Non lo ripeto qui.

Quello che vale la pena dire è che il problema non si risolve aggiungendo una barra di ricerca al CMS esistente. L'architettura della ricerca deve essere progettata insieme all'architettura del dato — come si struttura un documento, come si etichetta, come si pubblica. Altrimenti la ricerca è buona quanto i metadati, e i metadati sono buoni quanto il processo editoriale che li produce.

È un lavoro sistemico, non un add-on.

---

*Se riconosci uno di questi sintomi nella tua organizzazione, la landing [Terra](/hire/terra) descrive il servizio con i dettagli tecnici e il caso d'uso in produzione.*
