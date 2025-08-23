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
    expect(fs.existsSync(path.join(componentsDir, 'ProyectoCard.astro'))).toBe(true);
    
    // Verificar nuevos componentes avanzados
    expect(fs.existsSync(path.join(componentsDir, 'LazyImage.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'SchemaMarkup.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'Analytics.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'ShareButtons.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'ReadingProgress.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'AcademicSearch.astro'))).toBe(true);
    expect(fs.existsSync(path.join(componentsDir, 'AcademicComments.astro'))).toBe(true);
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

  it('verifica la estructura de componentes avanzados', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentsDir = path.join(projectRoot, 'src', 'components');
    
    // Verificar componente LazyImage
    const lazyImagePath = path.join(componentsDir, 'LazyImage.astro');
    if (fs.existsSync(lazyImagePath)) {
      const content = fs.readFileSync(lazyImagePath, 'utf8');
      expect(content).toContain('loading');
      expect(content).toContain('decoding');
      expect(content).toContain('view-transition-name');
    }

    // Verificar componente SchemaMarkup
    const schemaMarkupPath = path.join(componentsDir, 'SchemaMarkup.astro');
    if (fs.existsSync(schemaMarkupPath)) {
      const content = fs.readFileSync(schemaMarkupPath, 'utf8');
      expect(content).toContain('application/ld+json');
      expect(content).toContain('@context');
      expect(content).toContain('schema.org');
    }

    // Verificar componente Analytics
    const analyticsPath = path.join(componentsDir, 'Analytics.astro');
    if (fs.existsSync(analyticsPath)) {
      const content = fs.readFileSync(analyticsPath, 'utf8');
      expect(content).toContain('plausible');
      expect(content).toContain('gtag');
    }
  });

  it('verifica componentes de UX avanzados', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentsDir = path.join(projectRoot, 'src', 'components');

    // Verificar componente ShareButtons
    const shareButtonsPath = path.join(componentsDir, 'ShareButtons.astro');
    if (fs.existsSync(shareButtonsPath)) {
      const content = fs.readFileSync(shareButtonsPath, 'utf8');
      expect(content).toContain('twitter');
      expect(content).toContain('linkedin');
      expect(content).toContain('mendeley');
      expect(content).toContain('researchgate');
    }

    // Verificar componente ReadingProgress
    const readingProgressPath = path.join(componentsDir, 'ReadingProgress.astro');
    if (fs.existsSync(readingProgressPath)) {
      const content = fs.readFileSync(readingProgressPath, 'utf8');
      expect(content).toContain('reading-progress');
      expect(content).toContain('progress-bar');
      expect(content).toContain('scroll');
    }

    // Verificar componente AcademicSearch
    const academicSearchPath = path.join(componentsDir, 'AcademicSearch.astro');
    if (fs.existsSync(academicSearchPath)) {
      const content = fs.readFileSync(academicSearchPath, 'utf8');
      expect(content).toContain('search-container');
      expect(content).toContain('search-results');
      expect(content).toContain('publications');
      expect(content).toContain('projects');
    }
  });

  it('verifica componente de comentarios académicos', () => {
    const projectRoot = path.join(__dirname, '..');
    const componentsDir = path.join(projectRoot, 'src', 'components');
    
    const academicCommentsPath = path.join(componentsDir, 'AcademicComments.astro');
    if (fs.existsSync(academicCommentsPath)) {
      const content = fs.readFileSync(academicCommentsPath, 'utf8');
      expect(content).toContain('academic-comments');
      expect(content).toContain('comment-form');
      expect(content).toContain('comment-guidelines');
      expect(content).toContain('markdown');
    }
  });

  it('verifica el sistema de partículas dinámico mejorado', () => {
    const projectRoot = path.join(__dirname, '..');
    const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
    
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Verificar sistema híbrido CSS + JavaScript
    expect(content).toContain('.floating-particles');
    expect(content).toContain('createParticles');
    expect(content).toContain('floating-particles');
    
    // Verificar múltiples animaciones
    expect(content).toContain('float1');
    expect(content).toContain('float2');
    expect(content).toContain('float3');
    expect(content).toContain('float4');
    expect(content).toContain('float5');
    
    // Verificar sistema de colores múltiples (6 colores principales)
    expect(content).toContain('#3b82f6');
    expect(content).toContain('#8b5cf6');
    expect(content).toContain('#ec4899');
    expect(content).toContain('#10b981');
    expect(content).toContain('#f59e0b');
    expect(content).toContain('#06b6d4'); // Cyan
    
    // Verificar efectos interactivos
    expect(content).toContain('setInterval(createParticles');
    expect(content).toContain('hover');
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
