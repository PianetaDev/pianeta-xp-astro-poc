---
title: "Future Seeds — dove vanno e da dove arrivano i semi di una banca genetica"
description: "Due mappe interattive per l'Alliance Bioversity International - CIAT: i paesi che hanno contribuito e ricevuto materiale genetico dal genebank di Palmira, Colombia."
kind: "Data viz"
year: 2026
status: "Live"
cover: "/og/future-seeds.png"
ogImage: "/og/future-seeds.png"
date: 2026-08-27
locale: it
draft: false
type: lab
tags: ["dataviz", "svg", "vue", "genebank", "ciat"]
links:
  client: "https://alliancebioversityciat.org/future-seeds"
  external: "https://future-seeds-staging.vercel.app"
---

## Cos'è

Due data visualization interattive costruite per **Future Seeds**, il genebank dell'Alliance Bioversity International - CIAT a Palmira, Colombia: una mappa mondo con linee che convergono sull'hub, un pallino per paese, click per esplorare quanti campioni (fagioli, manioca, foraggere) quel paese ha dato o ricevuto.

- **[Where our seeds come from](https://future-seeds-staging.vercel.app/come-from)** — i principali paesi contributori del genebank
- **[Where our seeds went](https://future-seeds-staging.vercel.app/went)** — i paesi che hanno ricevuto materiale genetico gratuitamente

Bilingue EN/ES, mobile-first (su mobile: selezione per regione con ricerca), con animazioni sulle linee e sullo zoom della mappa, e uno switcher per passare dall'una all'altra direzione.

## Due link, due scopi

**"Vedi sul sito del cliente"** apre la pagina reale di CIAT ([alliancebioversityciat.org/future-seeds](https://alliancebioversityciat.org/future-seeds)) dove il lavoro è consegnato e live. **"Prototipo in evoluzione"** apre invece il nostro staging (`future-seeds-staging.vercel.app`) — sempre allineato all'ultima versione, dove testiamo i miglioramenti prima di promuoverli sull'URL di produzione (`future-seeds.vercel.app`) che il cliente ha effettivamente incorporato.

## La storia

Il progetto esisteva già dal 2022, integrato via iframe nella pagina ufficiale [alliancebioversityciat.org/future-seeds](https://alliancebioversityciat.org/future-seeds). L'hosting originale è stato dismesso e il codice sorgente perso — recuperato integralmente da uno snapshot Wayback Machine dell'embed live, poi riportato su uno stack moderno (Vite + Vue 3 + TypeScript) mantenendo dati e interazioni originali, con l'aggiunta di una versione mobile mai realizzata prima.
