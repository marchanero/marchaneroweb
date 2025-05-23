/**
 * @jest-environment node
 */

// Este archivo prueba aspectos específicos de SEO y estructura de las páginas

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Pruebas de SEO y estructura', () => {
  // Rutas de las páginas principales
  const pages = [
    { path: '/index.html', title: 'Robert Marchanero | Desarrollador Web' },
    { path: '/sobre-mi/index.html', title: 'Sobre Mí | Robert Marchanero' },
    { path: '/proyectos/index.html', title: 'Proyectos | Robert Marchanero' },
    { path: '/contacto/index.html', title: 'Contacto | Robert Marchanero' }
  ];
  
  // Prueba que cada página tenga el título correcto
  test.each(pages)('La página $path tiene el título correcto', async ({ path: pagePath, title }) => {
    const distPath = path.join(__dirname, '..', 'dist');
    const filePath = path.join(distPath, pagePath);
    
    expect(fs.existsSync(filePath)).toBe(true);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const pageTitle = dom.window.document.title;
    
    expect(pageTitle).toBe(title);
  });
  
  // Prueba que cada página tenga los metadatos esenciales para SEO
  test.each(pages)('La página $path tiene metadatos SEO', async ({ path: pagePath }) => {
    const distPath = path.join(__dirname, '..', 'dist');
    const filePath = path.join(distPath, pagePath);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar la existencia de meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).not.toBeNull();
    expect(metaDescription.getAttribute('content')).toBeTruthy();
    
    // Verificar viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    
    // Verificar charset
    const charset = document.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
  });
  
  // Prueba la estructura básica del layout
  test('La página principal tiene la estructura de navegación correcta', () => {
    const distPath = path.join(__dirname, '..', 'dist');
    const filePath = path.join(distPath, '/index.html');
    
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar header
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    
    // Verificar navegación
    const nav = document.querySelector('nav');
    expect(nav).not.toBeNull();
    
    // Verificar enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    expect(navLinks.length).toBeGreaterThanOrEqual(3);
    
    // Verificar footer
    const footer = document.querySelector('footer');
    expect(footer).not.toBeNull();
  });
});
