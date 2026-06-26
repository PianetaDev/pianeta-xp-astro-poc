---
title: "XP1 — Esperienze digitali a basso impatto"
description: "Programma di ricerca interno: misurare e ridurre l'impronta CO₂ delle interfacce che progettiamo, con metriche pubblicate e codice open."
kind: "Programma R&D"
year: 2026
status: "In corso"
ogImage: "/og/placeholder.svg"
cover: "/og/placeholder.svg"
date: 2026-06-01
locale: it
draft: false
type: lab
tags: ["sustainability", "performance", "carbon-budget", "design-system"]
---

## Cos'è XP1

XP1 è il programma interno di Pianeta.Studio che porta il **carbon budget** dentro il processo di design e sviluppo. Non un manifesto, non una checklist: una metrica vincolante che entra nelle decisioni di layout, di tipografia, di immagini, di librerie JavaScript.

## Perché

Un sito web medio nel 2026 trasferisce 2.6 MB per pagina e emette ~0.6 g CO₂ a visita (Web Almanac 2025). Su un sito enterprise da 1M visite/mese, sono **600 kg CO₂ all'anno solo per servire HTML, JS e immagini**. Il modo più economico di ridurre queste emissioni non è comprare crediti carbon: è progettare in modo che la pagina pesi meno.

## Cosa misuriamo

- **Page weight gzipped** (HTML + CSS + JS critical path)
- **CO₂e per visita** secondo Sustainable Web Design Model v4
- **JavaScript shipped** (KB compressed)
- **Image bytes** per viewport, con verifica WebP/AVIF + lazy
- **Font weight** servito above the fold

## Cosa pubblichiamo

- Dashboard pubblica con i numeri del nostro sito e di quelli dei clienti consenzienti
- Tool **GreenMeter** integrato in CI (in roadmap)
- Articoli e Bulletin con i casi studio reali

## Stato

In rilascio progressivo. Prima dashboard pubblica entro Q3 2026. Il framework è già in uso su tutti i progetti web nuovi dello studio.
