// Google Calendar API helpers per Alba.
// Flow: OAuth user code → refresh_token salvato su alba_integrations
// → access_token rinnovato on-demand → events.insert con sendUpdates=all
//
// Env richiesti (Vercel project):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_OAUTH_REDIRECT_URI   (es. https://xp.pianeta.studio/api/oauth/google/callback)
//   ALBA_CALENDAR_OWNER_EMAIL   (es. info@pianeta.studio — chi possiede l'agenda)

import { albaSupabase } from './supabase';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export interface CreateEventArgs {
  summary: string;
  description?: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
  timeZone?: string; // default 'Europe/Rome'
  attendees: string[]; // email list
  addMeet?: boolean;
}

export interface CalendarEventResult {
  ok: boolean;
  event_id?: string;
  html_link?: string;
  meet_url?: string;
  error?: string;
}

function envOrThrow(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`env ${k} missing`);
  return v;
}

async function refreshAccessToken(ownerEmail: string): Promise<{ access_token: string; expires_at: Date } | { error: string }> {
  const sb = albaSupabase();
  const { data } = await sb.from('alba_integrations')
    .select('refresh_token, access_token, access_token_exp')
    .eq('provider', 'google_calendar')
    .eq('owner_email', ownerEmail)
    .maybeSingle();

  if (!data?.refresh_token) {
    return { error: `No refresh_token saved for ${ownerEmail}. Owner must visit /api/oauth/google/start to authorize.` };
  }

  // Cache hit?
  if (data.access_token && data.access_token_exp && new Date(data.access_token_exp).getTime() > Date.now() + 60_000) {
    return { access_token: data.access_token, expires_at: new Date(data.access_token_exp) };
  }

  const body = new URLSearchParams({
    client_id: envOrThrow('GOOGLE_CLIENT_ID'),
    client_secret: envOrThrow('GOOGLE_CLIENT_SECRET'),
    refresh_token: data.refresh_token,
    grant_type: 'refresh_token',
  });
  const res = await fetch(TOKEN_URL, { method: 'POST', body });
  if (!res.ok) return { error: `token refresh failed: ${res.status} ${await res.text()}` };
  const tok = (await res.json()) as { access_token: string; expires_in: number };
  const expAt = new Date(Date.now() + (tok.expires_in - 60) * 1000);
  await sb.from('alba_integrations').update({
    access_token: tok.access_token,
    access_token_exp: expAt.toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('provider', 'google_calendar').eq('owner_email', ownerEmail);

  return { access_token: tok.access_token, expires_at: expAt };
}

export interface BusyInterval { start: string; end: string }
export interface FreeBusyResult { ok: boolean; busy?: BusyInterval[]; error?: string }

const FREEBUSY_API = 'https://www.googleapis.com/calendar/v3/freeBusy';

export async function getFreeBusy(timeMinIso: string, timeMaxIso: string, timeZone = 'Europe/Rome'): Promise<FreeBusyResult> {
  const owner = process.env.ALBA_CALENDAR_OWNER_EMAIL;
  if (!owner) return { ok: false, error: 'ALBA_CALENDAR_OWNER_EMAIL env missing' };
  const tokenRes = await refreshAccessToken(owner);
  if ('error' in tokenRes) return { ok: false, error: tokenRes.error };

  const res = await fetch(FREEBUSY_API, {
    method: 'POST',
    headers: { 'authorization': `Bearer ${tokenRes.access_token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ timeMin: timeMinIso, timeMax: timeMaxIso, timeZone, items: [{ id: 'primary' }] }),
  });
  if (!res.ok) return { ok: false, error: `freebusy failed: ${res.status} ${(await res.text()).slice(0, 200)}` };
  const data = await res.json() as any;
  const busy = (data.calendars?.primary?.busy || []) as BusyInterval[];
  return { ok: true, busy };
}

export async function createGoogleCalendarEvent(args: CreateEventArgs): Promise<CalendarEventResult> {
  const owner = process.env.ALBA_CALENDAR_OWNER_EMAIL;
  if (!owner) return { ok: false, error: 'ALBA_CALENDAR_OWNER_EMAIL env missing' };

  const tokenRes = await refreshAccessToken(owner);
  if ('error' in tokenRes) return { ok: false, error: tokenRes.error };

  const payload: any = {
    summary: args.summary,
    description: args.description,
    start: { dateTime: args.start, timeZone: args.timeZone || 'Europe/Rome' },
    end: { dateTime: args.end, timeZone: args.timeZone || 'Europe/Rome' },
    attendees: args.attendees.map(email => ({ email })),
    reminders: { useDefault: true },
  };
  if (args.addMeet) {
    payload.conferenceData = {
      createRequest: {
        requestId: `alba-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const url = new URL(CALENDAR_API);
  url.searchParams.set('sendUpdates', 'all');
  if (args.addMeet) url.searchParams.set('conferenceDataVersion', '1');

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${tokenRes.access_token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { ok: false, error: `calendar insert failed: ${res.status} ${(await res.text()).slice(0, 300)}` };
  }
  const ev = await res.json() as any;
  const meetUrl = ev.conferenceData?.entryPoints?.find((p: any) => p.entryPointType === 'video')?.uri;
  return { ok: true, event_id: ev.id, html_link: ev.htmlLink, meet_url: meetUrl };
}
