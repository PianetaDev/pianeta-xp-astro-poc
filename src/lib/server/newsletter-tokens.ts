/**
 * Stable HMAC tokens for newsletter preference management + unsubscribe.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

function getSecret(): string {
  const s = env('NARRATOR_SECRET');
  if (!s) throw new Error('NARRATOR_SECRET missing');
  return s;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/\s/g, '+');
}

export function manageToken(email: string): string {
  const e = normalizeEmail(email);
  return createHmac('sha256', getSecret()).update(`manage:${e}`).digest('hex').slice(0, 32);
}

export function verifyManageToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = manageToken(email);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch { return false; }
}

export function manageUrl(siteUrl: string, email: string, locale: 'it' | 'en' = 'it'): string {
  const prefix = locale === 'en' ? '/en' : '';
  return `${siteUrl}${prefix}/bulletin/preferenze?email=${encodeURIComponent(email)}&t=${manageToken(email)}`;
}

export function unsubscribeUrl(siteUrl: string, email: string): string {
  return `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&t=${manageToken(email)}`;
}
