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
  external: "https://future-seeds.vercel.app"
---

## Cos'è

Due data visualization interattive costruite per **Future Seeds**, il genebank dell'Alliance Bioversity International - CIAT a Palmira, Colombia: una mappa mondo con linee che convergono sull'hub, un pallino per paese, click per esplorare quanti campioni (fagioli, manioca, foraggere) quel paese ha dato o ricevuto.

- **[Where our seeds come from](https://future-seeds.vercel.app/come-from)** — i principali paesi contributori del genebank
- **[Where our seeds went](https://future-seeds.vercel.app/went)** — i paesi che hanno ricevuto materiale genetico gratuitamente

Bilingue EN/ES, responsive (versione mobile a selezione da dropdown invece di hover sui pallini).

## La storia

Il progetto esisteva già dal 2022, integrato via iframe nella pagina ufficiale [alliancebioversityciat.org/future-seeds](https://alliancebioversityciat.org/future-seeds). L'hosting originale è stato dismesso e il codice sorgente perso — recuperato integralmente da uno snapshot Wayback Machine dell'embed live, poi riportato su uno stack moderno (Vite + Vue 3 + TypeScript) mantenendo dati e interazioni originali, con l'aggiunta di una versione mobile mai realizzata prima.
