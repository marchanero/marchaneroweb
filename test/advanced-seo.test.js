/**
 * @jest-environment node
 */

// Este archivo prueba aspectos avanzados de SEO y la estructura específica para el perfil de investigador

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para asegurar que existe el directorio dist con archivos generados
function ensureDistExists() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('El directorio dist no existe. Ejecutando build...');
    // Ejecutar build del sitio de forma sincrónica
    const buildResult = spawnSync('npm', ['run', 'build'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });
    
    if (buildResult.status !== 0) {
      console.error('Error al ejecutar el build del sitio');
      throw new Error('Build failed');
    }
    
    console.log('Build completado');
  }
  
  // Verificar que ahora existe el directorio dist
  if (!fs.existsSync(distPath)) {
    throw new Error('No se pudo crear el directorio dist');
  }
}

describe('Pruebas avanzadas de SEO y estructura para perfil académico', () => {
  // Asegurar que existe el directorio dist antes de ejecutar los tests
  beforeAll(() => {
    ensureDistExists();
  });
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
