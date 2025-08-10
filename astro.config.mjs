import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ferrywl.to/',
  base: 'theme-color-playground',
  output: 'static',
  integrations: [sitemap()]
});
