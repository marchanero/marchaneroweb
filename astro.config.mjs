// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://marchanero.netlify.app',
  compressHTML: true,
  // Optimización para producción
  build: {
    inlineStylesheets: 'auto',
  },
});
