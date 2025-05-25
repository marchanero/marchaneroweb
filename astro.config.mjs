// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://marchanero.netlify.app',
  compressHTML: true,
  integrations: [tailwind()],
  // Optimización para producción
  build: {
    inlineStylesheets: 'auto',
  },
});
