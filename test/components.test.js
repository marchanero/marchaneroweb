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
    
    // Verificar componentes específicos existentes
    expect(fs.existsSync(path.join(componentsDir, 'RecentPublications.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'ThemeToggle.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'ScholarMetrics.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'SignalTrace.astro'))).toBe(true);
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

  it('verifica el componente de firma SignalTrace', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentsDir = path.join(projectRoot, 'src', 'components');

    const signalTracePath = path.join(componentsDir, 'SignalTrace.astro');
    expect(fs.existsSync(signalTracePath)).toBe(true);

    const content = fs.readFileSync(signalTracePath, 'utf8');
    expect(content).toContain('variant');
    expect(content).toContain('ecg');
    expect(content).toContain('eda');
  });

  it('verifica archivos de documentación de mejoras', () => {
    const projectRoot = path.join(__dirname, '..');
    
    // Verificar que existe el plan de mejoras
    expect(fs.existsSync(path.join(projectRoot, 'PLAN_MEJORAS_PRIORITARIAS.md'))).toBe(true);
    
    // Verificar que existe la documentación de mejoras implementadas
    expect(fs.existsSync(path.join(projectRoot, 'docs', 'MEJORAS-IMPLEMENTADAS.md'))).toBe(true);
    
    // Verificar checklist final
    expect(fs.existsSync(path.join(projectRoot, 'CHECKLIST-FINAL.md'))).toBe(true);
  });

  it('verifica estructura de scripts y configuración', () => {
    const projectRoot = path.join(__dirname, '..');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verificar scripts importantes
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('scholar:scrape');
    expect(packageJson.scripts).toHaveProperty('scholar:verify');
  });
});
