import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pianeta-xp-astro-poc.vercel.app',
  integrations: [tailwind()],
  compressHTML: true,
});
