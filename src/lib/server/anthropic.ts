import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;
  _client = new Anthropic({ apiKey: env('ANTHROPIC_API_KEY') });
  return _client;
}

export const CLAUDE_MODEL = 'claude-opus-4-6';
