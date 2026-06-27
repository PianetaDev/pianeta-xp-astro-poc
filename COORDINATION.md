# COORDINATION — come teniamo sincronizzate sessioni & agenti
> Regole condivise tra le sessioni Claude (Cowork, "alba", "XP dev") e gli agenti Paperclip (CEO, HUNTER, BEACON, Pianeta.Engineer). Leggere PRIMA di toccare codice o dati. v1 · 27 giu 2026.

## 1. Git è la verità del codice
- Ogni workstream lavora su un **proprio branch + PR**. Mai due sessioni sullo stesso branch.
- **`git fetch && git reset --hard origin/main` (o pull) PRIMA di iniziare.** (Il 27/6 un clone è già divergato perché non aggiornato → conflitti. Non ripetiamolo.)
- PR **piccole e frequenti**. `main` = lo stato che tutti vedono.

## 2. Ownership dei repo (anti-collisione)
| Repo | Owner | Note |
|---|---|---|
| `PianetaDev/alba` | sessione **"alba"** | KB, prompt, tools di Alba |
| `PianetaDev/pianeta-xp-astro-poc` | sessione **"XP dev"** + **Pianeta.Engineer** (Paperclip) | sito xp.pianeta.studio, deploy Vercel |
- Una sessione per volta sui **file caldi** dello stesso repo. Se l'Engineer Paperclip deve toccare il sito: pull `main` → branch → PR (così la sessione XP vede e non confligge).

## 3. I dati hanno UNA sola verità (non duplicare)
- **Lead** → Supabase (tabella lead) · dashboard in **`/admin`** del sito. NON creare store di lead alternativi.
- **KB/prompt Alba** → repo `alba`; il sito pulla la KB compilata a build-time. Modificare solo nel repo `alba`.
- **Calendario/booking** → Cal.com + Google Calendar (env su Vercel).

## 4. Board "chi fa cosa"
- **Agenti** → task Paperclip (`PIA-#`) su localhost:3100.
- **Umani/sessioni** → Notion (source of truth) + note nei folder condivisi del Drive quando si passa lavoro (es. `26A12_XpPianeta/TODO_*.md`).

## 5. Sync tra sessioni (limite noto)
La messaggistica diretta tra sessioni Claude è bloccata in modalità non supervisionata. Quindi ci si sincronizza via **git + file condivisi nel Drive + Notion**, non in chat. Chi passa lavoro lascia una nota-file nel folder dell'altro.

## 6. Env & segreti
Le env di produzione stanno su **Vercel** (RESEND, SUPABASE, GOOGLE, ANTHROPIC…). ⚠️ `SLACK_ALBA_WEBHOOK` manca → `route_to_human` non notifica via Slack (il lead resta su Supabase). Da aggiungere.
