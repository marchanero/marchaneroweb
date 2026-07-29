// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://marchanero.netlify.app',
  compressHTML: true,
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  // 'never' (en vez de 'auto'): ningún <style> inline en el HTML, todo el CSS
  // como <link> externo — permite quitar 'unsafe-inline' de style-src en la CSP
  // (netlify.toml) sin depender de hashes por página.
  build: {
    inlineStylesheets: 'never',
  },
});
