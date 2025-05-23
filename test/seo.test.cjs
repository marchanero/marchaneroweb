/**
 * @jest-environment node
 */

// Este archivo prueba aspectos específicos de SEO y estructura de las páginas

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { spawnSync } = require('child_process');

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

describe('Pruebas de SEO y estructura', () => {
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
