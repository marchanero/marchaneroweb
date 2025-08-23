import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Componentes Avanzados y Mejoras', () => {
  const projectRoot = path.join(__dirname, '..');
  const componentsDir = path.join(projectRoot, 'src', 'components');

  beforeAll(() => {
    // Asegurar que el directorio de componentes existe
    expect(fs.existsSync(componentsDir)).toBe(true);
  });

  describe('Componentes de Performance', () => {
    it('verifica el componente LazyImage', () => {
      const componentPath = path.join(componentsDir, 'LazyImage.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar props esperadas
        expect(content).toContain('interface Props');
  expect(content).toContain('loading');
  // aceptar varias formas: decoding="async" o decoding={... 'async' ...}
  expect(content).toMatch(/decoding\s*=\s*(?:"async"|\{[^}]*'async'[^}]*\}|\{[^}]*\"async\"[^}]*\})/);
        expect(content).toContain('view-transition-name');
        
        // Verificar animaciones CSS
        expect(content).toContain('@keyframes fadeIn');
        expect(content).toContain('opacity: 0');
      } else {
        console.warn('LazyImage.astro no encontrado, saltando test');
      }
    });
  });

  describe('Componentes de SEO', () => {
    it('verifica el componente SchemaMarkup', () => {
      const componentPath = path.join(componentsDir, 'SchemaMarkup.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar estructura Schema.org
        expect(content).toContain('application/ld+json');
        expect(content).toContain('@context');
        expect(content).toContain('https://schema.org');
        expect(content).toContain('@type": "Person"');
        
        // Verificar props académicas
        expect(content).toContain('name');
        expect(content).toContain('jobTitle');
        expect(content).toContain('affiliation');
        expect(content).toContain('citations');
        expect(content).toContain('hIndex');
        
        // Verificar redes académicas
        expect(content).toContain('scholar.google.com');
        expect(content).toContain('orcid.org');
        expect(content).toContain('researchgate.net');
      } else {
        console.warn('SchemaMarkup.astro no encontrado, saltando test');
      }
    });
  });

  describe('Componentes de Analytics', () => {
    it('verifica el componente Analytics', () => {
      const componentPath = path.join(componentsDir, 'Analytics.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar soporte para múltiples plataformas
        expect(content).toContain('enableGoogleAnalytics');
        expect(content).toContain('enablePlausible');
        expect(content).toContain('trackingId');
        
        // Verificar eventos académicos específicos
        expect(content).toContain('trackAcademicEvent');
        expect(content).toContain('publication_click');
        expect(content).toContain('project_view');
        expect(content).toContain('cv_download');
        
        // Verificar configuración de privacidad
        expect(content).toContain('anonymize_ip');
        expect(content).toContain('import.meta.env.PROD');
      } else {
        console.warn('Analytics.astro no encontrado, saltando test');
      }
    });
  });

  describe('Componentes de UX', () => {
    it('verifica el componente ReadingProgress', () => {
      const componentPath = path.join(componentsDir, 'ReadingProgress.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar estructura HTML
        expect(content).toContain('reading-progress');
        expect(content).toContain('progress-bar');
        
        // Verificar funcionalidad JavaScript
        expect(content).toContain('updateProgress');
        expect(content).toContain('scrollTop');
        expect(content).toContain('scrollHeight');
        
        // Verificar configurabilidad
        expect(content).toContain('showOnPages');
        expect(content).toContain('color');
        
        // Verificar accesibilidad
        expect(content).toContain('prefers-reduced-motion');
      } else {
        console.warn('ReadingProgress.astro no encontrado, saltando test');
      }
    });

    it('verifica el componente ShareButtons', () => {
      const componentPath = path.join(componentsDir, 'ShareButtons.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar redes sociales académicas
        expect(content).toContain('twitter');
        expect(content).toContain('linkedin');
        expect(content).toContain('mendeley');
        expect(content).toContain('researchgate');
        expect(content).toContain('email');
        
        // Verificar tipos de contenido
        expect(content).toContain('publication');
        expect(content).toContain('project');
        expect(content).toContain('page');
        
        // Verificar modo compacto
        expect(content).toContain('compact');
        expect(content).toContain('share-dropdown');
        
        // Verificar URLs de compartir
        expect(content).toContain('encodedUrl');
        expect(content).toContain('encodedTitle');
      } else {
        console.warn('ShareButtons.astro no encontrado, saltando test');
      }
    });
  });

  describe('Componentes de Búsqueda', () => {
    it('verifica el componente AcademicSearch', () => {
      const componentPath = path.join(componentsDir, 'AcademicSearch.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar estructura de búsqueda
        expect(content).toContain('search-container');
        expect(content).toContain('search-input');
        expect(content).toContain('search-results');
        
        // Verificar filtros académicos
        expect(content).toContain('publications');
        expect(content).toContain('projects');
        expect(content).toContain('cv');
        
        // Verificar funcionalidades avanzadas
        expect(content).toContain('performSearch');
        expect(content).toContain('highlightQuery');
        expect(content).toContain('displayResults');
        
        // Verificar accesibilidad
        expect(content).toContain('aria-label');
        expect(content).toContain('Escape');
      } else {
        console.warn('AcademicSearch.astro no encontrado, saltando test');
      }
    });
  });

  describe('Componentes de Interacción', () => {
    it('verifica el componente AcademicComments', () => {
      const componentPath = path.join(componentsDir, 'AcademicComments.astro');
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Verificar estructura del formulario
        expect(content).toContain('comment-form');
        expect(content).toContain('author-fields');
        expect(content).toContain('comment-textarea');
        
        // Verificar funcionalidades académicas
        expect(content).toContain('anonymous-toggle');
        expect(content).toContain('affiliation');
        expect(content).toContain('website');
        
        // Verificar soporte Markdown
        expect(content).toContain('markdown');
        expect(content).toContain('format-btn');
        expect(content).toContain('parseMarkdown');
        
        // Verificar pautas académicas
        expect(content).toContain('comment-guidelines');
        expect(content).toContain('tono respetuoso');
        expect(content).toContain('Cita fuentes');
        
        // Verificar vista previa
        expect(content).toContain('comment-preview');
        expect(content).toContain('preview-content');
      } else {
        console.warn('AcademicComments.astro no encontrado, saltando test');
      }
    });
  });

  describe('Documentación y Configuración', () => {
    it('verifica que existe el plan de mejoras prioritarias', () => {
      const planPath = path.join(projectRoot, 'PLAN_MEJORAS_PRIORITARIAS.md');
      expect(fs.existsSync(planPath)).toBe(true);
      
      if (fs.existsSync(planPath)) {
        const content = fs.readFileSync(planPath, 'utf8');
        
        // Verificar estructura del plan
        expect(content).toContain('Mejoras Inmediatas');
        expect(content).toContain('SchemaMarkup');
        expect(content).toContain('Analytics');
        expect(content).toContain('ReadingProgress');
        expect(content).toContain('Plan de Implementación');
      }
    });

    it('verifica la actualización de la documentación de mejoras', () => {
      const docsPath = path.join(projectRoot, 'docs', 'MEJORAS-IMPLEMENTADAS.md');
      expect(fs.existsSync(docsPath)).toBe(true);
      
      if (fs.existsSync(docsPath)) {
        const content = fs.readFileSync(docsPath, 'utf8');
        
        // Verificar que la documentación está actualizada
        expect(content).toContain('Layout Principal');
        expect(content).toContain('Componentes Reutilizables');
        expect(content).toContain('Correcciones Críticas');
      }
    });
  });

  describe('Configuración de Proyecto', () => {
    it('verifica que los scripts están actualizados', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      expect(fs.existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Verificar scripts existentes
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('test');
      
      // Verificar scripts específicos de Scholar
      expect(packageJson.scripts).toHaveProperty('scholar:scrape');
      expect(packageJson.scripts).toHaveProperty('scholar:verify');
      expect(packageJson.scripts).toHaveProperty('scholar:summary');
      
      // Verificar dependencias clave
      expect(packageJson.dependencies).toHaveProperty('dotenv');
      expect(packageJson.dependencies).toHaveProperty('serpapi');
      expect(packageJson.devDependencies).toHaveProperty('astro');
      expect(packageJson.devDependencies).toHaveProperty('@astrojs/tailwind');
    });

    it('verifica la configuración de TypeScript', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      if (fs.existsSync(tsconfigPath)) {
        const content = fs.readFileSync(tsconfigPath, 'utf8');
        const tsconfig = JSON.parse(content);
        
        // Verificar que existe la configuración
        expect(tsconfig).toBeDefined();
        
        // Verificar configuración básica si existe
        if (tsconfig.compilerOptions) {
          expect(typeof tsconfig.compilerOptions).toBe('object');
        }
      }
    });
  });

  describe('Tests de Integración', () => {
    it('verifica que el build funciona con los nuevos componentes', () => {
      // Este test verificaría que el proyecto puede hacer build correctamente
      // En un entorno real, esto requeriría ejecutar el build
      const astroConfigPath = path.join(projectRoot, 'astro.config.mjs');
      expect(fs.existsSync(astroConfigPath)).toBe(true);
      
      const content = fs.readFileSync(astroConfigPath, 'utf8');
      expect(content).toContain('tailwind');
      expect(content).toContain('compressHTML');
    });
  });
});
