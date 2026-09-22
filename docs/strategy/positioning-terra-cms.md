---
issue: PIA-1536
compiled: 2026-09-22
author: COMPASS (32e38dee-85cb-456f-a467-9643c88a008e)
status: in_review — da approvare da Max prima di usare come base brief MUSE
scope: Terra (Piattaforma Documentale: CMS + ricerca + AI documentale + hosting) — segmento fondazioni/enti di ricerca/PA con archivi documentali grandi
fonti: offer-stack-terra.md, personas-pianeta.md, briefs/cms-documentale.md, briefs/presentazione-cms-traccia-call.html, conoscenza diretta dei prodotti citati
---

# Ricerca di posizionamento — Terra (Piattaforma Documentale)

> **Scopo**: definire dove si colloca Terra rispetto ai concorrenti prima che MUSE scriva una riga. Non è contenuto pubblicabile — è la mappa che informa il brief.

> **Nota framing (Max, 22/09/2026)**: Terra non è un CMS — è una **piattaforma** (CMS + ricerca + AI documentale + hosting). Posizionarla come "CMS" sottovende. Il brief per MUSE deve riflettere questo: Terra si confronta con i CMS headless ma li supera in categoria, non compete sullo stesso piano.

---

## 1. Mappa competitiva

### 1.1 CMS headless (confronto diretto)

| Prodotto | Modello | Hosting/dati | Ricerca built-in | AI nativa su documenti | Debolezze per il nostro target |
|---|---|---|---|---|---|
| **Contentful** | SaaS (proprietario) | Cloud Contentful (AWS, regione EU disponibile ma a costo) | No — integrazione Algolia separata e a pagamento | No — funzioni AI limitate nei piani enterprise | Pricing che scala con content entries e API calls; US company; nessuna ricerca su archivio documentale; content model lock-in via API proprietaria |
| **Sanity** | SaaS + self-hosted (complesso) | Sanity Cloud (EU region disponibile) | No | No (alcune funzioni AI in beta/enterprise, non per archivi) | Hosting SaaS by default; GROQ query language proprietario; no ricerca semantica; setup self-hosted non banale; pensato per editorial team moderno, non per archivi a scala |
| **Strapi** | Open source (self-hosted o Strapi Cloud) | Self-hosted o Strapi Cloud | No (plugin community) | No | Richiede un dev dedicato per configurare e mantenere; nessuna funzione search/AI di base; non turn-key per fondazioni senza IT; Strapi Cloud = nuovo SaaS con lock-in crescente |
| **Directus** | Open source (self-hosted o Directus Cloud) | Self-hosted o Directus Cloud | No | No | Orientato a dati/API, non a team editoriali; molto tecnico; nessuna funzione search/AI; UX non pensata per comms manager |

**Insight chiave CMS headless**: nessuno dei quattro risolve il problema "archivio documentale trovabile". Sono tutti CMS per gestire contenuto editoriale corrente — non per portare in superficie decenni di documenti già esistenti. Contentful e Sanity sono SaaS con pricing che sale con il volume. Strapi e Directus richiedono IT competente per operarli. Nessuno ha una risposta per il dolore di Delia ("non troviamo più il paper che cerchiamo"). **Terra non è in questa categoria: li include e li supera.**

---

### 1.2 Prodotti di ricerca e AI su documenti

| Prodotto | Modello | Hosting/dati | Capacità AI | Debolezze per il nostro target |
|---|---|---|---|---|
| **Algolia** | SaaS (solo cloud) | Server Algolia (datacenter EU disponibile, dati comunque su Algolia) | Neural Search (AI semantica aggiunta dal 2023) — potente per e-commerce, non nativa per document corpus | Pricing che scala rapidamente per volume: >33.000 record ha un costo mensile reale; US company (Algolia Inc.); nessun CMS incluso — solo il layer di ricerca; DPA disponibile ma i dati sono su Algolia, non sul server del cliente |
| **Elasticsearch / Elastic Cloud** | Open source (self-hosted) + Elastic Cloud (SaaS) | Self-hosted (richiede expertise significativa) o Elastic Cloud su AWS/GCP/Azure (regioni EU disponibili) | ELSER (Elastic Learned Sparse EncodeR) — ricerca semantica senza vettori espliciti; vector search integrato | Self-hosted: complesso da operare, richiede team infrastruttura dedicato; Elastic Cloud: SaaS costoso; nessun CMS incluso; pensato per tecnici, non per team comms; operare un cluster Elasticsearch non è alla portata di fondazioni con 1-2 persone IT |
| **Azure AI Search** (ex Cognitive Search) | SaaS Microsoft su Azure | Azure (EU regions: West Europe, North Europe) | Azure AI integration (OpenAI, Document Intelligence) — forte su ingestione PDF, OCR, semantic ranking | Microsoft/US company; compliance EU complessa anche con datacenter europei; pricing per document count + API calls + unità di ricerca; ecosistema Azure (lock-in di fatto); nessun CMS incluso; richiede sviluppo custom per integrarlo con qualsiasi frontend |
| **OpenSearch** (fork AWS di Elasticsearch) | Open source (self-hosted o OpenSearch Service su AWS) | Self-hosted o AWS | Neural search (modelli embedding integrabili) | AWS-centric; stessa complessità operativa di Elasticsearch; spesso richiede figure specializzate; nessun CMS |

**Insight chiave ricerca/AI**: questi prodotti risolvono la parte "trovabilità" ma non hanno CMS. Un fondazione che li sceglie deve costruire e mantenere separatamente: CMS per l'editoriale, layer di ricerca con le sue APIs, integrazione, DPA separato per ogni layer. Il total cost of ownership è alto e richiede IT dedicato. GDPR è problematico per Algolia (SaaS US) e Azure (anche con EU datacenter, i dati restano in ecosistema Microsoft).

---

### 1.3 Player verticali — archivi documentali per enti pubblici/ricerca europei

| Prodotto | Modello | Target | Debolezze |
|---|---|---|---|
| **DSpace** | Open source | Repository istituzionali universitari, open access accademico | Progettato per repository accademici, non per siti editoriali; UX datata; nessuna AI; richiede IT dedicato e manutenzione server; il team comms non lo usa, lo usa solo IT; non è un CMS editoriale |
| **Omeka / Omeka.net** | Open source (self-hosted o SaaS) | Musei, biblioteche, archivi culturali | Tecnologia datata (PHP/MySQL); nessuna AI; nessuna ricerca semantica; pensato per collezioni statiche, non per produzione editoriale attiva; UX fuori dagli standard 2026 |
| **CKAN** | Open source | PA e governi per open data (dataset strutturati) | Catalogo dati, non archivio documentale narrativo; nessuna AI; non adatto a pubblicazioni scientifiche narrative; richiede IT specializzato |
| **OpenDataSoft** | SaaS | PA française e governi europei (open data portals) | Orientato a dati aperti strutturati (non documenti); SaaS costoso; primariamente per portali governativi, non per fondazioni di ricerca; pricing non pubblico |

**Insight chiave player verticali**: i player verticali europei per archivi (DSpace, Omeka, CKAN) risolvono problemi di enti molto grandi (università, governi) con team IT dedicato. Sono soluzioni tecnicamente valide per la compliance GDPR ma non hanno AI, non hanno UX moderna, non hanno CMS editoriale integrato. Una fondazione di medie dimensioni (staff 10-50) non ha le risorse per gestirli.

---

## 2. Come si raccontano i competitor — analisi del messaging

### Argomenti che usano

| Argomento | Chi lo usa | Note |
|---|---|---|
| "AI-powered" | Tutti (dal 2023) | Applicato a qualsiasi funzione anche marginale — il termine è inflazionato e generico. Nessuno spiega cosa il modello AI fa esattamente sui documenti. |
| "Enterprise-grade" | Contentful, Elasticsearch, Azure | Messaggio diretto a IT enterprise, non a fondazioni. Spesso accompagnato da pricing opaco. |
| "Developer-first" / "Composable" | Sanity, Strapi, Directus | Corretto ma escludente: il team comms non si identifica. Crea l'impressione che "ci vuole un dev per usarlo". |
| "Open source" | Strapi, Directus, Elasticsearch, DSpace | Spesso: il core è open source, ma il servizio gestito è SaaS chiuso. Incoerenza raramente esplicitata. |
| GDPR / sicurezza | Tutti | Generic compliance badge. Pochi specificano dove stanno davvero i dati. |
| Pricing | Quasi tutti: nascosto | "Contatta le vendite" per tutto quello che supera il free tier. I prezzi reali emergono solo in negoziazione. |

### Cosa funziona nel loro messaging

- **Contentful e Sanity**: comunicano la qualità dell'esperienza di authoring (real-time preview, interface moderna, collaborazione). Questo funziona — il team editoriale lo vede come un vantaggio reale.
- **Algolia**: "search as infrastructure" — funziona perché sgombra il campo da complessità, si presenta come API su cui costruire qualsiasi experience. Per chi ha già una piattaforma funzionante, è appealing.
- **Elasticsearch**: il brand "open source scalabile" ha una credibilità reale nelle comunità tech. "Self-hosted" è un argomento che risuona con Davide (P2).

### Cosa è debole o generico

- **Nessuno parla del problema reale delle fondazioni di ricerca**: "abbiamo vent'anni di pubblicazioni e non le trova nessuno". Il messaging dei CMS parla di content management (produzione nuova), non di valorizzazione di archivi esistenti. Il messaging dei tool di ricerca parla di e-commerce search e enterprise search — non di archivi documentali scientifici.
- **GDPR come badge**: quasi nessuno distingue tra "datacenter europeo" (i dati fisicamente in Europa ma comunque in mano al vendor) e "dati interamente sotto controllo del cliente" (self-hosted, codice consegnato). La differenza è cruciale per PA e fondazioni europee — ma nessun competitor la comunica esplicitamente come differenziatore primario.
- **AI generativa vs. full-text search**: i player CMS aggiungono "AI" per marketing senza spiegare cosa fa esattamente. Il cliente non capisce la differenza tra un motore full-text (Algolia base, MeiliSearch) e una ricerca semantica vera (embedding + LLM). Questa vaghezza crea disorientamento nel buyer IT.
- **Pricing scalante nascosto**: Contentful e Algolia in particolare hanno un problema reale con fondazioni che migrano archivi grandi — il pricing per volume di record/API calls è proibitivo. Lo scopri solo in negoziazione.

---

## 3. Mappa di posizionamento

### Assi scelti

- **Asse X — Controllo dei dati e dell'infrastruttura**: da "SaaS chiuso / dati al vendor" (sinistra) a "Self-hosted / codice proprietario del cliente" (destra)
- **Asse Y — Capacità AI nativa su documenti**: da "Assente o solo full-text" (basso) a "AI generativa integrata (ingestione, abstract automatici, ricerca semantica)" (alto)

```
                              AI generativa integrata
                                      |
             Azure AI Search          |          Terra (Pianeta.Studio)
             Algolia NeuralSearch     |          [Piattaforma: CMS + ricerca + AI + hosting EU]
                                      |
- - - - - - - - - - - - - - - - - - -|- - - - - - - - - - - - - - - - - - - -
SaaS chiuso                           |                         Self-hosted/
dati al vendor                        |                         codice al cliente
                                      |
     Contentful                       |          Strapi / Directus
     Sanity                           |          Elasticsearch (self-hosted)
                          Elasticsearch Cloud    DSpace / Omeka
                                      |
                              Solo full-text / nessuna AI
```

### Lettura della mappa

**Terra occupa il quadrante destra-alto: l'unico player** che combina controllo completo dei dati (self-hosted, codice consegnato al cliente, server EU) con AI generativa integrata nativa sul corpus documentale.

- **Quadrante sinistra-alto** (SaaS + AI forte): Azure AI Search e Algolia NeuralSearch hanno AI potente ma i dati sono al vendor (Microsoft / Algolia Inc.). Per fondazioni con obbligo GDPR severo o paper embargati, questo è un blocco non negoziabile.
- **Quadrante sinistra-basso** (SaaS + no AI): Contentful e Sanity sono CMS eccellenti per gestire contenuto nuovo ma non risolvono il problema dell'archivio documentale. Nessuna AI su documenti.
- **Quadrante destra-basso** (self-hosted + no AI): Strapi, Directus, Elasticsearch self-hosted, DSpace, Omeka. Controllo dei dati ok, ma nessuna AI generativa — il documento è cerabile solo per keyword esatte. Il problema "non troviamo il paper" non è risolto.
- **Terra**: auto-hosted EU + codice consegnato al cliente + DocumentAI (ingestione, abstract automatici, ricerca semantica). Non esiste altro player in questo quadrante con un'offerta turn-key per fondazioni di medie dimensioni. La categoria giusta non è "CMS headless" ma "piattaforma documentale integrata": CMS + ricerca + AI + hosting gestito in un'unica soluzione.

### Posizionamento proposto (formulazione interna, non da usare as-is in contenuto)

> Terra è l'unica **piattaforma documentale** — CMS, ricerca, AI documentale e hosting in un'unica soluzione — che unisce controllo pieno del dato (self-hosted, EU, codice consegnato) e AI generativa integrata, senza abbonamenti SaaS che scalano con il volume o dipendenze da ecosistemi US.

---

## 4. Verifica dei tre differenziatori

### D1 — Consumi energetici di Terra (server + AI) — argomento di posizionamento green

**Stato: ROADMAP — usabile come argomento di direzione, non come claim certificata**

**Aggiornamento Max (22/09/2026)**: l'obiettivo non è dichiarare "classe A+" ma **misurare davvero** i consumi del sistema (server + chiamate AI). Max ha aperto un item di roadmap per Pianeta.Engineer in questa direzione. Finché quella misura non esiste, non esiste nemmeno una claim da verificare — c'è un'intenzione di roadmap.

**Come trattarlo nel brief e nel posizionamento**:

- Non usare "classe energetica A+" come dato di fatto — la misura non è ancora disponibile.
- Usare come argomento di posizionamento futuro: "ci stiamo costruendo la misura — nessun altro player nel nostro segmento lo sta facendo". Questo è già un differenziatore di approccio rispetto ai competitor SaaS che non misurano nulla.
- Una volta che la misura esiste (output del roadmap item Engineering), diventa una claim reale e verificabile — e sarà un differenziatore forte: nessun competitor SaaS (Contentful, Algolia, Azure) pubblica dati di consumo energetico per account cliente.

**Nota su PIA-1537**: l'issue era stata aperta per verificare il GreenMeter rating su susdef.pianeta.green. Il contesto è cambiato — il focus non è "ha già un rating?" ma "stiamo costruendo la misura". PIA-1537 va aggiornata di conseguenza.

**Implicazione per il brief**: non dare questa claim come fatto a MUSE. Nel brief, posizionarla come "stiamo costruendo la misura dei consumi — roadmap Q4" — che è già un argomento differenziante rispetto all'assenza totale di dati dei competitor.

---

### D2 — DocumentAI: ingestione AI, abstract automatici, ricerca semantica

**Stato: VERIFICATO — usabile**

Fonti verificate (Max, 2026-09-04, confermato in `offer-stack-terra.md` sezione 1.5):
- Ingestione AI: live su Susdef
- Abstract automatici: live su Susdef
- Ricerca semantica: live su Susdef
- >33.000 record migrati, sito live dal 16 luglio 2026

**Qualifica obbligatoria per contenuti rivolti a Davide (P2)**:
Il layer AI (modulo DocumentAI) usa API esterne (provider non ancora nominato). I documenti o estratti passano da un provider terzo. La claim "zero data fuori dalla giurisdizione" vale per il core Terra (Nuxt + Payload + MeiliSearch), **non** per le funzionalità AI del modulo DocumentAI. Questa qualifica va esplicitata ogni volta che si parla di GDPR + AI.

---

### D3 — "Search AI già integrato"

**Stato: VERIFICATO con qualifica — usabile con precisione**

La ricerca AI semantica è live su Susdef (stesso riferimento di D2). Verificato.

**Qualifica critica — non confondere i due layer**:

Terra ha due layer di ricerca distinti:
- **MeiliSearch** (nel core base di Terra): ricerca full-text veloce e ordinata per rilevanza. Non è AI generativa. È un motore di ricerca ad alte prestazioni. Disponibile anche senza il modulo DocumentAI.
- **DocumentAI** (modulo add-on): ricerca semantica — cioè ricerca per significato, non solo per parole chiave esatte. Usa API esterne. Richiede il modulo, non è nel profilo base.

Comunicare "Search AI integrato" senza questa distinzione crea aspettative errate. Il cliente che acquista Terra base (senza DocumentAI) ottiene MeiliSearch — potente, ma non AI semantica. Il MUSE brief deve riflettere questa distinzione nel copy: "ricerca full-text nel core, ricerca semantica AI con il modulo DocumentAI".

---

## 5. Gap aperti che bloccano la claim green (richiesta di conferma)

| Gap | Azione richiesta | Owner | Blocca |
|---|---|---|---|
| Misura consumi energetici Terra (server + AI) | Roadmap item aperto da Max per Pianeta.Engineer — quando la misura esiste diventa claim. Finché non esiste: argomento roadmap, non fatto. | Pianeta.Engineer | Claim D1 come dato di fatto — non blocca il posizionamento come argomento di direzione |
| Aggiornare PIA-1537 | Il focus dell'issue era GreenMeter rating — ora il contesto è "costruire la misura". Aggiornare o chiudere l'issue con il nuovo framing. | COMPASS / Max | PIA-1537 (scope cambiato) |
| Provider AI per modulo DocumentAI | Se serve per DPA/contratto cliente, nominare il provider. Non urgente per brief contenuto base. | Max | Non blocca il brief, ma blocca il DPA per P2/P3 |

---

## 6. Implicazioni strategiche per il brief MUSE

Questi sono gli input che il brief dovrà riflettere — non è il brief, è la base:

1. **Angolo principale**: non "un CMS migliore" ma "l'unica piattaforma documentale — CMS + ricerca + AI + hosting — che rende trovabile un archivio esistente senza cedere il controllo del dato". Il framing "CMS" sottovende: Terra non compete con Contentful e Sanity, li include e risolve un problema che quelli non toccano.

2. **Il differenziatore contro i competitor SaaS** (Contentful, Algolia, Azure): "il loro pricing scala con il tuo volume — più cresci, più paghi. Terra è una build: paghi una volta, il codice è tuo."

3. **Il differenziatore contro i competitor open source non-AI** (DSpace, Omeka, Elasticsearch): "self-hosting e open source non bastano se l'AI non c'è. I documenti restano ricercabili solo per parola esatta."

4. **Argomento green**: non usare come claim di fatto. Usare come argomento di posizionamento roadmap: "stiamo costruendo la misura dei consumi (server + AI) — nessun competitor SaaS lo fa". Quando la misura dell'Engineering esiste, diventa un differenziatore reale e verificabile.

5. **Qualifica GDPR**: sempre distinguere core Terra (zero data fuori EU) da modulo DocumentAI (API esterne). Questa distinzione è un segno di credibilità con Davide (P2), non una debolezza — dimostra che conosciamo il prodotto meglio di chi fa promesse generiche.
