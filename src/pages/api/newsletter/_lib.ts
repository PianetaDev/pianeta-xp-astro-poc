import { randomBytes } from 'node:crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_RE.test(email.trim());
}

export function generateConfirmToken(): string {
  return randomBytes(24).toString('hex');
}

export type TopicKey = 'bulletin' | 'announcements';
