import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';
import { getDraftPaths } from './scripts/draft-sitemap-filter.mjs';

const draftPaths = getDraftPaths();

export default defineConfig({
  site: 'https://xp.pianeta.studio',
  output: 'server',
  adapter: vercel(),
  integrations: [
    vue(),
    tailwind(),
    sitemap({ filter: (page) => !draftPaths.has(new URL(page).pathname.replace(/\/$/, '')) }),
    icon(),
  ],
  compressHTML: true,
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
