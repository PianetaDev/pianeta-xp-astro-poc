/**
 * Stripe singleton — server-side only.
 */
import Stripe from 'stripe';
import { env } from './env';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = env('STRIPE_SECRET_KEY');
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  _stripe = new Stripe(key, { apiVersion: '2024-11-20.acacia' as any });
  return _stripe;
}
