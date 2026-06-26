// Vitest setup — carica .env.local per i test che toccano DB / API reali
import { config } from 'dotenv';
import { resolve } from 'node:path';
config({ path: resolve(__dirname, '..', '.env.local') });
