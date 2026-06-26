# Ads pipeline — Pianeta.Studio

Documenta come funziona il flusso campagne Google Ads per Pianeta.Studio stessa (non clienti).

## Stato corrente

- ✅ Content collection `campaigns` (Astro)
- ✅ Admin UI `/admin/campaigns` (lista) + `/admin/campaigns/new` (brief intake)
- ✅ Endpoint `/api/admin/campaigns/create` → markdown frontmatter
- ⏸ Endpoint `/api/ads/google/launch` (stub) — attesa Google Ads Developer Token
- ⏸ Alba tool `launch_campaign` (in `tools/registry.json` su PianetaDev/alba)

## Flusso operativo umano (oggi)

1. **Max apre `/admin/campaigns/new`** sul sito
2. Compila il brief: nome, obiettivo, canale, budget, landing, audience
3. Sottomette → riceve frontmatter markdown da copia-incollare
4. Salva il file in `src/content/campaigns/<slug>.md`, commit, push
5. La campagna appare in `/admin/campaigns` con stato `draft`
6. Max va sul **pannello Google Ads** e crea la campagna a mano (per ora)
7. Aggiorna il file md con `googleAdsCampaignId` + sposta `status: review` → `live`
8. Spend / impressions / clicks / conversions si aggiornano a mano (TODO: sync automatico)

## Google Ads setup (necessario per automazione)

### 1. Developer token

- Account Google Ads → My Client Center (MCC) → **Tools & Settings → API Center → Apply for token**
- Approvazione richiede 1–2 settimane
- Specificare uso: "Internal campaign management for Pianeta.Studio S.r.l. SB"

### 2. OAuth credentials

- Google Cloud Console → Credentials → **Create OAuth 2.0 Client ID** (Desktop app)
- Scarica `client_id` + `client_secret`

### 3. Refresh token

```bash
# Una tantum, dall'account Max:
npx google-ads-api-token-generator \
  --client_id="$GOOGLE_ADS_CLIENT_ID" \
  --client_secret="$GOOGLE_ADS_CLIENT_SECRET" \
  --scopes="https://www.googleapis.com/auth/adwords"
# Salva il refresh_token su Vercel
```

### 4. Vercel env

```
GOOGLE_ADS_DEVELOPER_TOKEN=…
GOOGLE_ADS_CLIENT_ID=…
GOOGLE_ADS_CLIENT_SECRET=…
GOOGLE_ADS_REFRESH_TOKEN=…
GOOGLE_ADS_LOGIN_CUSTOMER_ID=…   # MCC, formato 1234567890
GOOGLE_ADS_CUSTOMER_ID=…         # Account operativo Pianeta
ADMIN_SECRET=…                   # Per gate /admin e /api/admin
```

### 5. Implementazione

```ts
import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
  client_id: env.GOOGLE_ADS_CLIENT_ID,
  client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
});

// 1. Budget
const budget = await customer.campaignBudgets.create([{
  name: campaign.title + ' — budget',
  amount_micros: campaign.budgetTotal * 1_000_000,
  delivery_method: 'STANDARD',
}]);

// 2. Campaign (Search)
const created = await customer.campaigns.create([{
  name: campaign.title,
  advertising_channel_type: 'SEARCH',
  status: 'PAUSED',  // creiamo sempre paused, Max o Alba poi enable
  campaign_budget: budget.results[0].resource_name,
  start_date: campaign.startDate.replace(/-/g, ''),
  end_date: campaign.endDate?.replace(/-/g, ''),
  network_settings: { target_google_search: true, target_search_network: true },
}]);

return created.results[0].resource_name; // → googleAdsCampaignId
```

## Alba integration (futuro)

Una volta validato il flusso umano, in `PianetaDev/alba/tools/registry.json` aggiungere:

```json
{
  "name": "launch_campaign",
  "description": "Crea una bozza campagna Google Ads in stato PAUSED. Richiede approvazione umana esplicita prima dell'enable.",
  "input_schema": {
    "type": "object",
    "required": ["title", "objective", "budget", "landing_page", "start_date"],
    "properties": { "...": "..." }
  }
}
```

Alba chiamerà `POST /api/ads/google/launch` con il payload normalizzato dal brief.

## Sync KPI (futuro)

Cron daily che pesca da Google Ads:

```sql
SELECT campaign.id, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions
FROM campaign
WHERE segments.date DURING LAST_7_DAYS
```

→ aggiorna `spend`, `impressions`, `clicks`, `conversions` nei file md. Commit automatico.

## Approfondimenti

- Google Ads API REST docs: https://developers.google.com/google-ads/api/docs/start
- npm `google-ads-api`: https://github.com/Opteo/google-ads-api
- MCC strategy: usiamo il MCC come login customer (parent), poi operiamo sull'account figlio
