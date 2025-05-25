/**
 * @jest-environment node
 */

// Este archivo prueba que el contenido académico esté correctamente implementado

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

describe('Pruebas de contenido académico', () => {
  // Asegurar que existe el directorio dist antes de todos los tests
  beforeAll(() => {
    ensureDistExists();
  });
  
  // Test para verificar la página de inicio
  test('La página de inicio muestra la información académica correcta', () => {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    
    const content = fs.readFileSync(indexPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar que el título principal es correcto
    const h1 = document.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe('Roberto Sánchez Reolid');
    
    // Verificar subtítulo
    const h2 = document.querySelector('.hero h2');
    expect(h2).not.toBeNull();
    expect(h2.textContent).toBe('Investigador PhD');
    
    // Verificar que contiene la referencia a la universidad
    const heroDescription = document.querySelector('.hero-description');
    expect(heroDescription).not.toBeNull();
    expect(heroDescription.textContent.trim()).toContain('Universidad de Castilla-La Mancha');
    
    // Verificar que existe la sección de investigaciones destacadas
    const sectionTitle = document.querySelector('.projects-preview h2');
    expect(sectionTitle).not.toBeNull();
    expect(sectionTitle.textContent).toBe('Investigaciones destacadas');
    
    // Verificar que existen las tarjetas de investigación
    const projectCards = document.querySelectorAll('.project-card');
    expect(projectCards.length).toBeGreaterThanOrEqual(3);
  });
  
  // Test para verificar la página de sobre mí
  test('La página sobre mí contiene las áreas de especialización', async () => {
    const sobreMiPath = path.join(__dirname, '..', 'dist', 'sobre-mi', 'index.html');
    const content = fs.readFileSync(sobreMiPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar que contiene la sección de especialización 
    const skillsSection = document.querySelector('.skills-section h2');
    expect(skillsSection).not.toBeNull();
    expect(skillsSection.textContent).toContain('Áreas de especialización');
    
    // Verificar que incluye habilidades académicas
    const skills = Array.from(document.querySelectorAll('.skill-tag'));
    const skillTexts = skills.map(skill => skill.textContent);
    
    // Verificar al menos una habilidad de cada categoría
    expect(skillTexts).toContain('Machine Learning');
    expect(skillTexts).toContain('Algoritmos Cuánticos');
    expect(skillTexts).toContain('Investigación Científica');
  });

  // Test para verificar la página de investigaciones
  test('La página de investigaciones muestra publicaciones académicas', async () => {
    const proyectosPath = path.join(__dirname, '..', 'dist', 'proyectos', 'index.html');
    const content = fs.readFileSync(proyectosPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar título principal
    const h1 = document.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe('Mis Investigaciones');
    
    // Verificar que existe la introducción adecuada
    const intro = document.querySelector('.intro-text');
    expect(intro).not.toBeNull();
    expect(intro.textContent).toContain('líneas de investigación');
    
    // Verificar tarjetas de investigación
    const projectCards = document.querySelectorAll('.project-card');
    expect(projectCards.length).toBeGreaterThanOrEqual(4);
    
    // Verificar que al menos una tiene referencia a publicación académica
    const projectLinks = document.querySelectorAll('.project-links a');
    const linkTexts = Array.from(projectLinks).map(link => link.textContent);
    
    expect(linkTexts).toContain('Ver publicación');
    expect(linkTexts).toContain('Descargar PDF');
  });
});
