---
title: "Future Seeds — where a genebank's seeds go and come from"
description: "Two interactive maps for the Alliance Bioversity International - CIAT: the countries that contributed to and received genetic material from the Palmira, Colombia genebank. This link is the prototype's staging build."
kind: "Data viz"
year: 2026
status: "In development"
cover: "/og/future-seeds.png"
ogImage: "/og/future-seeds.png"
date: 2026-08-27
locale: en
draft: false
type: lab
tags: ["dataviz", "svg", "vue", "genebank", "ciat"]
links:
  external: "https://future-seeds-staging.vercel.app"
---

## What it is

Two interactive data visualizations built for **Future Seeds**, the Alliance Bioversity International - CIAT genebank in Palmira, Colombia: a world map with lines converging on the hub, one dot per country, click to explore how many samples (beans, cassava, forages) that country gave or received.

- **[Where our seeds come from](https://future-seeds-staging.vercel.app/come-from)** — the top countries that contributed to the genebank
- **[Where our seeds went](https://future-seeds-staging.vercel.app/went)** — the countries that received genetic material free of charge

Bilingual EN/ES, mobile-first (region picker with search on mobile, replacing the old dropdown), with line-draw and map-zoom animations.

## This link is staging, not production

The button above opens `future-seeds-staging.vercel.app` — a separate Vercel project that always tracks the latest build but is **not** wired into the iframes CIAT already has on their site. It's where we (and anyone on the team) can see and test new versions of the prototype before promoting them to production. The production URL — the one the client actually uses — is `future-seeds.vercel.app`, only updated once a change has been verified here.

## The story

The project already existed since 2022, embedded via iframe on the official [alliancebioversityciat.org/future-seeds](https://alliancebioversityciat.org/future-seeds) page. The original hosting was decommissioned and the source code lost — fully recovered from a Wayback Machine snapshot of the live embed, then ported to a modern stack (Vite + Vue 3 + TypeScript) preserving the original data and interactions, plus a mobile version that was never built the first time around.
