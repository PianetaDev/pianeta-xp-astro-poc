import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages deploy: PianetaDev/pianeta-xp-astro-poc
// Lives under /pianeta-xp-astro-poc/ subpath.
export default defineConfig({
  site: 'https://pianetadev.github.io',
  base: '/pianeta-xp-astro-poc',
  integrations: [tailwind()],
  compressHTML: true,
});
