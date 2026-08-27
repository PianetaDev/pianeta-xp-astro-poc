---
title: "Future Seeds — where a genebank's seeds go and come from"
description: "Two interactive maps for the Alliance Bioversity International - CIAT: the countries that contributed to and received genetic material from the Palmira, Colombia genebank."
kind: "Data viz"
year: 2026
status: "Live"
cover: "/og/placeholder.svg"
ogImage: "/og/placeholder.svg"
date: 2026-08-27
locale: en
draft: false
type: lab
tags: ["dataviz", "svg", "vue", "genebank", "ciat"]
links:
  external: "https://future-seeds.vercel.app"
---

## What it is

Two interactive data visualizations built for **Future Seeds**, the Alliance Bioversity International - CIAT genebank in Palmira, Colombia: a world map with lines converging on the hub, one dot per country, click to explore how many samples (beans, cassava, forages) that country gave or received.

- **[Where our seeds come from](https://future-seeds.vercel.app/come-from)** — the top countries that contributed to the genebank
- **[Where our seeds went](https://future-seeds.vercel.app/went)** — the countries that received genetic material free of charge

Bilingual EN/ES, responsive (mobile version uses a dropdown selector instead of hovering dots).

## The story

The project already existed since 2022, embedded via iframe on the official [alliancebioversityciat.org/future-seeds](https://alliancebioversityciat.org/future-seeds) page. The original hosting was decommissioned and the source code lost — fully recovered from a Wayback Machine snapshot of the live embed, then ported to a modern stack (Vite + Vue 3 + TypeScript) preserving the original data and interactions, plus a mobile version that was never built the first time around.
