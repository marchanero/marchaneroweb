/** @jest-environment node */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const dist = path.resolve('dist');
const origin = 'https://robertosanchezreolid.netlify.app';
const sitemap = new JSDOM(fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('loc')].map(node => node.textContent);
const readPage = url => new JSDOM(fs.readFileSync(path.join(dist, new URL(url).pathname, 'index.html'), 'utf8')).window.document;

// Ejecutar después de npm run build: se comprueba el HTML que reciben los buscadores.
describe('SEO del sitio generado', () => {
  test.each(urls)('%s tiene metadatos coherentes y datos estructurados válidos', url => {
    const document = readPage(url);
    const meta = selector => document.querySelector(selector)?.getAttribute('content');
    expect(document.documentElement.lang).toBe('es');
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]').href).toBe(url);
    expect(document.title).toContain('Roberto Sánchez Reolid');
    const description = meta('meta[name="description"]');
    expect(description.length).toBeGreaterThan(40);
    expect(meta('meta[name="robots"]')).not.toContain('noindex');
    expect(meta('meta[property="og:url"]')).toBe(url);
    expect(meta('meta[property="og:title"]')).toBe(document.title);
    expect(meta('meta[name="twitter:title"]')).toBe(document.title);
    expect(meta('meta[property="og:description"]')).toBe(description);
    expect(meta('meta[name="twitter:description"]')).toBe(description);
    const image = new URL(meta('meta[property="og:image"]'));
    expect(image.origin).toBe(origin);
    expect(fs.existsSync(path.join(dist, image.pathname))).toBe(true);
    const data = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    const person = data['@graph'].find(node => node['@type'] === 'Person');
    const webpage = data['@graph'].find(node => node.url === url && node['@id'].endsWith('#webpage'));
    expect(person.name).toBe('Roberto Sánchez Reolid');
    expect(webpage.description).toBe(description);
    expect(webpage.about['@id']).toBe(person['@id']);
    if (new URL(url).pathname !== '/') {
      const breadcrumb = data['@graph'].find(node => node['@type'] === 'BreadcrumbList');
      expect(breadcrumb.itemListElement.at(-1).item).toBe(url);
      for (const item of breadcrumb.itemListElement) expect(urls).toContain(item.item);
    }
  });

  test('los títulos y descripciones son únicos', () => {
    const documents = urls.map(readPage);
    expect(new Set(documents.map(document => document.title)).size).toBe(urls.length);
    expect(new Set(documents.map(document => document.querySelector('meta[name="description"]').content)).size).toBe(urls.length);
  });

  test('el perfil está vinculado a la persona y el RSS se puede descubrir', () => {
    const document = readPage(origin + '/');
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    expect(graph.find(node => node['@type'] === 'ProfilePage').mainEntity['@id']).toBe(origin + '/#person');
    expect(document.querySelector('link[type="application/rss+xml"]').href).toBe(origin + '/rss.xml');
  });

  test('404 y administración no se indexan ni aparecen en el sitemap', () => {
    expect(urls.length).toBeGreaterThan(10);
    expect(urls.some(url => /\/(404|admin)(\/|\.|$)/.test(new URL(url).pathname))).toBe(false);
    for (const file of ['404.html', 'admin/index.html']) {
      const document = new JSDOM(fs.readFileSync(path.join(dist, file), 'utf8')).window.document;
      expect(document.querySelector('meta[name="robots"]').content).toContain('noindex');
    }
    expect(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8')).toContain(`Sitemap: ${origin}/sitemap-index.xml`);
  });
});
