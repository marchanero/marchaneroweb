#!/usr/bin/env node

/**
 * Genera el PDF descargable del CV (dist/files/CV_RobertoSanchezReolid.pdf)
 * renderizando /cv con Puppeteer y exportando a PDF con las reglas @media
 * print / @page ya definidas en src/styles/global.css.
 *
 * Se ejecuta como "postbuild" (después de "astro build"). Si Chromium no
 * puede arrancar en el entorno de CI, no debe romper el despliegue: se
 * registra un aviso y se sale con código 0.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import puppeteer from 'puppeteer-core';

const DIST_DIR = path.resolve('dist');
const OUTPUT_PATH = path.join(DIST_DIR, 'files', 'CV_RobertoSanchezReolid.pdf');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(DIST_DIR, urlPath);

      if (!filePath.startsWith(DIST_DIR)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (urlPath.endsWith('/') || !path.extname(filePath)) {
        const indexCandidate = path.join(filePath, 'index.html');
        if (fs.existsSync(indexCandidate)) filePath = indexCandidate;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// En Linux (Netlify, GitHub Actions) usamos @sparticuz/chromium: un binario de
// Chromium mínimo pensado para entornos restringidos, sin las librerías
// compartidas (libnss3, libatk...) que un Chromium completo necesita y que
// estos entornos de build no siempre tienen instaladas. En el resto de
// plataformas (desarrollo local) usamos el Chrome ya instalado en el sistema,
// sin depender de "puppeteer" ni de su descarga de ~200 MB.
async function launchBrowser() {
  if (os.platform() === 'linux') {
    const chromium = (await import('@sparticuz/chromium')).default;

    return puppeteer.launch({
      headless: true,
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    });
  }

  return puppeteer.launch({ headless: true, channel: 'chrome' });
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.warn('[cv-pdf] dist/ no existe (¿se ejecutó "astro build" antes?). Se omite la generación del PDF.');
    return;
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const server = await startServer();
  const { port } = server.address();
  let browser;

  try {
    browser = await launchBrowser();

    const page = await browser.newPage();
    // Fuerza modo claro independientemente del prefers-color-scheme del entorno de build
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.emulateMediaType('print');

    await page.pdf({
      path: OUTPUT_PATH,
      printBackground: true,
      preferCSSPageSize: true, // respeta @page { size: A4; margin: 1.5cm } de global.css
    });

    console.log(`[cv-pdf] PDF generado en ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.warn('[cv-pdf] No se pudo generar el PDF del CV (no bloquea el despliegue):', err.message);
  process.exitCode = 0;
});
