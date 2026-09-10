---
issue: PIA-1368
compiled: 2026-09-10
author: COMPASS
status: completato
scope: Review fit buyer-personas — tutto xp.pianeta.studio (escluso materiale gia coperto da PIA-1353/1354)
lente: docs/strategy/personas-pianeta.md (non ancora creato — persona descritte inline nell'issue e ancorate a offer-stack-terra.md)
nota-limite: docs/strategy/personas-pianeta.md non esiste ancora nel repo. Le 3 persona usate in questo audit sono state ricostruite da offer-stack-terra.md sez. 2 e dalle descrizioni inline della issue. Creare il file persona e' un deliverable separato da questa review.
---

# Audit persona-fit — xp.pianeta.studio

## Lente: le 3 persona

Riepilogo operativo (da offer-stack-terra.md §2 e issue PIA-1368):

| ID | Nome | Ruolo | Dolore principale | Obiezione | Cosa convince |
|---|---|---|---|---|---|
| **A** | Delia | Resp. Comunicazione, fondazione di ricerca | "Il nostro archivio e' un buco nero" | Migrazione rischiosa, no IT interno | Vedere Susdef (analoga) che ha migrato 33k record e ora gestisce in autonomia |
| **B** | Davide | IT/Dev, fondazione o ente pubblico | Compliance GDPR, lock-in SaaS, costi scalanti | Self-hosted = gestisco io; se Pianeta sparisce sono bloccato | Codice consegnato, server EU, stack open source, opzione infrastruttura gestita |
| **C** | Marco | Communication Manager, consorzio scientifico UE / ERIC | 30 partner, 15 anni di documenti in 6 lingue, obblighi open access | Privacy e governance dati per agenzia IT piccola? | GDPR, WCAG obbligatorio per fondi UE, embargo granulare, Susdef come proof |

---

## Pagina `/` — Home IT

### Coerente

- Il bento grid funziona da vetrina multi-canale: mostra work (proof per A e C), bulletin (canale primario per A), servizi, team. Non forza una direzione unica.
- La tile "Parla con Alba" e' un gate basso per qualsiasi persona che vuole esplorare senza impegno — coerente con il profilo di A e C (decisori lenti, ciclo lungo).
- La tile "Prenota una call — 30 min · Gratuita" abbassa la friczione anche per C, che prima di impegnarsi istituzionalmente vuole parlare con qualcuno.
- La client wall include fondazioni e centri di ricerca (BC3, ChildFund, ECLAG, ARIES, Susdef, Sant'Egidio, WeWorld) — Persona A li vede e si riconosce nel portfolio.

### Dissonante

**D1 — Client wall mescola codici senza gerarchizzare**

File: `src/pages/index.astro` riga 211–231

La lista Armani · Prada · La Repubblica · Wired · BC3 · ChildFund mescola fashion/media e istituzionale senza separazione. Persona A (fondazione ricerca) o C (consorzio UE) potrebbero non riconoscersi subito tra nomi luxury. Persona C in particolare potrebbe interpretare il mix come "studio generalista", non come "specialisti nel mondo istituzionale".

Nessuna gerarchia visiva: tutti i nomi hanno lo stesso peso. La prova piu' rilevante per A e C (BC3, Susdef, ARIES) e' persa nel rumore.

**D2 — Tile servizio (s0) rotante senza logica di persona**

File: `src/pages/index.astro` riga 160–169

Il servizio in evidenza e' il primo in ordine di data — non il piu' rilevante per la persona che piu' probailmente arriva in home. Non blocca la conversione ma lascia al caso cosa vede un visitatore istituzionale.

**D3 — Nessun percorso segnalato per Persona B (IT/Dev)**

File: `src/pages/index.astro`

B non ha tile, tile-link o segnale che esiste un contenuto per lui. Il Lab ("R&D in corso → Atlas") e' l'unico entry point potenziale, ma il copy non parla a chi valuta stack tecnologico. Persona B che arriva in home non sa dove andare.

### Da verificare con Max

- La tile "Cerchiamo un AI Manager" occupa spazio nel bento grid. Per visitatori istituzionali (A e C) e' irrilevante — e' OK tenerla in home o va spostata?
- La tile wordmark in IT e' un div non cliccabile. In EN invece e' un link a `/en/bulletin/chi-siamo`. Questa asimmetria e' intenzionale? In IT come trovano "chi siamo" Persona A e C?

---

## Pagina `/en` — Home EN

### Coerente

- Strutturalmente identica alla IT: stessi contenuti, stessa logica bento, stesse tile.
- Le traduzioni sono fedeli — niente testi paralleli divergenti.

### Dissonante

**D4 — Tile wordmark EN e' cliccabile, IT no**

File: `src/pages/en/index.astro` riga 58–64 vs `src/pages/index.astro` riga 99–108

In EN la tile wordmark e' un `<a href="/en/bulletin/chi-siamo">` — Persona C (europeo, legge in EN) puo' cliccare per scoprire chi e' Pianeta. In IT la stessa tile e' un `<div>` non interattivo. Persona A (italiano) non ha questo percorso.

Gap strutturale: non esiste una pagina `/studio` (chi-siamo) come pagina stand-alone — la issue la menzionava come da coprire. Il bulletin `chi-siamo.md` esiste, ma e' un articolo editoriale, non una pagina istituzionale.

**D5 — Framing iscrizione Bulletin asimmetrico**

File: `src/pages/index.astro` riga 258–259 (IT) vs `src/pages/en/index.astro` riga 172–174 (EN)

IT: "1-2 al mese. Niente spam." — framing difensivo, centrato sul non-danno.
EN: "1-2 a month. Selectable topics." — framing positivo, centrato sul controllo.

Persona A che considera il Bulletin come canale primario e' meglio servita dal framing EN (controllo sulle preference). La versione IT dovrebbe allinearsi.

**D6 — `/en/processo` non esiste**

Non c'e' una versione EN della pagina `/processo`. Se Persona C (consorzio europeo, legge in EN) vuole capire come si lavora, non c'e' accesso al metodo dalla versione EN del sito. La sezione "Come lavoriamo" su `/en/hire` esiste, ma e' piu' breve.

---

## Pagine `/hire` + `/hire/[offer]`

### Coerente

- La banda proof "Scelti — e vinti in gara — da fondazioni ed enti" (strings.ts riga 75) e' esattamente il segnale che Persona A e C cercano in alto di pagina. Posizionamento corretto.
- Il blocco verticale "Fondazioni, ONG, enti, ricerca?" con link a `/hire/fondazioni` e' un percorso esplicito per A e C — positivo.
- Il blocco verticale "Dal processo alla piattaforma" e' chiaramente separato, non confonde il target istituzionale con quello aziendale/B2B.

### Dissonante

**D7 — Sequenza offerte prima della prova (pattern confermato = PIA-1367)**

File: `src/components/hire/HireLanding.astro` riga 52–66 (offerte) vs riga 68–89 (lavori)

La griglia offerte con prezzi e checkout Stripe appare PRIMA della sezione lavori. Sequenza attuale:
1. Hero
2. Proof band (solo nomi, niente contenuto)
3. **Offerte (prezzi, checkout Stripe)**
4. Lavori (case study in scroll)
5. Verticali fondazioni/piattaforme

Per Persona A, che si convince vedendo prima la prova che Susdef (fondazione analoga) ha fatto un percorso simile, il prezzo arriva prima della fiducia. Questo e' il pattern gia' identificato da Max — PIA-1367 e' la issue aperta per il fix strutturale. Questo audit **conferma** il pattern su /hire e segnala che vale per A e C in modo critico; per B e' meno urgente (valuta prima il metodo, poi il prezzo).

**D8 — `forWho` delle offerte non parla a nessuna persona istituzionale**

File: `src/data/offers.ts`

| Offerta | forWho attuale | Fit con A/C |
|---|---|---|
| Sito Green | "Per brand e PMI green..." | Persona A non e' una PMI, non si riconosce |
| Pianeta Sprint | "Per chi sta per investire su una campagna, un sito o un rebrand..." | Neutro — troppo generico |
| Team as a Service | "Per chi ha bisogno di un team dedicato in modo continuativo." | Potenzialmente rilevante per A (no IT interno), ma non lo dice |
| Progetto su misura | "Per chi ha un progetto definito — sito, brand, campagna o prodotto digitale..." | Nessun segnale istituzionale |

Nessuna delle 4 offerte dice esplicitamente "per fondazioni", "per enti di ricerca", "per consorzi UE". Il messaggio "Scelti da fondazioni ed enti" nella proof band non e' mai tradotto in un'offerta concreta con linguaggio istituzionale.

Nota: la variantB del Sito Green cambia il forWho ma non verso il target istituzionale.

**D9 — "Neuroscienza" ripetuto senza anchor di proof**

File: `src/components/hire/strings.ts` riga 44–49 (methodLead + method steps)

Il termine "neuroscienza" compare in: methodLead, step 02, step 03 (implicito). Per Persona A e C, che provengono da ambienti di ricerca o istituzionali, un claim forte come "neuroscienza" senza anchor immediato a proof (caso studio, pubblicazione, link al Lab) genera scetticismo invece di fiducia.

Persona B (IT/Dev) apprezzerebbe un link tecnico su come funziona il motore di validazione.

**D10 — Testimonials vuoti**

File: `src/components/hire/strings.ts` riga 61 (`testiDraft: 'bozza · in attesa di citazione + foto reali'`)
File: `src/components/hire/HireLanding.astro` riga 167–180

Per Persona A il social proof istituzionale e' il meccanismo principale di convincimento. La sezione testimonials e' marcata come bozza e non contiene citazioni reali. Gap di conversione critico per questo segmento.

**D11 — Tono CTA circolo team non adatto a Persona C**

File: `src/components/hire/strings.ts` riga 54 (`ccBot: 'Nessuna idea e' troppo folle — qui non si giudica.'`)

Per Persona C (responsabile comunicazione di un consorzio europeo che risponde a un grant committee), il tono "nessuna idea e' troppo folle" suona informale e potenzialmente non credibile. Il registro del consorzio e' di governance, non di startup.

---

## Pagina `/hire/fondazioni`

### Coerente

- La headline "Gare e bandi: vi aiutiamo a vincere." e' direttamente nel linguaggio di A e C.
- Il flow 3-step copre anche la rendicontazione ("Eseguiamo e rendicontiamo") — punto chiave per gare UE (Persona C).
- I case study collegati (ECLAG, BC3, ARIES, ChildFund) sono tutti riferimenti del mondo ricerca/NGO.
- La CTA "Inviaci la tua gara — nessun impegno" abbassa correttamente la friczione per la prima interazione.

### Dissonante

**D12 — Nessun bridge a Stack Terra / Susdef**

File: `src/components/hire/strings.ts` (FOUND_STRINGS)

La pagina e' focalizzata esclusivamente su gare-e-bandi. Persona A che arriva qui potrebbe essere anche interessata alla piattaforma documentale (archivio ricercabile) — ma non c'e' nessun link o menzione. Susdef, che e' il caso di proof piu' rilevante per A, non compare in questa pagina. Il bridge "abbiamo vinto la gara Susdef E abbiamo costruito la piattaforma che usano ogni giorno" non esiste.

**D13 — Eyebrow include ONG ma il segmento e' escluso dalla strategia Terra**

File: `src/components/hire/strings.ts` riga 163 (`eyebrow: 'Fondazioni · Enti · Ricerca · ONG'`)

offer-stack-terra.md (2026-08-28): il segmento NGO e' stato escluso come priorita' per Stack Terra. L'eyebrow include "ONG" — il che va bene se si parla di gare-e-bandi (le ONG partecipano a bandi), ma va verificato se crea aspettative che non possiamo soddisfare con l'offerta documentale.

### Da verificare con Max

- Il contenuto di `getShowcase(locale).foundations` (file `src/data/showcase.ts`, non letto) — quali progetti sono elencati come "gare e progetti vinti"? Susdef e' tra questi?
- La pagina fondazioni va arricchita con un riferimento esplicito a Susdef (proof piattaforma) oppure il link alla piattaforma documentale resta solo su `/work/susdef` quando sara' pubblicato?

---

## Pagina `/hire/piattaforme`

### Coerente

- Pagina chiaramente rivolta a un segmento diverso (B2B/B2C aziendale, processi interni). Non confonde con il target istituzionale.
- Il metodo 4 passi (Ricerca → Mappatura dati → Task analysis → Flussi e AI automation) e' concreto e verificabile per Persona B aziendale.

### Dissonante

**D14 — "Segnale" non spiegato**

File: `src/data/offers.ts` riga 248 (PLAT_STRINGS.it.dogfood): "Lo facciamo su noi stessi: la macchina di acquisizione /hire e Segnale, la nostra piattaforma di delivery."

"Segnale" compare senza link, senza spiegazione, senza pagina. Per chiunque arrivi qui da fuori, e' un nome opaco che non porta da nessuna parte.

---

## Pagina `/hire/metodo`

Non e' una pagina — redirect 301 a `/hire/pianeta-sprint`. La issue la listava come da coprire, ma di fatto non esiste come superficie distinta. Il redirect e' funzionante; il metodo vive dentro la pagina Sprint.

---

## Pagine `/services/index`

### Coerente

- 4 categorie di pratica strutturate. La deck "Co-design + AI validation + standard aperti. Niente lock-in." parla al dolore di Persona B (lock-in) e implicitamente a C (standard aperti).
- Il link al processo completo `/processo` in fondo e' coerente come approfondimento.

### Dissonante

**D15 — Nessun entry point visibile per Persona A**

File: `src/pages/services/index.astro`

Persona A che arriva su /services cerca "piattaforma documentale per archivi", "ricerca su documenti", "sito per fondazione". Queste parole non compaiono in nessun header di categoria, nessuna intro. La categoria "Products & Systems" contiene "Web sostenibile (Stack Terra)" e "Piattaforme & dashboard" — le due schede piu' rilevanti per A — ma sono sepolte sotto "Strategic Design Consultancy" e "Visualization & Storytelling" che dominano visivamente come prime voci.

**D16 — Schede servizi molto thin (placeholder)**

Servizi con corpo molto breve (3-4 paragrafi con 1-3 righe ciascuno):
- `piattaforme-dashboard.md` — body totale ~7 righe
- `brand-audit.md` (non letto ma probabile pattern)
- `esg-framework-atlas.md` — body totale ~7 righe

Per Persona B (IT/Dev) che valuta se Pianeta sa costruire piattaforme complesse, "Discovery con utenti chiave + prototipi navigabili + build iterativo. 20-32 settimane." non e' sufficiente. Manca qualsiasi dettaglio tecnico, qualsiasi proof.

Per Persona C (consorzio UE), "ESG framework Atlas" ha 7 righe totali. Non c'e' nessun segnale che il framework e' usato da organizzazioni europee o che rispetta obblighi di rendicontazione UE.

---

## Pagine `/services/[slug]` — Campione letto

### `web-sostenibile.md` — Coerente/Dissonante misto

**Coerente:**
- "Per chi e': B Corp, centri di ricerca, organizzazioni ESG-driven." — Persona A e C si riconoscono immediatamente.
- La leva normativa Direttiva UE 2024/825 EmpCo (sanzionabilita' dei claim non documentati) e' esattamente l'argomento che convince Persona C (consorzio UE con obblighi).
- "Il codice applicativo e' di proprieta' del cliente, consegnato integralmente" — risponde all'obiezione principale di Persona B.

**Dissonante:**
- Nessun link o menzione di Susdef come proof. La scheda servizio web-sostenibile e' la landing naturale per Persona A, ma non dice "una fondazione come la tua lo ha gia' fatto".
- Il titolo "Web sostenibile (Stack Terra)" — la parentesi "Stack Terra" e' interna. Per Persona A, Terra non dice nulla. Il titolo non parla al suo dolore ("il mio archivio e' trovabile?").

### `piattaforme-dashboard.md` — Thin, gap per Persona B

File: `src/content/services/piattaforme-dashboard.md`

Il body e' 3 micro-sezioni da 1-3 righe. Per Persona B (IT/Dev) che vuole valutare competenze tecniche, manca: stack usato, casi, numero di integrazioni gestite, approccio autenticazione enterprise. Il servizio e' descritto ma non dimostrato.

### `esg-framework-atlas.md` — Thin, gap per Persona C

File: `src/content/services/esg-framework-atlas.md`

"Per organizzazioni che pubblicano gia' reporting ESG o si preparano a farlo" — targetting corretto per C. Ma nessun dettaglio su come il framework si rapporta con standard europei (GRI, CSRD, ESRS). Nessun link a un caso reale. Per Persona C che deve portare il framework al proprio grant committee, non c'e' abbastanza.

---

## Pagine `/team` + `/team/[slug]`

### Coerente

- La struttura Core / Satellite / AI di gruppo e' trasparente. Il disclaimer "Niente 'human disguised as AI', niente 'AI disguised as human'" e' un segnale di credibilita' forte per tutte le persona — soprattutto per C che ha governance data come requisito.
- Il deck "Studio nomade, sedi a Milano · Ardea · Sicilia" e' informativo sull'operativita' distribuita.

### Dissonante

**D17 — Pagina team non connette competenze a persona**

File: `src/pages/team/index.astro` riga 23 (index-deck)

"Persone che progettano, programmano, ricercano." e' descrittivo ma non posizionante. Persona A vorrebbe vedere "esperienza con fondazioni di ricerca". Persona C vorrebbe vedere "competenze europee, multilingue". La pagina team non fa il lavoro di connettere chi siamo ai problemi che risolviamo.

**D18 — Schede team member non lette**

Non ho letto `max.md`, `fabrizio.md`, `sara.md`, etc. — verificare se le bio individuali parlano in modo rilevante per le persona o sono solo descrittive di ruolo.

---

## Pagina `/processo`

### Coerente

- "Cinque fasi pensate per ridurre l'incertezza e ridurla insieme" — parla direttamente all'obiezione di Persona A ("migrare e' un progetto lungo, con rischi alti").
- La fase Build menziona "Stack Terra ... oppure il vostro stack se ne avete uno" — rispetta l'autonomia del cliente (importante per Persona B).
- Gli output di ogni fase sono concreti e rendicontabili — linguaggio che convince Persona C abituata a milestone di grant.

### Dissonante

**D19 — Carbon budget nella fase Build (rumore per Persona A)**

File: `src/pages/processo.astro` riga 21

"Carbon e performance budget come vincoli verificabili in CI" e' rilevante per la proposta Web sostenibile ma e' un argomento secondario per Persona A che vuole una piattaforma documentale. Non e' un problema grave, ma per chi arriva su /processo da una scheda servizio piattaforma-documentale, il carbon budget puo' sembrare fuori posto.

**D20 — /processo non raggiungibile da home o da /hire**

Il file `src/pages/processo.astro` esiste e ha contenuto solido. Ma dalla home non c'e' nessun link a /processo. Da /hire la sezione metodo ha il link a /hire/pianeta-sprint, non a /processo. Solo da /services e' raggiungibile in footer. Persona A o C che naviga da home → hire non incontra mai questa pagina.

---

## Versione EN — `/en/hire`, `/en/hire/fondazioni`, `/en/hire/piattaforme`

### Coerente

- Le strings EN sono traduzioni fedeli delle IT per tutte le offerte, il metodo, il processo fondazioni/piattaforme. Niente testi paralleli divergenti sul contenuto.
- La pagina fondazioni EN e' strutturalmente identica alla IT (stessa HireFoundations con locale="en").

### Dissonante

**D21 — Tono "no idea is too wild" per Persona C (consorzio europeo)**

File: `src/components/hire/strings.ts` riga 111 (`ccBot: 'No idea is too wild — no judgment here.'`)

Il registro del circolo-team in EN e' identico all'IT. Per Persona C (Communication Manager di un ERIC o consorzio europeo), questa frase e' inappropriata al contesto decisionale — ci sono grant committee, direttori scientifici, DPO. Il "no judgment here" puo' suonare come mancanza di serioeta' professionale.

**D22 — `/en/processo` non esiste**

La pagina `/processo` esiste solo in IT. Persona C che legge il sito in EN non puo' accedere al metodo dettagliato con le 5 fasi. L'unica versione disponibile e' la sezione "How we work" su `/en/hire` (4 step abbreviati, senza tempi, senza deliverable).

---

## Gap strutturali emersi (non-persona, ma impattano tutte le persona)

| Gap | Impatto |
|---|---|
| Non esiste `/studio` (chi-siamo) come pagina istituzionale stand-alone | A e C cercano "chi e' Pianeta" prima di scrivere. Il bulletin chi-siamo esiste ma non e' una pagina di posizionamento |
| Non esiste `/en/processo` | Persona C (europeo, legge EN) non accede al metodo completo |
| `docs/strategy/personas-pianeta.md` non esiste nel repo | Questo documento ricostruisce le persona da altre fonti; serve un file authoritative per allineare futuro lavoro MUSE e COMPASS |
| Nessun case study `/work/susdef` ancora pubblicato | La prova piu' rilevante per A, B, C (tutte) non e' ancora sul sito. Tutta la strategia fondazioni si regge su questa proof mancante |
| Testimonials sezione e' bozza su `/hire` | Gap di conversion critico per Persona A |

---

## Priorita' di intervento (diagnosi, non prescrizioni di copy)

**Priorita' alta — impatto diretto su A e C:**
- D7 (sequenza offerte prima proof) — gia' PIA-1367 aperta
- D10 (testimonials vuoti) — sblocca solo quando ci sono quote reali
- Gap `/work/susdef` non pubblicato — sblocca tutta la strategia fondazioni (in corso PIA-1302)

**Priorita' media — impattano conversione:**
- D8 (forWho offerte non parla a persona istituzionale) — testo breve, modifica in offers.ts
- D12 (nessun bridge Susdef su /hire/fondazioni) — aggiungere dopo pubblicazione /work/susdef
- D15 (nessun entry point per Persona A su /services) — copy + eventuale riordino categorie
- D20 (/processo non raggiungibile da home/hire) — navigazione

**Priorita' bassa / da verificare con Max:**
- D1 (client wall senza gerarchia) — dipende dalla direzione strategica
- D11 / D21 (tono CTA per Persona C) — scelta stilistica
- D5 (framing iscrizione Bulletin IT vs EN) — fix semplice
- D6 / D22 (/en/processo mancante) — se il target EN e' Persona C, e' medium
- D13 (ONG nell'eyebrow fondazioni) — chiarire scope della pagina

---

## Nota finale — cosa non e' stato coperto

- Schede team individuali (`max.md`, `fabrizio.md`, etc.) — non lette, da verificare
- Contenuto `getShowcase().foundations` — showcase.ts non letto, verificare quali progetti sono nei "wins" della pagina fondazioni
- Versioni EN delle service page (`/en/services/[slug]`) — non lette; probabile che siano traduzioni fedele delle IT ma va confermato
- Pagina `/bandi` — non letta; rilevante per Persona A e C ma fuori scope immediato
- Pagina `/lavoriamo-insieme` / `/en/lavoriamo-insieme` — il form post-CTA; rilevante per A ma non inclusa in questa passata
