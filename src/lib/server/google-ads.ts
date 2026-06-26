// Google Ads API client wrapper — lazy init, env-checked.
// Si attiva solo se TUTTE le env sono presenti, altrimenti throw con messaggio chiaro.
import { GoogleAdsApi, enums } from 'google-ads-api';

interface GoogleAdsEnv {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId: string;
  customerId: string;
}

function readEnv(): GoogleAdsEnv {
  const required = {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
  };
  const missing = Object.entries(required).filter(([_, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(`google-ads-not-configured: missing ${missing.join(', ')}`);
  }
  return required as GoogleAdsEnv;
}

let _client: GoogleAdsApi | null = null;
let _customer: any = null;

function getCustomer() {
  if (_customer) return _customer;
  const env = readEnv();
  _client = new GoogleAdsApi({
    client_id: env.clientId,
    client_secret: env.clientSecret,
    developer_token: env.developerToken,
  });
  _customer = _client.Customer({
    customer_id: env.customerId,
    login_customer_id: env.loginCustomerId,
    refresh_token: env.refreshToken,
  });
  return _customer;
}

export interface CreateCampaignInput {
  title: string;
  budgetEurDaily: number;        // EUR per giorno
  startDate: string;             // 'YYYY-MM-DD'
  endDate?: string;
  channelType?: 'SEARCH' | 'DISPLAY' | 'PERFORMANCE_MAX';
}

export async function createDraftCampaign(input: CreateCampaignInput) {
  const customer = getCustomer();
  const ymd = (s: string) => s.replace(/-/g, '');

  // 1. Budget
  const budgetRes = await customer.campaignBudgets.create([{
    name: `${input.title} — budget`,
    amount_micros: Math.round(input.budgetEurDaily * 1_000_000),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
  }]);

  // 2. Campaign (PAUSED — sempre creiamo paused; enable manuale)
  const campRes = await customer.campaigns.create([{
    name: input.title,
    advertising_channel_type: enums.AdvertisingChannelType[input.channelType || 'SEARCH'],
    status: enums.CampaignStatus.PAUSED,
    campaign_budget: budgetRes.results[0].resource_name,
    start_date: ymd(input.startDate),
    end_date: input.endDate ? ymd(input.endDate) : undefined,
    network_settings: {
      target_google_search: true,
      target_search_network: true,
      target_content_network: false,
    },
  }]);

  return {
    resourceName: campRes.results[0].resource_name,
    budgetResourceName: budgetRes.results[0].resource_name,
  };
}

export interface CampaignKPI {
  campaignId: string;
  costMicros: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export async function fetchKPILast7Days(): Promise<CampaignKPI[]> {
  const customer = getCustomer();
  const rows = await customer.query(`
    SELECT
      campaign.id,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
      AND campaign.status != 'REMOVED'
  `);
  return rows.map((r: any) => ({
    campaignId: String(r.campaign.id),
    costMicros: Number(r.metrics.cost_micros || 0),
    impressions: Number(r.metrics.impressions || 0),
    clicks: Number(r.metrics.clicks || 0),
    conversions: Number(r.metrics.conversions || 0),
  }));
}

export function isConfigured(): boolean {
  try { readEnv(); return true; } catch { return false; }
}
