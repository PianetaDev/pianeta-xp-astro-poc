# Pagina CV lunga — /team/max

## Contesto

`/team/max` (IT+EN) oggi è una bio breve (2 paragrafi, ~250 parole), zero storico progetti. Max vuole una pagina CV lunga, facile da trovare online, che copra l'intera attività — dal CV PDF fornito (60+ progetti, 2009-oggi) e dal materiale del suo studio precedente MMXX (mmxx.studio/projects, attivo prima di Pianeta.Studio, contenuti oggi assenti dal sito Pianeta — "non compaiono nell'hub").

Questo è il primo di tre filoni collegati ma distinti, deciso con Max il 14/9:
1. **Questa spec** — pagina CV lunga
2. Archivio lavori a due livelli su `/work` (portfolio curato + archivio bassa visibilità, pattern `mmxx.studio/projects`: tabella Nome/Tipo/Anno, link "VIEW" solo se c'è contenuto dietro) — non ancora brief-ato, spec separata
3. Articolo su Wired/SPD Awards/David Moretti (direttore creativo Wired) — non ancora brief-ato, spec separata

## Decisioni prese

- **Collocazione**: espande `/team/max.md` e `/team/max.en.md` sul posto — stessa URL, stesso file, non una pagina CV separata.
- **Lingua**: IT+EN, come tutte le altre pagine team.
- **Formato**: narrativa a tappe + tabella completa in fondo (non solo narrativa, non solo tabella). La bio attuale resta come apertura, poi si aggiunge una progressione cronologica raccontata per tappe, poi una tabella con l'elenco completo dei progetti (come la sezione "Projects List" del CV PDF).
- **Fonti**: CV PDF (`Massimiliano Mauro CV.pdf`, fornito da Max — Work Experience, Education, Projects List ~60 righe) + `mmxx.studio/projects/` (progetti dello studio MMXX pre-Pianeta.Studio, es. Vuem, Jameson GREENer PASSport, Kiwi, Jo Diaries from future, Connected Cities 2019, Hops Beerstrò Trieste — e altri eventualmente presenti sulla pagina). I testi di mmxx.studio vanno **riscritti**, non copiati — Max l'ha chiesto esplicitamente ("rivedi però i testi").
- **David Moretti**: confermato come direttore creativo di Wired durante il periodo Ipad Designer/Data Curator/Art Director di Max (2012-2016). In questa pagina compare come riferimento nel capitolo Wired, senza anticipare l'articolo dedicato (filone 3) — un cenno, non il racconto completo.

## Struttura della pagina

1. **Apertura** — bio attuale (Founder Pianeta.Studio, Società Benefit, planet-centric design), sostanzialmente invariata.
2. **Racconto a tappe**, cronologico, con sezioni riconoscibili:
   - Formazione e esordio (La Sapienza, Italo Lupi Studio 2011, Scuola Politecnica di Design)
   - Wired (2012-2016) — Ipad Designer/Data Curator/Art Director, David Moretti come direttore creativo, i 5 SPD Awards (silver medal Best App General 2012 + 4x Best Infographics 2013-2016)
   - Insegnamento (IED Milano/Torino, Scuola Politecnica di Design, Polimi) — parallelo, non sequenziale, va integrato senza spezzare la cronologia principale
   - MMXX (2016-2023) — studio proprio, progetti selezionati da mmxx.studio riscritti (non tutti, una selezione narrativa)
   - Pianeta.Studio (2023-oggi) — già coperto dalla bio attuale, si collega qui
3. **Tabella progetti completa** — tutti i progetti del CV PDF (nome, tipo, anno) + eventuali progetti MMXX non già coperti nella narrativa, stesso principio di `mmxx.studio/projects`: nessun link se non c'è contenuto dietro (quasi tutti non lo avranno, essendo una lista storica).

## Cosa NON è in scope qui

- L'archivio lavori a due livelli su `/work` — feature separata del sito, non di questa pagina personale (deciso esplicitamente: "due cose separate").
- L'articolo Wired/SPD/David Moretti — pezzo editoriale a sé, non scritto qui.
- Non si tocca la struttura dati esistente di `src/content/team/*.md` (schema frontmatter) a meno che la tabella progetti non richieda un nuovo campo — da verificare in fase di implementazione, non deciso qui.

## Verifica

Nessun codice da verificare in questa fase — è una decisione di contenuto/struttura. In fase di implementazione: `pnpm build` pulito, pagina IT+EN renderizza, tabella progetti leggibile, nessun link rotto verso contenuti inesistenti.
