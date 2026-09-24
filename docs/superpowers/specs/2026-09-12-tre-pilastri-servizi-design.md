# Semplificazione servizi — 3 pilastri (Creatività · Design · Tecnologia)

## Contesto

L'audit fit-persona [PIA-1368](https://github.com/PianetaDev/pianeta-xp-astro-poc/pull/115) (COMPASS, 2026-09-10) ha confermato un problema strutturale, non solo di tono: offerte e metodo sono frammentati.

- Le 4 offerte `/hire` hanno un `forWho` generico, nessuna parla in modo distintivo a un target istituzionale (finding D8).
- Le 4 categorie di `/services` (strategic-design-consultancy, visualization-storytelling, products-systems, data-ai) contengono schede molto diverse per maturità — alcune solide, altre vere bozze da ~7 righe (finding D16: `piattaforme-dashboard`, `esg-framework-atlas`).
- "Come lavoriamo" è raccontato in 3 posti diversi e scollegati (`/processo`, la sezione "How we work" di `/hire`, il metodo a 4 passi di `/hire/piattaforme`), nessuno linkato dalla home, nessuno canonico (finding D20, D22).

Max ha deciso di affrontare la semplificazione in più giri, partendo dalla tassonomia servizi.

## Decisione 1 — Due schede in hold (già eseguita)

`esg-framework-atlas` e `piattaforme-dashboard` (IT+EN) marcate `draft: true` — escluse da liste/nav/sitemap, noindex. PR [#121](https://github.com/PianetaDev/pianeta-xp-astro-poc/pull/121), mergiata. Restano nel filesystem, pronte per essere riscritte con contenuto reale prima di tornare `draft: false`.

`/hire/metodo` non richiede azione: non è una pagina di contenuto, solo un redirect 301 verso `/hire/pianeta-sprint`. Va ripuntato quando esisterà una vera pagina "metodo" (fuori scope di questo giro).

## Decisione 2 — 3 pilastri paralleli sostituiscono le 4 categorie di `/services`

Non un flusso sequenziale (idea → forma → esecuzione), ma 3 caselle equivalenti: **Creatività**, **Design**, **Tecnologia**.

Questo sovrascrive la claim attuale nello schema.org di pianeta-xp ("Design & Technology, una sola disciplina") — scelta consapevole, non un refactor conservativo. La claim andrà aggiornata in un giro successivo (fuori scope qui: tocca un repo diverso, `pianeta-xp`).

**Scope esplicito di questa decisione**: solo la tassonomia di `/services` (il campo `category` in `src/content/services/*.md` + `src/content/content.config.ts`). Le 4 offerte di `/hire` (Sito Green, Pianeta Sprint, Team as a Service, Progetto su misura) **non** vengono toccate in questo giro — restano con la loro struttura attuale.

### Mappatura dei 16 servizi esistenti

| Pilastro | Servizi | Note |
|---|---|---|
| **Creatività** (6) | brand-audit, brand-positioning, brand-vision-strategy, pianeta-centric-design-strategy, ai-validation-swarm, neuromarketing-lab | I due ultimi sono placeholder di comodo — vedi "AI, fuori scope" sotto |
| **Design** (5) | brand-identity-rebranding, editorial-educational-design, illustrazione-infografica, microsites-data-stories, design-system-multi-brand | — |
| **Tecnologia** (4 live + 2 in hold) | app-prodotti-digitali, web-sostenibile, greenmeter-audit-co2 + (piattaforme-dashboard, esg-framework-atlas quando riscritte) | — |

Distribuzione non perfettamente equilibrata (6/5/3) — accettata come punto di partenza, non un vincolo di design.

### Casi di confine risolti

- **brand-audit** → Creatività (diagnosi/strategia, non produzione visiva).
- **greenmeter-audit-co2** → Tecnologia (è uno strumento di misurazione, non una scelta valoriale da collocare altrove).

### AI — esplicitamente fuori scope

`ai-validation-swarm` e `neuromarketing-lab` restano in Creatività come placeholder. Il posizionamento dell'offerta AI di Pianeta merita un giro di brainstorming dedicato (non deciso qui): potrebbe diventare un quarto pilastro, restare sparso nei 3 esistenti, o altro. Nessuna implementazione dovrebbe trattare questa collocazione come definitiva.

## Cosa NON è deciso in questo giro (da affrontare nei prossimi)

- Nome esatto delle 3 categorie nel codice (valori enum in `content.config.ts` — oggi sono slug inglesi kebab-case tipo `strategic-design-consultancy`; da decidere se i nuovi slug sono `creativita`/`design`/`tecnologia` o equivalenti EN)
- Copy di intro/header per ciascuna delle 3 categorie su `/services`
- Se e come questa tassonomia si riflette su `/hire` (le 4 offerte restano fuori scope per ora, per scelta esplicita)
- Unificazione delle 3 narrazioni di "come lavoriamo" (`/processo`, sezione hire, metodo piattaforme) in una sola pagina canonica — tema distinto, solo menzionato nell'audit, non ancora affrontato
- Versioni EN delle etichette pilastro
- Aggiornamento della claim schema.org "Design & Technology, una sola disciplina" su `pianeta-xp` (repo diverso)

## Verifica

Nessun codice da verificare in questo giro — è una decisione di tassonomia/contenuto, non un'implementazione. La verifica arriva nel prossimo piano, quando si tradurrà questa mappatura in un cambio reale al campo `category` e alla UI di `/services`.
