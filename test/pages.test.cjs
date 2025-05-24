/**
 * @jest-environment node
 */

// Este archivo verifica que las rutas principales estén bien definidas
// y que los archivos se generen correctamente durante el proceso de build

const fs = require('fs');
const path = require('path');
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

describe('Pruebas de generación de páginas', () => {
  // Asegurar que existe el directorio dist antes de ejecutar los tests
  beforeAll(() => {
    ensureDistExists();
  });
  // Definimos las rutas que esperamos que existan después del build
  const expectedRoutes = [
    '/index.html',
    '/sobre-mi/index.html',
    '/proyectos/index.html',
    '/contacto/index.html'
  ];
  
  // Esta prueba necesita ejecutarse después de un build
  test('Se generan todas las rutas principales', () => {
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Verificamos que el directorio dist existe
    expect(fs.existsSync(distPath)).toBe(true);
    
    // Verificamos cada ruta esperada
    expectedRoutes.forEach(route => {
      const filePath = path.join(distPath, route);
      expect(fs.existsSync(filePath)).toBe(true);
      
      // Verificamos que el contenido no está vacío
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
      
      // Verificamos que tiene la estructura básica de un HTML
      const contentLower = content.toLowerCase();
      expect(contentLower).toContain('<!doctype html>');
      expect(contentLower).toContain('<html');
      expect(contentLower).toContain('</html>');
    });
  });
  
  test('El HTML contiene metadatos básicos', () => {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Verificamos metadatos importantes para SEO
    expect(content).toContain('<meta charset=');
    expect(content).toContain('<meta name="viewport"');
    expect(content).toContain('<title>');
  });
});
