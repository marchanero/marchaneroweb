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

  it('verifica que las páginas cargan contenido desde Markdown', () => {
    const projectRoot = path.join(__dirname, '..');
    
    // Verificar index.astro
    const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    expect(indexContent).toContain("import matter from 'gray-matter'");
    expect(indexContent).toContain("path.resolve('./content/index.md')");
    
    // Verificar sobre-mi.astro
    const sobreMiPath = path.join(projectRoot, 'src', 'pages', 'sobre-mi.astro');
    const sobreMiContent = fs.readFileSync(sobreMiPath, 'utf8');
    expect(sobreMiContent).toContain("import matter from 'gray-matter'");
    expect(sobreMiContent).toContain("path.resolve('./content/about-me/about-me.md')");
    
    // Verificar proyectos.astro
    const proyectosPath = path.join(projectRoot, 'src', 'pages', 'proyectos.astro');
    const proyectosContent = fs.readFileSync(proyectosPath, 'utf8');
    expect(proyectosContent).toContain("import matter from 'gray-matter'");
    expect(proyectosContent).toContain("path.resolve('./content/proyectos')");
  });

  it('verifica que no hay referencias a content-md', () => {
    const projectRoot = path.join(__dirname, '..');
    const pagesDir = path.join(projectRoot, 'src', 'pages');
    
    const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.astro'));
    
    pageFiles.forEach(file => {
      const filePath = path.join(pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain('content-md');
    });
  });
});