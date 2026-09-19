---
issue: PIA-1441 / PIA-1427 / PIA-1468
compiled: 2026-09-19
author: LENS (058fffd9-e2f9-439f-9429-dea42b1360dc)
version: v2 — approvato da Max (19/09/2026)
scope: Pianeta.Studio (no Pianeta.Green, no Atlas)
fonti: offer-stack-terra.md (COMPASS), audit-personas-sito-2026-09.md, seeds MiroFish (hire_T1T4_v1, xp_pianeta_studio, pianetastudio_posizionamento), HUNTER AGENTS.md, client-brief PIA-1427, casi reali (Susdef, ECLAG, ChildFund, BC3, LP Comunicazione, Latte Creative, Artpay, Morsy, Plenitude/ENI)
vincolo-p3: Marco (P3) e' informato da un consorzio scientifico europeo cliente core — il nome del consorzio NON e' nominabile in nessun output pubblico, outreach, contenuto o case study. Consultare LENS/COMPASS per dettagli.
vincolo-p8: non attivare HUNTER per P8 Corporate senza esplicito ok Max.
---

# Personas Pianeta.Studio — v2

> **Nota metodologica v2**
> Approvato da Max il 19/09/2026. Cio' che Max ha confermato su casi reali e' marcato con [VERIFICATO]. Ipotesi non ancora validate restano [IPOTESI].
> Questo documento e' la fonte authoritative per COMPASS (strategia offerte), HUNTER (targeting), MUSE (brief contenuto).

---

## Contraddizioni risolte (aggiornamento v2)

| # | Contraddizione | Soluzione (Max, 19/09) |
|---|---|---|
| C1 | Core revenue: fondazioni/enti vs agenzie | **Fondazioni/enti = core revenue** [VERIFICATO] (Susdef + consorzio scientifico riservato via Latte Creative). Corporate (Plenitude/ENI) = segmento secondario emergente. |
| C2 | LP Comunicazione e Latte Creative: buyer o partner? | **LP Comunicazione = cliente** [VERIFICATO] (magazine, 48 numeri). **Latte Creative = partner** (lavora i loro clienti con noi). Non buyer per se'. |
| C3 | Elena e Delia: merge o separate? | **LENS decide: separate** (vedi nota inline su P5). Max non ha risposto — decisione rivedibile nella prossima revisione. |
| C4 | PMI digitale senza casi verificati | **P6 confermato** [VERIFICATO] con Artpay + Morsy come casi reali. |
| C5 | Neuromarketing Lab ICP distinto | **P7 Neuromarketing Lab** [IPOTESI] — persona dedicato da sviluppare con Max/CHORUS. |

---

## P1 — Delia: Comunicazione fondazione, archivio invisibile

**Stato:** [VERIFICATO] — caso Susdef confermato come anchor.

- **Chi e':** 38–52 anni, Italia. Responsabile Comunicazione in una fondazione di ricerca scientifica o ambientale, staff 10–50. Budget a progetto (fondi europei, donazioni istituzionali), nessun IT interno stabile.
- **Job-to-be-done:** Rendere trovabile e accessibile il patrimonio documentale della fondazione, in autonomia, senza dipendere da IT esterni.
- **Dolore concreto:** "Il nostro archivio e' un buco nero. Anche noi non troviamo quello che cerchiamo. I giornalisti ci chiedono un paper e passiamo mezz'ora nelle cartelle condivise."
- **Obiezione principale:** "Abbiamo gia' un sito — migrare e' lungo e rischioso. Chi forma il team dopo? Non abbiamo IT dedicato."
- **Cosa la convince:** Case Susdef (fondazione analoga, >33.000 record, 12 settimane, autonomia post-lancio), codice consegnato integralmente, narrativa "prima cercavamo a mano, ora 3 secondi".
- **Dove si informa:** Newsletter settore (ASviS, Assifero), LinkedIn peer tra comunicatori fondazioni, conferenze (Communicate!, Forum della Comunicazione).
- **Momento d'acquisto / trigger:** Budget progettuale disponibile (Q4/Q1), grant con "digitalizzazione archivio", sito datato, cambio CMS imminente.
- **Per gli agenti:**
  - **HUNTER:** Binario B — dossier + mail calda con case Susdef. Trigger: "grant per digitalizzazione ottenuto", "nuovo sito fondazione in uscita", sito >5 anni con barra di ricerca rotta.
  - **HIVE:** non target diretto. Eventuale amplificazione su Bulletin/newsletter Assifero.

### Percorso d'acquisizione

| Fase | Cosa fa Delia | Touchpoint / canale | Chi puo' agire |
|---|---|---|---|
| Scoperta | Legge newsletter o vede storia fondazione analoga che ha risolto il problema archivio | Bulletin Pianeta (storia Susdef), LinkedIn, raccomandazione peer | MUSE (Bulletin), HUNTER (outreach fondazioni) |
| Valutazione | Cerca il case study, guarda Susdef live, chiede all'IT interno se e' fattibile | Case study /work/susdef (in lavorazione), call esplorativa | MUSE (case study), HUNTER (follow-up) |
| Primo acquisto | Discovery call Max -> proposta formale -> iter approvativo CDA -> firma (ciclo 4–12 settimane) | Call, proposta, eventuale demo | Max (call), HUNTER (nurturing) |
| Ritorno / passaparola | Rinnova manutenzione; consiglia Pianeta ad altra fondazione del network | Relazione diretta, eventi settore | MUSE (owned), Max |

**Canali prioritari P1:** MUSE/Bulletin Susdef -> HUNTER Binario B -> MUSE/case study Susdef (sblocca strategia fondazioni).

---

## P2 — Davide: IT fondazione, compliance sopra tutto

**Stato:** [VERIFICATO] — Davide e' il validatore, non l'entry point.

- **Chi e':** 28–45 anni, IT Manager o sviluppatore interno di una fondazione o ente. 1–2 persone, gestiscono infrastruttura VPS/cloud. Decide la stack e il fornitore.
- **Job-to-be-done:** Sistema affidabile, GDPR-compliant, self-hostabile, con codice ispezionabile. Nessuna dipendenza dal fornitore.
- **Dolore concreto:** "I tool AI bellissimi mandano i nostri documenti su server americani. Il SaaS parte con un prezzo e poi scala il doppio l'anno dopo."
- **Cosa lo convince:** Codice consegnato al cliente, server europei, GDPR (con qualifica per layer AI generativo), stack open source (Payload, MeiliSearch, Nuxt), WCAG verificabile.
- **Nota GDPR:** il modulo DocumentAI usa API esterne. "Zero data fuori dalla giurisdizione" vale per il core Terra, non per il layer AI. Non usare claim GDPR onnicomprensiva con Davide senza questa qualifica.
- **Dove si informa:** Hacker News, GitHub, newsletter tech (Changelog, Pragmatic Engineer), community Payload CMS / Nuxt.
- **Per gli agenti:**
  - **HUNTER:** non target diretto — lo raggiungi attraverso Delia quando e' gia' warm.
  - **HIVE:** non rilevante.

### Percorso d'acquisizione

| Fase | Cosa fa Davide | Touchpoint | Chi puo' agire |
|---|---|---|---|
| Scoperta | Viene coinvolto da Delia: "puoi valutare la parte tecnica?" | Interno (Delia) | — |
| Valutazione | Legge sezione tecnica del case study, controlla repo GitHub, fa domande su stack/GDPR | Case study /work/susdef (sezione tecnica), documentazione tecnica | MUSE (case study sezione tecnica) |
| Primo acquisto | Da' parere tecnico favorevole -> firma a Delia | Mediato da Delia | Max (call tecnica su richiesta) |

**Canali prioritari P2:** MUSE/case study Susdef (sezione tecnica) — unico contenuto rilevante.

---

## P3 — Marco: Comm Manager consorzio scientifico europeo

**Stato:** [VERIFICATO] AGGIORNATO v2 — Max conferma: un consorzio scientifico europeo di questa categoria e' cliente core. Il nome del cliente reale NON e' citabile in nessun output pubblico (outreach, contenuti, case study, dossier HUNTER). Vincolo invariato.

> **Vincolo operativo per tutti gli agenti:** il nome specifico del consorzio scientifico europeo cliente che informa questa persona e' RISERVATO. Non nominarlo in outreach, contenuti, case study, dossier HUNTER. La categoria generica (ERIC, ESFRI, rete Horizon) e' citabile; il cliente reale no. Questo limita il percorso d'acquisizione finche' non esiste un case consorzio nominabile alternativo.

- **Chi e':** 35–52 anni, Communication Manager o Head of Communications in un consorzio di ricerca europeo (ERIC, ESFRI, rete H2020/Horizon). Team comm 3–6 persone, 10–40 partner europei. Budget a grant cycle (3–5 anni). Obblighi open access e rendicontazione pubblica.
- **Job-to-be-done:** Sistema unificato per documenti multi-lingua prodotti da decine di partner in decenni, con controllo granulare accessi (embargo), WCAG per fondi UE, raccolta automatica deliverable.
- **Dolore concreto:** "Abbiamo documenti da 30 partner in 15 anni in 6 lingue. Nessun sistema unificato. Ogni grant review raccogliere i deliverable manualmente: una settimana di lavoro."
- **Obiezione principale:** "Privacy e governance dati sono non negoziabili. Un'agenzia italiana piccola puo' garantire compliance europea?"
- **Cosa lo convince:** Server europei, GDPR, embargo granulare (Payload CMS), WCAG 2.1 AA obbligatorio per fondi UE, case Susdef come proof scala.
- **Dove si informa:** LinkedIn (network europeo RnI), mailing list consorzi (GEANT, EOSC), conferenze europee (ICT Proposer Day, EGI Conference).
- **Momento d'acquisto / trigger:** Rinnovo grant cycle, cambio piattaforma, compliance WCAG in scadenza.
- **Per gli agenti:**
  - **HUNTER:** Binario B su ERIC/ESFRI/consorzi Horizon, ma solo con trigger forte. Senza case consorzio nominabile, l'angolo e' debole — usare Susdef come proxy con qualifica.
  - **HIVE:** non rilevante.

### Percorso d'acquisizione

| Fase | Cosa fa Marco | Touchpoint | Chi puo' agire |
|---|---|---|---|
| Scoperta | Vede post su accessibilita' archivi scientifici; o referenziato da peer di altro consorzio | LinkedIn EN, rete peer consorzi europei | HUNTER (outreach ERIC/ESFRI), MUSE (landing governance) |
| Valutazione | Cerca prove GDPR/WCAG/governance, consulta DPO interno | Landing Hub Editoriale, case Susdef come proxy | MUSE |
| Primo acquisto | Discovery call -> proposta -> approvazione comitato -> DPA firmato (ciclo 3–9 mesi) | Call, proposta, documentazione legale | Max |

**Canali prioritari P3:** HUNTER Binario B (dopo case consorzio nominabile) -> MUSE/landing governance/GDPR -> LinkedIn EN.

---

## P4 — Giulia (e LP Comunicazione): Titolare agenzia, partner design on-demand

**Stato:** [VERIFICATO] AGGIORNATO v2 — LP Comunicazione = cliente confermato (magazine, 48 numeri). Latte Creative = partner (non buyer per se'). Giulia e' un buyer reale.

- **Chi e':** 30–45 anni, Italia (Milano, Roma). Titolare o Account Director agenzia comunicazione/PR/eventi/design, 5–30 persone. Clienti corporate, brand, istituzionali. Picchi impossibili da gestire internamente.
- **Job-to-be-done:** Partner esterno affidabile — entra senza friction, produce al livello che lei promette ai propri clienti, rispetta le deadline, esce senza microgestione.
- **Dolore concreto:** "Ho bisogno di qualcuno che capisca il brief alla prima call, produca e consegni puntuale. Ho gia' bruciato due partnership con studi che non tenevano le deadline."
- **Caso reale:** LP Comunicazione — magazine mensile, 48 numeri prodotti con Pianeta. Modello continuativo confermato.
- **Obiezione principale:** "Come faccio a fidarmi? Se il lavoro non e' al livello che prometto ai miei clienti, ci rimetto la reputazione."
- **Cosa la convince:** Portfolio con case editoriali complessi (BC3 Annual Reports, ChildFund World Index), TaaS con ritmo prevedibile (~48h/mese, consegne giovedi'), trasparenza prezzi, strip clienti, referenza da agenzia collega.
- **Dove si informa:** LinkedIn (rete professionale agenzie), Behance/Dribbble, Festival della Comunicazione, IAB/ADC/UNA, passaparola.
- **Momento d'acquisto / trigger:** Vinto cliente nuovo con picco imminente, stagione intensa (pre-Natale, estate eventi), perso collaboratore interno.
- **Per gli agenti:**
  - **HUNTER:** priorita' 1 per HUNTER. Binario B — dossier + mail calda. Trigger: "stiamo crescendo" su LinkedIn, job posting designer, portfolio aggiornato su Behance, vinto cliente nuovo. Cerca agenzie IT 5–30 persone con clienti corporate/brand, non affiliate a grossi network.
  - **HIVE:** creator che parlano di processi agenziali, freelance design, outsourcing creativo. Audience: titolari agenzie e account director.

### Percorso d'acquisizione

| Fase | Cosa fa Giulia | Touchpoint | Chi puo' agire |
|---|---|---|---|
| Scoperta | Vede post LinkedIn su lavoro Pianeta; referenziata da agenzia collega; cerca "team creativo outsourcing" | LinkedIn, passaparola, Behance | HUNTER (outreach), HIVE (creator agenzia) |
| Valutazione | Guarda portfolio, vede strip clienti, legge case study editoriali/complessi | xp.pianeta.studio/hire, case study, LinkedIn | MUSE (portfolio, case study) |
| Primo acquisto | Discovery call Max -> TaaS o progetto in prova | Call, proposta (B2B — fattura) | Max |
| Ritorno | Rinnova TaaS, porta nuovi progetti, referenzia a colleghi titolari | Relazione diretta, rete agenzie | Max |

**Canali prioritari P4:** HUNTER Binario B -> MUSE/case study editoriali (BC3, ChildFund) -> HIVE (creator outsourcing).

---

## P5 — Elena: Coordinatrice impact, report e campagne terzo settore

**Stato:** [IPOTESI] — casi reali ECLAG, ChildFund, BC3 confermati; ruolo attribuito rimane ipotesi.

> **Decisione LENS su C3 (Max non ha risposto):** Elena e Delia rimangono **personas separati**.
> **Motivazione:** job-to-be-done diverso (Elena = report annuale + campagne visive -> TaaS/Sprint; Delia = archivio documentale permanente -> Stack Terra Hub Editoriale), offerta diversa, trigger d'acquisto diverso. Unirle appiattisce due percorsi d'acquisto distinti. **Se Max vuole rivedere questa decisione, puo' farlo nella prossima revisione.**

- **Chi e':** 34–52 anni, Italia. Responsabile Comunicazione, Coordinatrice Progetti o Head of Impact in ONG/fondazione/ente no-profit con produzione annuale di contenuti complessi: report d'impatto, bilancio sociale, campagne. Staff 10–100+. Budget comunicazione EUR 10.000–80.000. Nessun grafico interno stabile.
- **Job-to-be-done:** Produrre un report annuale di qualita' per donatori e stakeholder; o validare una campagna di sensibilizzazione prima di produrla in pieno. Partner che capisca il terzo settore senza doverlo formare.
- **Dolore concreto:** "Ogni anno il report e' il progetto piu' importante e piu' stressante. Non ho un grafico interno. Ho cambiato tre studi negli ultimi cinque anni perche' non capivano il nostro linguaggio."
- **Cosa la convince:** Case ChildFund World Index (dati da 190 paesi), BC3 Annual Reports, ECLAG (campagna europea), TaaS continuativo, Piano Sprint per validazione rapida.
- **Dove si informa:** Newsletter terzo settore (Vita, Altreconomia, CSVnet), LinkedIn ONG/fondazioni, Forum del Terzo Settore, AssiferoForum, ASSIF.
- **Momento d'acquisto / trigger:** Preparazione report annuale (Q3-Q4), bando vinto con deliverable comunicazione, raccolta fondi in avvio.
- **Per gli agenti:**
  - **HUNTER:** Binario B — trigger "report d'impatto pubblicato" (vuole fare meglio l'anno prossimo), "bando vinto con deliverable comunicazione", "job posting comunicazione ONG".
  - **HIVE:** creator impact/sostenibilita' sociale con audience fondazioni/ONG.

### Percorso d'acquisizione

| Fase | Cosa fa Elena | Touchpoint | Chi puo' agire |
|---|---|---|---|
| Scoperta | Vede case ChildFund o ECLAG su LinkedIn; referenziata da collega ONG; cerca "studio design terzo settore report impatto" | LinkedIn, Google, passaparola peer ONG | HUNTER (outbound), HIVE (creator impact), MUSE (Bulletin) |
| Valutazione | Guarda portfolio istituzionale, vede strip WeWorld/ChildFund/ECLAG, verifica se "capiscono il terzo settore" | xp.pianeta.studio/hire, case study | MUSE |
| Primo acquisto | Call Max -> Sprint o TaaS -> iter approvativo interno | Call, proposta (EUR 5.000–30.000 tipico) | Max |
| Ritorno | TaaS annuale report + campagne; referenzia a rete ONG | Relazione diretta | Max |

**Canali prioritari P5:** HUNTER Binario B (trigger report/bando) -> HIVE (creator impact) -> MUSE/Bulletin (storia impatto non generico).

---

## P6 — Marco D. / Valentina: Founder o Head Product PMI digitale (SaaS, fintech, healthtech)

**Stato:** [VERIFICATO] NUOVO v2 — confermato da Max con casi reali Artpay + Morsy.

- **Chi e':** 28–45 anni, Italia. Founder pre-Series A o Head of Product in una PMI digitale (SaaS B2B, fintech, healthtech, edtech). Team 5–30 persone, nessun design/UX interno senior.
- **Casi reali:** Artpay (pagamenti digitali), Morsy (settore/ruolo da qualificare con CHORUS).
- **Job-to-be-done:** Design e comunicazione "investor-ready" — interfaccia prodotto credibile, sito che converte, brand che regge su un deck. Vuole uno studio che capisca il prodotto digitale senza spiegazioni.
- **Dolore concreto:** "Ho un prodotto che funziona ma il sito e il brand sembrano ancora da MVP. Gli investitori guardano la nostra comunicazione e pensano che siamo junior. Non ho un designer senior in-house."
- **Obiezione principale:** "Il vostro portfolio e' pieno di fondazioni e luxury. Avete mai fatto un prodotto SaaS? Capite i flussi di onboarding, la dashboard, le pricing page?"
- **Cosa lo convince:** Artpay/Morsy come proof (quando i case study sono pronti), capacita' TaaS con ritmo agile, prototipo/sprint rapido per vedere la qualita' prima di committarsi.
- **Dove si informa:** LinkedIn (rete founder/product), newsletter prodotto (Lenny's Newsletter, Product Hunt), Slack community startup italiane, eventi VC (Italian Tech Week, Startup Grind Milano).
- **Momento d'acquisto / trigger:** Pre-fundraising, lancio v2 prodotto, cambio branding, nuova verticale da comunicare.
- **Per gli agenti:**
  - **HUNTER:** Binario B — trigger "stiamo raccogliendo un round", "lancio nuova versione", job posting "product designer". Attenzione: senza case study PMI digitale pubblicati, angolo debole — usare Artpay/Morsy come proof appena disponibili.
  - **HIVE:** creator tech/startup/product con audience founder e product manager italiani.

### Percorso d'acquisizione

| Fase | Cosa fa | Touchpoint | Chi puo' agire |
|---|---|---|---|
| Scoperta | LinkedIn o referenza da altro founder; cerca studio con portfolio "digitale" | LinkedIn, passaparola founder, Behance | HUNTER (outreach PMI digitali), HIVE (creator tech) |
| Valutazione | Guarda portfolio (cerca "questo potrebbe sembrare il mio prodotto"), vuole uno sprint/prova | xp.pianeta.studio/hire, case Artpay/Morsy (quando pubblicati) | MUSE (case study PMI digitale) |
| Primo acquisto | Call Max -> Sprint o progetto sito -> eventuale TaaS | Call, proposta (EUR 8.000–40.000) | Max |
| Ritorno | TaaS per aggiornamenti prodotto, nuove funzionalita' | Relazione diretta | Max |

**Canali prioritari P6:** HUNTER Binario B (trigger fundraising/lancio) -> MUSE/case study Artpay+Morsy (da produrre) -> HIVE (creator tech/startup).

---

## P7 — Neuromarketing Lab: ICP proprio (NGO + brand con campagne video/neurali)

**Stato:** [IPOTESI] NUOVO v2 — Max conferma che e' un persona dedicato; profilo da sviluppare con Max e CHORUS.

> Nota: il Neuromarketing Lab e' un'offerta distinta di Pianeta.Studio con ICP proprio che non sovrappone esattamente con P1-P6. Questo persona e' una prima ipotesi da validare con CHORUS (intervista rapida).

- **Chi sarebbe:** Responsabile Marketing o Ricerca in un'organizzazione (NGO/fondazione o brand con campagne video) che vuole misurare la risposta neurologica/emotiva ai propri contenuti prima di investire in produzione piena.
- **Job-to-be-done:** Validare scientificamente l'efficacia comunicativa di un video, una campagna, un messaggio — prima di investire in produzione o media buying.
- **Casi potenziali:** NGO con campagne di sensibilizzazione ad alto impatto emotivo; brand B-Corp/sostenibili con claim da validare; enti pubblici con comunicazione istituzionale.
- **Da sviluppare con Max/CHORUS:**
  - Quali clienti reali ha gia' il Lab?
  - Il buyer e' lo stesso di Elena (NGO) o un profilo distinto?
  - Qual e' il ticket tipico di un progetto Lab?
  - Come si posiziona il Lab rispetto all'offerta Studio?
- **Per gli agenti:** HUNTER non ancora operativo per questo segmento senza ICP preciso.

**Canali prioritari P7:** da definire dopo sviluppo con CHORUS.

---

## P8 — Corporate / Performance: Grafica per brand corporate e performance marketing

**Stato:** [IPOTESI] NUOVO v2 — Max cita Plenitude (gruppo ENI) come segmento emergente.

> **Nota strategica (vincolo):** questo segmento e' molto diverso dall'identita' "Societa' Benefit" e dal posizionamento istituzionale di Pianeta.Studio. **Non attivare HUNTER per P8 senza esplicito ok Max.** La domanda da risolvere: e' un segmento da sviluppare attivamente o un'eccezione da gestire caso per caso?

- **Chi sarebbe:** Marketing Manager o Head of Brand in un corporate/enterprise (grandi gruppi, energy, FMCG) che ha bisogno di materiali grafici di alta qualita' per performance marketing, ADV, eventi, presentazioni C-suite.
- **Caso reale:** Plenitude (gruppo ENI) — grafica per performance marketing.
- **Differenza da Giulia (P4):** Giulia e' titolare agenzia che esternalizza picchi; il persona corporate compra direttamente per se' (cliente finale) e ha budget strutturato.
- **Per gli agenti:** HUNTER non prioritario ora. Segmento richiede relazioni dirette o referenze, non outbound freddo.

**Canali prioritari P8:** relazioni dirette Max -> referenze -> eventualmente HUNTER solo su referral caldo.

---

## Creator AI — Profilo da ricercare (non un persona d'acquisto)

**Risposta Max (19/09):** 1-2 creator sul tema AI. Ricerca delegata a CHORUS/HIVE.

**Profilo-tipo da cercare:**
- Creator italiano (o bilingue IT/EN) che parla di AI applicata a comunicazione, design, content creation o produttivita' creativa
- Audience: comunicatori, designer, marketing manager, fondazioni/PMI — non tecnici
- Non creator generalisti sull'AI — focus su intersezione AI x comunicazione/brand/impatto
- Engagement reale, non follower gonfiati; preferibilmente formati educativi (newsletter, podcast, video tutorial)
- Compatibile con valori Pianeta (no AI purista/tecnicista senza etica; no hype senza sostanza)
- Verticali da esplorare: "AI per content team", "AI nella comunicazione non-profit", "tool AI per designer", "AI e narrativa di impatto"

**Chi agisce:** CHORUS (ricerca rapida, proposta 1-2 nomi), poi HIVE valida compatibilita' GTS.

---

## Mappa canale x persona (v2)

| Canale | P1 Delia | P2 Davide | P3 Marco | P4 Giulia | P5 Elena | P6 PMI | P7 Lab | P8 Corporate |
|---|---|---|---|---|---|---|---|---|
| HUNTER Bin. B | Primario | No | Debole (no case consorzio nominabile) | Priorita' 1 | Primario | Si (dopo case study) | No (ICP da definire) | No (solo referral caldo — ok Max) |
| MUSE / Bulletin | Primario (Susdef) | No | EN governance | No | Primario (impact) | No | No | No |
| MUSE / case study | Susdef | Susdef (tecnica) | Susdef (proxy consorzio) | BC3/ChildFund | ECLAG/ChildFund | Artpay/Morsy (da produrre) | No | No |
| HIVE | No | No | No | Secondario | Secondario | Si (creator tech) | No | No |
| Creator AI | No | No | No | Possibile | Possibile | Possibile | No | No |
| Fisico / conferenze | Communicate!, Assifero | No | ICT Proposer Day, EGI | Festival Comm, IAB | Forum Terzo Settore | ITA Tech Week | No | No |
| Relazioni dirette Max | Secondario | No | Primario (unico canale reale ora) | Secondario | Secondario | Secondario | Primario | Primario |

---

## Note aperte per prossima revisione

1. **Morsy (P6):** settore/ruolo da qualificare — scheda breve da CHORUS.
2. **P7 Neuromarketing Lab:** ICP da sviluppare con Max. Blocca HUNTER per questo segmento.
3. **P8 Corporate:** decisione strategica da Max — segmento attivo o eccezione? Impatta identita' Societa' Benefit.
4. **Creator AI:** nomi reali da ricercare (CHORUS).
5. **Case consorzio nominabile (P3):** senza alternativa al cliente riservato, il percorso d'acquisizione P3 e' strutturalmente debole. Priorita': trovare un consorzio scientifico europeo nominabile da usare come proof.
