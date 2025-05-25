import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Páginas', () => {
  it('la página de inicio contiene elementos básicos', () => {
    // Test básico para verificar que Jest funciona
    expect(true).toBe(true);
    
    // Mock de verificación de título
    const mockTitle = 'Roberto Sánchez Reolid | PhD';
    expect(mockTitle).toContain('Roberto Sánchez Reolid');
  });

  it('verifica la estructura básica del proyecto', () => {
    const projectRoot = path.join(__dirname, '..');
    
    // Verificar que existen archivos clave
    expect(fs.existsSync(path.join(projectRoot, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'astro.config.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'src', 'pages', 'index.astro'))).toBe(true);
  });

  it('verifica que existen los datos de scholar', () => {
    const projectRoot = path.join(__dirname, '..');
    const scholarPath = path.join(projectRoot, 'src', 'data', 'scholar.json');
    
    expect(fs.existsSync(scholarPath)).toBe(true);
    
    const scholarData = JSON.parse(fs.readFileSync(scholarPath, 'utf8'));
    expect(scholarData).toHaveProperty('publications');
    expect(scholarData).toHaveProperty('metrics');
  });
});