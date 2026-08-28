---
status: DEPRECATO — DocumentAI è un modulo di Terra, non un prodotto autonomo (PIA-1309, 2026-08-28)
deprecato: 2026-08-28
sostituito-da: offer-stack-terra.md#15-modulo-documentai--add-on-di-terra
author: COMPASS
---

# DocumentAI — documento deprecato

> **Questo documento è stato deprecato con PIA-1309 (2026-08-28).**
>
> La strategia di DocumentAI vive ora nella **sezione 1.5 di [`offer-stack-terra.md`](./offer-stack-terra.md)**.
>
> Non aggiornare questo file. Tutte le modifiche vanno su `offer-stack-terra.md`.

---

## Perché è stato deprecato

La conclusione precedente ("nessun cliente verificato, documento sospeso") era sbagliata. **Susdef usa DocumentAI** — ingestione AI, abstract automatici, ricerca semantica sui documenti — in produzione su https://susdef.pianeta.green dal 16 luglio 2026.

La correzione strategica più importante: DocumentAI non deve essere posizionato come prodotto a sé stante. Max (PIA-1309): "dobbiamo venderlo tra i moduli di Terra". Di conseguenza la strategia DocumentAI è stata integrata in `offer-stack-terra.md` come sezione 1.5.

## Nota sullo stack tecnico

Il Piano R&D citava "WordPress Multisite + API enterprise" per DocumentAI. Questo non corrisponde allo stack reale di Susdef (Nuxt+Payload+MeiliSearch). La descrizione WP Multisite nel Piano R&D è probabilmente riferita a un'implementazione precedente o a un'ipotesi generica — non vincolante. Il caso reale (Susdef, Nuxt+Payload+MeiliSearch+DocumentAI) prevale su qualsiasi descrizione tecnica del Piano R&D.
