import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://xp.pianeta.studio',
  output: 'server',
  adapter: vercel(),
  integrations: [vue(), tailwind(), sitemap(), icon()],
  compressHTML: true,
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
