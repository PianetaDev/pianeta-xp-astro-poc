# Alba — setup Google Calendar (one-time, ~15 min)

Step-by-step per autorizzare Alba a creare eventi direttamente sul Google Calendar di Pianeta.

## 1) Google Cloud project

- Vai su https://console.cloud.google.com
- Se non hai un project Pianeta: crea "Pianeta Alba" (nome arbitrario)
- Seleziona il project

## 2) Abilita Google Calendar API

- Nella search bar in alto: "Google Calendar API" → Enable

## 3) OAuth consent screen

- Menu sinistro → APIs & Services → OAuth consent screen
- User type: **Internal** se hai Google Workspace su pianeta.studio (consigliato), altrimenti **External**
- App name: `Alba — Pianeta.Studio`
- User support email: info@pianeta.studio
- Developer contact email: info@pianeta.studio
- Salva
- Scopes (se External): aggiungi `https://www.googleapis.com/auth/calendar.events`
- Test users (se External): aggiungi info@pianeta.studio

## 4) Crea OAuth Client ID

- APIs & Services → Credentials → Create credentials → OAuth client ID
- Application type: **Web application**
- Name: `Alba`
- Authorized redirect URIs: aggiungi **esattamente**:
  - `https://xp.pianeta.studio/api/oauth/google/callback`
  - (opzionale per dev) `http://localhost:4321/api/oauth/google/callback`
- Create
- **Copia** `Client ID` e `Client secret` che ti mostra (li perdi se chiudi)

## 5) Setta env su Vercel

Vai sul project Vercel `pianeta-studio-hub` → Settings → Environment Variables. Aggiungi 4 secret per `Production`:

```
GOOGLE_CLIENT_ID            = <quello del passo 4>
GOOGLE_CLIENT_SECRET        = <quello del passo 4>
GOOGLE_OAUTH_REDIRECT_URI   = https://xp.pianeta.studio/api/oauth/google/callback
ALBA_CALENDAR_OWNER_EMAIL   = info@pianeta.studio
```

Salva. Vercel ridepoya automaticamente.

## 6) Autorizza Alba (one-time)

Apri il browser autenticato come `info@pianeta.studio` e vai a:

```
https://xp.pianeta.studio/api/oauth/google/start?key=<NARRATOR_SECRET>
```

Sostituisci `<NARRATOR_SECRET>` con il valore del secret Vercel `NARRATOR_SECRET` (lo conosci tu).

- Ti reindirizza al consent screen Google
- Login con `info@pianeta.studio` se richiesto
- Accetta i permessi (read/write Calendar events)
- Vieni reindirizzato a `/api/oauth/google/callback` → vedi la pagina di conferma "✅ Alba ora può creare eventi"

Da quel momento il refresh_token è salvato su Supabase (`alba_integrations`). Alba lo usa ogni volta che `book_call` viene chiamato con uno slot parsabile.

## 7) Verifica

Apri Alba sul sito in incognito, scrivi:

> "Posso prendere appuntamento giovedì 3 luglio alle 11?"

Dovresti ricevere (e info@pianeta.studio anche) un invito Google Calendar con Google Meet, mandato automaticamente.

Se l'orario non è parsabile o Google Calendar fallisce, fallback: brief email a Max via Resend + link Cal.com generico.

## Troubleshooting

- **"No refresh_token returned"** al callback → vai su https://myaccount.google.com/permissions, revoca "Alba — Pianeta.Studio", riprova `/start`
- **403 al callback** → state mismatch, lancia di nuovo `/start` dal browser
- **"GOOGLE_CLIENT_ID missing"** dopo deploy → controlla env Vercel Production e ridepoya
- **Eventi non creati** ma Alba dice "fatto" → controlla logs Vercel function `/api/alba/chat` per errore `gcalResult.error`
