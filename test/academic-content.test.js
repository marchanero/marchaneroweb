/**
 * @jest-environment node
 */

// Este archivo prueba que el contenido académico esté correctamente implementado

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
    expect(h1.textContent.trim()).toBe('Roberto Sánchez Reolid');
    
    // Verificar subtítulo
    const h2 = document.querySelector('h2');
    expect(h2).not.toBeNull();
    expect(h2.textContent.trim()).toBe('Investigador PhD');
    
    // Verificar que contiene la referencia a la universidad
    expect(content).toContain('Universidad de Castilla-La Mancha');
    
    // Verificar que existe sección sobre el investigador
    expect(content).toContain('Sobre mí');
  });
  
  // Test para verificar la página de sobre mí
  test('La página sobre mí contiene las áreas de especialización', async () => {
    const sobreMiPath = path.join(__dirname, '..', 'dist', 'sobre-mi', 'index.html');
    const content = fs.readFileSync(sobreMiPath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Verificar que contiene la sección de especialización 
    expect(content).toContain('Áreas de especialización');
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
    expect(h1.textContent).toBe('Líneas de Investigación');
    
    // Verificar que existe contenido sobre líneas de investigación
    expect(content).toContain('líneas de investigación');
    
    // Verificar que contiene proyectos/investigaciones
    expect(content).toContain('investigación');
  });
});
