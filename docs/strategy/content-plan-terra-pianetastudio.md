---
issue: PIA-1562
compiled: 2026-09-22
author: COMPASS (32e38dee-85cb-456f-a467-9643c88a008e)
status: in_review — da approvare da Max
scope: Piano contenuti Terra/CMS su pianeta.studio
fonti: offer-stack-terra.md, positioning-terra-cms.md, briefs/susdef.md (branch docs/susdef-galaxy-concept-gara-conferma), src/content/work/susdef.md, src/content/bulletin/percorso-susdef.md, src/content/bulletin/susdef-prima-dopo.md, src/content/services/piattaforme-dashboard.md, src/pages/hire/fondazioni.astro
---

# Piano contenuti — Terra su pianeta.studio

> **Scopo**: decidere cosa va scritto, dove vive, in che ordine — prima che MUSE riceva un brief. Non e' contenuto pubblicabile. E' la struttura da cui nascono le issue MUSE.

---

## Decisione 1 — Dove vive il contenuto principale

### Raccomandazione: landing `/hire/terra` nuova + update minimo a `piattaforme-dashboard`

**Proposta**: creare una nuova pagina `/hire/terra` con lo stesso registro ricco di `/hire/fondazioni` — una landing per segmento/offerta, non una scheda catalogo. Parallelamente, aggiornare `piattaforme-dashboard.md` (oggi `draft: true`, stub di 3 paragrafi) con un contenuto minimale ma funzionante che linki al case study Susdef e alla nuova landing `/hire/terra`.

**Perche' non basta espandere `piattaforme-dashboard`**

Il servizio `piattaforme-dashboard` e' un catalogo item sotto "Tecnologia" — register e formato sono quelli di una scheda. Una scheda di catalogo ha job diverso da una landing: serve per la discovery di chi sta navigando il catalogo, non per convertire chi arriva con intenzione. Terra meriti il trattamento `/hire/fondazioni`: storyline per il segmento, proof integrata, CTA attiva. Queste due cose non stanno nello stesso file senza forzare uno dei due formati.

**Come si coordinano le due cose**

- `piattaforme-dashboard.md` diventa `draft: false` con testo slim (3-4 paragrafi) che descrive Terra come piattaforma documentale, linka a `/work/susdef` come prova e a `/hire/terra` per l'offerta completa. Rompe il link rotto che il case study Susdef genera oggi.
- `/hire/terra` e' la vera pagina di vendita: angolo archivio documentale sottoutilizzato → come Terra risolve la trovabilita' → proof Susdef → CTA.

**Slug definitivo**: `/hire/terra` (allineato alla naming convention gia' in uso — `hire` = segmento/offerta, slug EN come da decisione PIA-1387).

**Trade-off dichiarato**: creare una pagina nuova aggiunge un URL da mantenere. Il trade-off e' accettabile perche' il registro delle due pagine (scheda vs. landing) non e' unificabile, e `/hire/fondazioni` e' il precedente gia' stabilito per le landing di segmento.

---

## Decisione 2 — Come si collegano tra loro

### Mappa di link

```
/hire/fondazioni
  └→ /hire/terra  [blocco CTA o menzione contestuale dentro la pagina]
  └→ /work/susdef [proof: "Guarda cosa abbiamo fatto per Fondazione Sviluppo Sostenibile"]

/hire/terra (nuova)
  └→ /work/susdef [proof principale — sezione "La prova"]
  └→ /bulletin/susdef-prima-dopo [link "i numeri" — approfondimento A]

/work/susdef
  └→ /bulletin/percorso-susdef [link "il percorso — metodo e scelte"]
  └→ /bulletin/susdef-prima-dopo [link "i numeri prima e dopo"]

piattaforme-dashboard (catalog)
  └→ /hire/terra [link "scopri l'offerta"]
  └→ /work/susdef [link "case study"]
```

**Logica della sequenza di lettura per Persona A (Delia)**:
Entry point organico o scheda catalogo → `/hire/terra` (capisce cos'e') → `/work/susdef` (vede se stessa in una fondazione analoga) → `/bulletin/percorso-susdef` (legge la storia per intero).

**Logica per Persona B (Davide)**:
`/work/susdef` sezione tecnica → `/hire/terra` sezione stack/compliance → documentazione tecnica (HANDOFF.md, stack) su richiesta.

**Nota su `/hire/fondazioni`**: oggi questa pagina non menziona Terra ne' CMS. Il collegamento piu' leggero e' un blocco "Piattaforma documentale per fondazioni" con link a `/hire/terra` e a `/work/susdef`, inserito come sezione addizionale. Non e' un brief per MUSE — e' un intervento di collegamento che puo' essere minimo (2-3 righe + link).

---

## Decisione 3 — Sequenza di produzione per MUSE

### Tier 1 — Parte subito (non bloccato da PIA-1559)

**T1-A: `/work/susdef` → pubblica il draft esistente**
Il draft in `src/content/work/susdef.md` e' sostanzialmente completo: racconta il progetto, include la sezione tecnica (stack, 33.000 record, WCAG), il FAQ, la CTA. Il case study e' la prova su cui tutto il resto si appoggia — niente landing Terra convincente senza proof pubblicata.

Cosa manca prima della pubblicazione:
- Controllare che il link interno a `/bulletin/percorso-susdef` non punti a un draft — o rimuoverlo temporaneamente se percorso-susdef non e' ancora publicato
- Quote Delia/Raimondo: il draft le omette correttamente, possono essere aggiunte dopo in un secondo commit
- Email di contatto: verificare che non usi `max@pianeta.studio` (regola: solo `info@pianeta.studio` o CTA Alba)
- Angolo "galassia" da integrare (vedi sotto)

Angolo "galassia" per il case study: il concept "fondazione come galassia" (Max, 22/09) — un sistema di entita' e relazioni, non un sito a pagine statiche — e' il frame giusto per `/work/susdef`, non per la landing Terra. Il draft attuale non lo usa esplicitamente: racconta il "cosa" (migrazione, WCAG, autonomia) ma non il "come siamo arrivati alla soluzione" con quel frame. MUSE deve integrarlo nella sezione "Chi cerca, e cosa cerca davvero" o in una sezione dedicata alla conceptual architecture — senza usare il pattern "Non X — Y" (vedi Vincoli sotto).

**T1-B: `piattaforme-dashboard.md` → slim update, toglie il link rotto**
Brief minimo: riscrivere il body (oggi 3 paragrafi generici) per descrivere Terra come piattaforma documentale, inserire link a `/work/susdef` e a `/hire/terra` (anche se `/hire/terra` non e' ancora live, si puo' inserire il link a draft e attivarlo insieme). Toglie `draft: true`. Non e' un contenuto ricco — e' una scheda funzionante.

**T1-C: `/hire/terra` → nuova landing**
Non dipende da PIA-1559 — puo' partire con la proof di Susdef senza le quote. La struttura:
1. Headline: angolo "organizzazione con archivio documentale sottoutilizzato" (dolore, non soluzione)
2. Il problema: il team cerca i propri documenti su Google con site:, i partner rinunciano, ogni revisione UE e' una raccolta manuale di link
3. Come Terra risponde: CMS strutturato + ricerca full-text (MeiliSearch) + modulo DocumentAI (opzionale) + hosting EU — tutto in un'unica soluzione, nessun abbonamento SaaS che scala con il volume
4. Sezione compliance: server EU, codice in licenza d'uso (non proprieta'), framework GDPR verificato su consorzio europeo (anonimizzato — mai nominare EPOS)
5. La prova: Susdef — >33.000 record, 12 settimane, team autonomo dal giorno del lancio
6. CTA: "Parla con Alba" (primaria) + link al case study

**Nota registro**: il brief per MUSE deve specificare che il tono e' quello di `/hire/fondazioni` — diretto, ricco, senza headline astratte. Non e' una pagina prodotto generica, e' una landing di segmento.

### Tier 2 — Bloccato (dipende da PIA-1559 o da T1)

**T2-A: `/bulletin/percorso-susdef` → pubblica quando PIA-1559 e' risolto o quote non necessarie**
Il draft e' completo nel contenuto. Blocchi prima di pubblicare:
- Verificare con Max se le quote di Delia/Raimondo sono necessarie per la pubblicazione o opzionali (come per il case study)
- Integrare il concept "galassia" nella sezione narrativa — e' il frame che manca al draft attuale, che racconta la scelta tecnologica senza il perche' concettuale. MUSE aggiorna la sezione "Lo stack: non la risposta attesa, ma quella giusta" con il concept architetturale
- Fix email: sostituire `max@pianeta.studio` con `info@pianeta.studio` o CTA Alba (riga 62 del draft attuale)
- Aggiornare il link "→ Case study Susdef — in arrivo" con il link reale a `/work/susdef` quando pubblicato

**T2-B: `/bulletin/susdef-prima-dopo` → pubblica quando T1-A e' live**
Il draft e' completo. Dipende solo da avere il case study `/work/susdef` live (a cui linka). Verificare link `cal.com/maxmauro` — coerente con la regola booking o da sostituire con CTA Alba?

**T2-C: 5 angoli bulletin Terra (da PIA-1536) → dopo che T1 e' completo**
I 5 angoli approvati da Max non sono ancora stati scritti. Diventano brief separati per MUSE — ma solo dopo che la landing `/hire/terra` e il case study `/work/susdef` sono live, altrimenti non c'e' a cosa linkare. Sequenza interna da definire in issue separate.

---

## Vincoli non negoziabili — checklist pre-brief MUSE

Prima di passare qualsiasi brief a MUSE, verificare:

### 1. Pattern "Non X — Y" — VIETATO su pianeta.studio
Il pattern e' bannato per questo spoke (Max, 9 maggio 2026 — confermato come regola hard in voice-hub.md). La bozza di riferimento dell'issue aveva 4 istanze di questo pattern ("Non un CMS. Una piattaforma documentale.", "Non tre prodotti — un sistema unico", ecc.) — nessuna va usata nel brief MUSE.

Controllo richiesto: prima di consegnare ogni brief a MUSE, COMPASS verifica che nessun titolo, headline o apertura paragrafo usi la struttura "Non X — Y" o "Non X, ma Y". Se il brief ha placeholder o esempi di copy, questi devono essere conformi.

### 2. Licenza, non proprieta'
Formulazione corretta sempre: "codice consegnato in licenza d'uso, non in proprieta'" — mai "il codice e' tuo". La licenza d'uso copre il progetto specifico del cliente, non la rivendita o la sublicenza a terzi. Questo deve apparire esplicitamente nella landing e nel case study.

### 3. Claim green come roadmap, mai come rating
Non usare "classe energetica", "carbon-neutral", "emissioni zero" o qualsiasi claim di rating green. Formulazione ammessa: "stiamo costruendo la misura dei consumi (server + AI) — nessun competitor SaaS lo fa, nessuno ha ancora quella misura". Se il contenuto non deve toccare il tema green, lo omette — non inventa un claim intermedio.

### 4. Framework compliance anonimizzato
Il framework di compliance verificato su consorzio europeo puo' essere citato come prova — mai nominare EPOS-ERIC. Formulazione: "verificato su un consorzio di ricerca europeo (anonimizzato)".

### 5. DocumentAI e ricerca AI — usabili con qualifica
- MeiliSearch nel core base: ricerca full-text, verificata, usabile senza qualifica
- Modulo DocumentAI (ingestione AI, abstract automatici, ricerca semantica): verificato e live su Susdef — usabile, ma con qualifica che e' un modulo add-on, non incluso nel profilo base di Terra
- Claim GDPR: vale per il core Terra (zero data fuori UE). Per il modulo DocumentAI il layer AI usa API esterne — non usare "zero data fuori dalla giurisdizione" in modo onnicomprensivo quando si parla di DocumentAI. Questo e' critico per Persona B (Davide).

### 6. Angolo "galassia" — solo per case study e percorso-susdef, non per la landing Terra
Il concept "fondazione come galassia / sistema di entita' e relazioni" (Max, 22/09) e' il frame concettuale del progetto Susdef — e' il perche' del design, non una caratteristica della piattaforma Terra. Va nel case study `/work/susdef` e nel bulletin `percorso-susdef`. Non va nella landing `/hire/terra` come messaggio principale — quella parla del dolore dell'archivio e di come Terra lo risolve.

---

## Stato dei draft esistenti — cosa puo' essere pubblicato vs. cosa vuole revisione MUSE

| Contenuto | Stato attuale | Pronto per publish? | Blocco principale |
|---|---|---|---|
| `/work/susdef` | draft: true, contenuto completo | Con revisione angolo galassia + link fix | Integrare galassia, verificare link interno percorso-susdef |
| `/bulletin/percorso-susdef` | draft: true, contenuto completo | Con revisione galassia + fix email | Fix email max→info o CTA Alba; integrare galassia; aspettare o rinunciare a quote |
| `/bulletin/susdef-prima-dopo` | draft: true, contenuto completo | Dopo /work/susdef live | Dipende da T1-A; verifica link cal.com |
| `piattaforme-dashboard` | draft: true, stub generico | Con revisione slim | Brief T1-B |
| `/hire/terra` | Non esiste | Da creare | Brief T1-C |
| 5 angoli bulletin Terra | Non scritti | Da creare | Dopo T1 completo |

---

## Prossimi passi operativi

Dopo approvazione di questo piano da parte di Max:

1. Max conferma se le quote Delia/Raimondo sono prerequisito o opzionali per `/work/susdef` e `/bulletin/percorso-susdef`
2. COMPASS crea 3 issue MUSE in Paperclip:
   - T1-A: revisione e pubblicazione `/work/susdef` (angolo galassia + link fix)
   - T1-B: slim update `piattaforme-dashboard`
   - T1-C: nuova landing `/hire/terra`
3. T2 diventa issue MUSE con dipendenza esplicita da T1-A (per il bulletin) e da PIA-1559 (per le quote)
4. I 5 angoli bulletin restano in backlog fino a T1 completo
