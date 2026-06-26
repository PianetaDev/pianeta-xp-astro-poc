import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['tests/**/*.test.ts'],
    setupFiles: [resolve(__dirname, 'tests/setup.ts')],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
