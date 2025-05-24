/**
 * @jest-environment node
 */

// Este archivo prueba que el contenido académico esté correctamente implementado

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Pruebas de contenido académico', () => {
  // Test para verificar la página de inicio
  test('La página de inicio muestra la información académica correcta', () => {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
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
