/**
 * @jest-environment node
 */

// Este archivo prueba aspectos avanzados de SEO y la estructura específica para el perfil de investigador

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Pruebas avanzadas de SEO y estructura para perfil académico', () => {
  // Rutas de las páginas principales
  const pages = [
    { path: '/index.html', title: 'Roberto Sánchez Reolid | PhD' },
    { path: '/sobre-mi/index.html', title: 'Sobre Mí | Roberto Sánchez Reolid' },
    { path: '/proyectos/index.html', title: 'Investigaciones | Roberto Sánchez Reolid' },
    { path: '/contacto/index.html', title: 'Contacto | Roberto Sánchez Reolid' }
  ];
  
  // Prueba que cada página tenga los metadatos avanzados para SEO
  test.each(pages)('La página $path tiene metadatos SEO avanzados', async ({ path: pagePath }) => {
    const distPath = path.join(__dirname, '..', 'dist');
    const filePath = path.join(distPath, pagePath);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar metadatos de autor
    const metaAuthor = document.querySelector('meta[name="author"]');
    expect(metaAuthor).not.toBeNull();
    expect(metaAuthor.getAttribute('content')).toBe('Roberto Sánchez Reolid');
    
    // Verificar keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords).not.toBeNull();
    const keywords = metaKeywords.getAttribute('content');
    expect(keywords).toContain('Roberto Sánchez Reolid');
    expect(keywords).toContain('investigación');
    expect(keywords).toContain('UCLM');
    
    // Verificar Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).not.toBeNull();
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    expect(ogDescription).not.toBeNull();
    
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType).not.toBeNull();
    expect(ogType.getAttribute('content')).toBe('website');
  });
  
  // Prueba la estructura del pie de página
  test('El pie de página contiene información institucional', () => {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar que existe el footer
    const footer = document.querySelector('footer');
    expect(footer).not.toBeNull();
    
    // Verificar clase footer-content
    const footerContent = document.querySelector('.footer-content');
    expect(footerContent).not.toBeNull();
    
    // Verificar que contiene el nombre correcto
    expect(footer.textContent).toContain('Dr. Roberto Sánchez Reolid');
    
    // Verificar texto institucional
    const institutional = document.querySelector('.institutional');
    expect(institutional).not.toBeNull();
    expect(institutional.textContent).toContain('Universidad de Castilla-La Mancha');
  });
  
  // Prueba la estructura de la navegación
  test('La navegación contiene los enlaces correctos', () => {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar que existe la nav con los enlaces
    const nav = document.querySelector('nav');
    expect(nav).not.toBeNull();
    
    // Verificar el logo
    const logo = document.querySelector('.logo');
    expect(logo).not.toBeNull();
    expect(logo.textContent).toContain('Dr. Roberto Sánchez Reolid');
    
    // Verificar que incluye "Investigaciones" en vez de "Proyectos"
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const linkTexts = navLinks.map(link => link.textContent);
    
    expect(linkTexts).toContain('Investigaciones');
    expect(linkTexts).not.toContain('Proyectos');
  });
});
