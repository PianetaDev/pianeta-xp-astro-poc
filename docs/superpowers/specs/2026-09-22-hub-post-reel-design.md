# Hub, post e reel — pianeta.studio

Data: 2026-09-22
Stato: approvato da Max, pronto per il piano di implementazione

## Contesto

Il sito pianeta.studio (repo `pianeta-xp`, Astro) ha oggi sei collezioni Markdown (`work`, `bulletin`, `services`, `lab`, `team`, `careers`) e una home bento che mescola automaticamente le tile più recenti di ciascuna. Max vuole introdurre due nuovi tipi di contenuto atomico — **post** (carosello di foto, stile Instagram) e **reel** (video breve, stile short) — riusabili non solo sul sito ma anche su altri media, organizzati in un nuovo hub. La fonte fotografica di partenza è Watchers (repo `bosco-observatory`), le foto dei workshop Bosco Colto.

**Correzione importante fatta durante il brainstorming**: il sito ha già un modulo dormiente ma funzionante per questo esatto scopo, scoperto guardando gli ultimi commit e verificato su Paperclip (issue PIA-1364, PIA-1365, PIA-1369, PIA-1370, tutte `done`) — **non un'ipotesi da ricontrollare, un fatto già verificato in diretta da un altro giro di lavoro**:

- **"Pianeta Media"** (PR #111, 10/9/2026): un archivio fotografico esplorabile per i case study di xp.pianeta.studio, motore Three.js condiviso con Watchers ma estratto come modulo standalone (decisione presa apposta per non duplicare codice tra i due siti, PIA-1364). Vive sullo stesso progetto Supabase di Bosco Colto (`fyflddqouoqtdnilqhms`), ma isolato: tabella `pianeta_media_photos`, bucket `pianeta-media-photos`, **mai** `watchers_photos`/`watchers-photos`.
- Pagina `/explore/media`, componente `MediaCloud.vue` (Astro island `client:only="vue"`), pipeline di ingest `scripts/media-pipeline.mjs` (thumbnail, colore dominante, didascalia AI, embedding, posizionamento KNN).
- Tabella `pianeta_media_usages`: dove ogni foto è usata (`content_type` oggi limitato a `work/bulletin/services/lab/team/careers`, `field` in `cover/inline/og/thumbnail`) — è già il meccanismo di tracciamento riuso che serve per l'atomicità.
- **Già live**: 10 foto reali (le cover di lavori/bulletin/servizi esistenti — Aries, BC3, ChildFund, ECLAG, Untwist, ecc.) ingerite e pubblicate (PIA-1369), con titolo/descrizione del contenuto collegato nel lightbox e permalink `?photo=<id>` (PIA-1364, PIA-1370). Non ancora nessuna foto di Watchers/Bosco Colto.
- **Roadmap annotata nel codice, mai costruita**: "selezione multipla + export come animazione/video (ispirazione spiral.soot.com)" — è esattamente il flusso di curatela post/reel che serve qui.

Decisione presa con Max: **costruire hub sopra Pianeta Media**, non come sistema parallelo. Questo elimina la necessità di uno script CLI di curatela inventato ad hoc: la selezione foto diventa un'interazione visiva dentro l'esploratore già esistente, come Max aveva immaginato fin dall'inizio ("sarà bello selezionare le foto da Watchers per creare content").

## Decisioni prese durante il brainstorming

- I video-reel partono da caricamento manuale di clip vere; in futuro (fase 2) anche da uno slideshow generato automaticamente da una sequenza di foto — la stessa funzione di "export video da selezione multipla" già annotata come roadmap nel motore Three.js, mai implementata.
- I post-carosello sono curati a mano: un umano seleziona le foto, non un'estrazione automatica per workshop/giorno.
- Bulletin non viene assorbito: resta il contenitore per la scrittura lunga (anche fonte per la newsletter). Post e reel sono un livello sotto: contenuto atomico che può stare da solo nell'hub oppure essere incastonato dentro un caso studio o un articolo bulletin.
- `/hub` è una pagina nuova, non la home: griglia cronologica completa di post + reel + casi studio, con filtri per tipo.
- La home non mostra tutto: resta un flusso editoriale stile Esplora di Instagram, che cambia in parte a ogni visita via cookie. È un hub & spoke — `/hub` è il centro con tutto il contenuto, la home è uno spoke editoriale che pesca da lì un sottoinsieme in rotazione. La direzione "flip book" futura è annotata, non progettata qui.
- Il primo lotto di contenuti reali va ingerito da Watchers/Bosco Colto — è il primo compito concreto dell'implementazione, non un esempio teorico (vedi sezione dedicata sotto).

## Architettura: estendere Pianeta Media, non duplicarlo

Le foto che finiscono in un post o in un reel sono righe di `pianeta_media_photos`, non file locali copiati nel repo del sito. Questo risolve anche meglio l'obiettivo di riusabilità su altri media rispetto a una copia statica: la foto ha già didascalia AI, embedding per la ricerca per similarità, e un permalink stabile.

**Estensione dello schema** (nuova migration sopra `20260910000000_pianeta_media.sql`):

```sql
ALTER TABLE pianeta_media_usages DROP CONSTRAINT pianeta_media_usages_content_type_check;
ALTER TABLE pianeta_media_usages ADD CONSTRAINT pianeta_media_usages_content_type_check
  CHECK (content_type IN ('work','bulletin','services','lab','team','careers','posts','reels'));

ALTER TABLE pianeta_media_usages ADD COLUMN IF NOT EXISTS position smallint;
-- ordine di swipe nel carosello quando field='carousel'; NULL per gli altri field (cover/inline/og/thumbnail)

ALTER TABLE pianeta_media_usages DROP CONSTRAINT pianeta_media_usages_field_check;
ALTER TABLE pianeta_media_usages ADD CONSTRAINT pianeta_media_usages_field_check
  CHECK (field IN ('cover','inline','og','thumbnail','carousel'));
```

Un post con N foto = N righe in `pianeta_media_usages` con `content_type='posts'`, `content_slug=<slug del post>`, `field='carousel'`, `position` 0..N-1. Un reel referenzia il video caricato (fuori da `pianeta_media_photos`, che è solo foto) più eventualmente un `photo_id` come poster/copertina con `field='cover'`.

**Collezioni Markdown nuove**, stesso pattern delle esistenti (`glob` loader, variante `.en.md`):

```ts
const postsSchemaExt = baseSchema.extend({
  photoIds: z.array(z.string().uuid()).min(1), // id di pianeta_media_photos, in ordine di swipe
  client: z.string().optional(),                // stessa etichetta libera già usata da "work"; chiave di deduplica in home
});

const reelsSchemaExt = baseSchema.extend({
  video: z.string(),          // path locale del file video (Pianeta Media non gestisce video, solo foto)
  posterPhotoId: z.string().uuid().optional(), // id di pianeta_media_photos come copertina, se disponibile
  client: z.string().optional(),
  durationSec: z.number().optional(),
});
```

Il frontmatter Markdown resta la fonte di verità editoriale (titolo, descrizione, data, bozza, tag, cliente); `pianeta_media_usages` resta la fonte di verità per "quale foto è usata dove", coerente con come funziona già oggi per `work`/`bulletin`.

`work` e `bulletin` guadagnano un campo opzionale per incastonare un post/reel intero (non solo una foto) dentro un contenuto più lungo:

```ts
embeds: z.array(z.object({
  type: z.enum(['post', 'reel']),
  slug: z.string(),
})).optional(),
```

## Curatela: selezione multipla nell'esploratore esistente

Non serve più uno script da riga di comando. Il flusso diventa:

1. **Ingest**: le foto scelte da Watchers si caricano nel bucket `pianeta-media-photos` e si processano con `scripts/media-pipeline.mjs` (già scritto: thumbnail, colore, didascalia AI, embedding, posizionamento). Nota: `media-pipeline.mjs` non legge mai `watchers_photos` direttamente (per design, PIA-1364) — serve un passaggio esplicito di copia dell'originale nel bucket di Pianeta Media prima di lanciare la pipeline, non una sincronizzazione automatica continua.
2. **Selezione**: dentro `/explore/media`, si implementa la funzione già annotata come roadmap nel motore Three.js — selezione multipla di foto nella nuvola, poi un'azione "crea post" che produce un blocco frontmatter pronto (elenco `photoIds` in ordine di selezione + didascalia AI suggerita da `caption`) da incollare in un nuovo file Markdown.
3. **Scrittura**: si crea il file in `src/content/posts/` o `reels/`, si apre una PR come per ogni altro contenuto — nel perimetro di Pianeta.Engineer.

Per i reel in v1 (video caricati a mano, non generati), il passo 2 non si applica: il video si carica come asset e il file Markdown si scrive direttamente.

## Pagine e componenti

- `/hub` — griglia cronologica di post + reel + casi studio, con pillole di filtro per tipo, stesso linguaggio visivo delle tile bento di oggi.
- `/posts/[slug]` e `/reels/[slug]` — pagina propria per ciascun post e reel, stessa convenzione di `/work/[slug]` e `/bulletin/[slug]`, per un link stabile riusabile su altri media.
- Tre componenti: `PostCard.astro` (carosello scroll-snap, risolve `photoIds` in URL via l'API `/api/media/thumb` già esistente), `ReelCard.astro` (video con poster, autoplay muto al passaggio), `WorkCard.astro` estratto dal markup oggi incollato in `index.astro`. Stesso punto di rendering usato sia in `/hub` sia nelle tile della home.
- Nota tecnica per il piano: `media-pipeline.mjs` genera oggi solo un thumbnail a 480px (`THUMB_WIDTH`). Per l'immagine social (`og:image`) di `/posts/[slug]` serve probabilmente una derivata più grande — un'aggiunta piccola alla pipeline esistente, non una riprogettazione, da risolvere in fase di implementazione.

## Home: pool unico e rotazione

Le tile evergreen (logo, "Parla con Alba", "Prenota una call", tile team) restano fisse. Le tile di contenuto (oggi `b0/b1/b2` da `bulletin`, più l'hero caso studio) cambiano sorgente:

1. Pool unico ordinato per data che mescola `bulletin` + `posts` + `reels` + `work` (non-draft).
2. Deduplica per `client`: si scarta un candidato il cui `client` coincide con uno già scelto in questo giro — mai due tile sullo stesso cliente/storia fianco a fianco.
3. Il pool deduplicato passa alla funzione di rotazione già esistente, `pickRotatingHero` (`src/lib/hero-rotation.ts`, oggi usata solo per l'hero caso studio, già generica), estesa a servire anche gli slot `b0/b1/b2`: ogni visita avanza il cookie e mostra una combinazione diversa.

`/hub` non usa questa rotazione: mostra tutto, ordinato cronologicamente, filtrabile dall'utente.

## Primo contenuto reale: migrazione da Watchers

Prima che `/hub` vada online, si esegue almeno un giro di curatela reale sulle foto già pubblicate in `watchers_photos` (workshop Bosco Colto): ingest in `pianeta_media_photos` tramite il passaggio di copia + `media-pipeline.mjs`, poi selezione e creazione di un primo lotto di post (e, se c'è materiale video coerente, reel) genuini. Quanti post e quali workshop coprire è una scelta editoriale di Max/team al momento della curatela, non un vincolo di architettura.

## Fuori scope, rimandato esplicitamente

- Reel generato in automatico da selezione multipla → export video: è la funzione di roadmap già annotata nel motore Three.js, non ancora costruita. Resta fase 2.
- Sincronizzazione automatica continua tra `watchers_photos` e `pianeta_media_photos`: il ponte resta un passaggio manuale/deliberato, non un flusso live.
- Pubblicazione automatica su altri canali (social): questo giro produce l'asset e l'URL canonica riusabile a mano altrove, non un connettore di pubblicazione.
- La direzione "flip book" per la home: annotata come intenzione futura, non progettata qui.

## Verifica

- Le collezioni `posts`/`reels` sono validate da Zod come le altre.
- Un test in `tests/build` verifica che ogni `embeds` dentro un caso studio o un bulletin punti a uno slug esistente e non in bozza.
- Un test verifica che ogni `photoIds`/`posterPhotoId` referenziato in un post/reel esista davvero in `pianeta_media_photos` con `status='published'` (stesso spirito del controllo migration di Apotheke: un riferimento rotto si vede prima del deploy).
- Un test copre la deduplica per `client` nella selezione home.
