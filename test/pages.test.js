/**
 * @jest-environment node
 */

// Este archivo verifica que las rutas principales estén bien definidas
// y que los archivos se generen correctamente durante el proceso de build

const fs = require('fs');
const path = require('path');

describe('Pruebas de generación de páginas', () => {
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
      expect(content).toContain('<!doctype html>');
      expect(content).toContain('<html');
      expect(content).toContain('</html>');
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
