import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Componentes', () => {
  it('verifica que existen los componentes principales', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentsDir = path.join(projectRoot, 'src', 'components');
    
    // Verificar que existe el directorio de componentes
    expect(fs.existsSync(componentsDir)).toBe(true);
    
    // Verificar componentes específicos
    expect(fs.existsSync(path.join(componentsDir, 'RecentPublications.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'ThemeToggle.astro'))).toBe(true);
  });

  it('verifica la estructura del componente RecentPublications', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentPath = path.join(projectRoot, 'src', 'components', 'RecentPublications.astro');
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar que el componente contiene elementos esperados
    expect(content).toContain('publications');
    expect(content).toContain('limit');
    expect(content).toContain('showTitle');
  });

  it('verifica que existen las páginas principales', () => {
    const projectRoot = path.join(__dirname, '..');
    const pagesDir = path.join(projectRoot, 'src', 'pages');
    
    const expectedPages = [
      'index.astro',
      'sobre-mi.astro',
      'proyectos.astro',
      'publicaciones.astro',
      'contacto.astro',
      'cv.astro',
      'asignaturas.astro'
    ];

    expectedPages.forEach(page => {
      expect(fs.existsSync(path.join(pagesDir, page))).toBe(true);
    });
  });

  it('verifica la estructura del layout principal', () => {
    const projectRoot = path.join(__dirname, '..');
    const layoutPath = path.join(projectRoot, 'src', 'layouts', 'Layout.astro');
    
    expect(fs.existsSync(layoutPath)).toBe(true);
    
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Verificar elementos básicos del layout
    expect(content).toContain('<html');
    expect(content).toContain('<head>');
    expect(content).toContain('<body');
    expect(content).toContain('title');
  });

  it('verifica la configuración de Astro', () => {
    const projectRoot = path.join(__dirname, '..');
    const configPath = path.join(projectRoot, 'astro.config.mjs');
    
    expect(fs.existsSync(configPath)).toBe(true);
    
    const content = fs.readFileSync(configPath, 'utf8');
    
    // Verificar que incluye las integraciones esperadas
    expect(content).toContain('tailwind');
  });
});
