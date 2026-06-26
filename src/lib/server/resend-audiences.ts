/**
 * Resend audience registry.
 */
import { env } from './env';

const FALLBACKS = {
  bulletin: 'c22dc4f0-3af0-4e29-a997-524fb770876b',
  network:  '34eb8f0b-4346-4aa0-9f6c-72fb9c003c66',
  pipeline: 'ffac729c-f87f-484e-bad1-73968ea2476d',
} as const;

export type AudienceKey = keyof typeof FALLBACKS;

export function resolveAudienceId(key: AudienceKey | string): string {
  if (key === 'bulletin') return env('RESEND_AUDIENCE_ID') || env('RESEND_AUDIENCE_BULLETIN') || FALLBACKS.bulletin;
  if (key === 'network')  return env('RESEND_AUDIENCE_NETWORK') || FALLBACKS.network;
  if (key === 'pipeline') return env('RESEND_AUDIENCE_PIPELINE') || FALLBACKS.pipeline;
  return key;
}

export const AUDIENCES_INFO = {
  bulletin: { label: 'Bulletin pubblico',     when: 'Nuovi articoli, case study, annunci pubblici' },
  network:  { label: 'Network qualificato',   when: 'Update progetti, partner, ex-clienti, press · trimestrale' },
  pipeline: { label: 'Pre-vendita pipeline',  when: 'Prospect Alba in conversazione · ad hoc' },
} as const;
