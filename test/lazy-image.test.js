import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('LazyImage Component', () => {
  let componentContent;
  
  beforeAll(() => {
    const projectRoot = path.join(__dirname, '..');
    const componentPath = path.join(projectRoot, 'src', 'components', 'LazyImage.astro');
    componentContent = fs.readFileSync(componentPath, 'utf8');
  });

  describe('Component Structure', () => {
    it('contiene las props esperadas', () => {
      expect(componentContent).toContain('interface Props');
      expect(componentContent).toContain('src: string');
      expect(componentContent).toContain('alt: string');
      expect(componentContent).toContain('placeholder?:');
      expect(componentContent).toContain('fallbackSrc?:');
      expect(componentContent).toContain('progressive?:');
    });

    it('incluye soporte para formatos modernos', () => {
      expect(componentContent).toContain('avif');
      expect(componentContent).toContain('webp');
      expect(componentContent).toContain('<source');
      expect(componentContent).toContain('<picture');
    });

    it('tiene manejo de estados de carga', () => {
      expect(componentContent).toContain('loading-overlay');
      expect(componentContent).toContain('error-state');
      expect(componentContent).toContain('placeholder');
      expect(componentContent).toContain('skeleton-placeholder');
      expect(componentContent).toContain('blur-placeholder');
    });
  });

  describe('Accessibility Features', () => {
    it('incluye consideraciones de accesibilidad', () => {
      expect(componentContent).toContain('prefers-reduced-motion');
      expect(componentContent).toContain('prefers-contrast');
      expect(componentContent).toContain('currentColor'); // Alto contraste
      expect(componentContent).toContain('Error al cargar imagen'); // Texto descriptivo
    });

    it('tiene textos alt apropiados', () => {
      expect(componentContent).toContain('alt={alt}');
      expect(componentContent).toContain('Error al cargar imagen');
    });
  });

  describe('Performance Optimizations', () => {
    it('usa IntersectionObserver', () => {
      expect(componentContent).toContain('IntersectionObserver');
      expect(componentContent).toContain('rootMargin');
      expect(componentContent).toContain('threshold');
    });

    it('implementa lazy loading', () => {
      expect(componentContent).toContain("loading={priority ? 'eager' : loading}");
      expect(componentContent).toContain('observer.observe');
    });

    it('tiene manejo de errores y fallbacks', () => {
      expect(componentContent).toContain('onImageError');
      expect(componentContent).toContain('useFallback');
      expect(componentContent).toContain('setTimeout');
    });
  });

  describe('Modern Image Formats', () => {
    it('genera sources optimizadas', () => {
      expect(componentContent).toContain('getOptimizedSources');
      expect(componentContent).toContain('.avif');
      expect(componentContent).toContain('.webp');
    });

    it('incluye type attributes correctos', () => {
      expect(componentContent).toContain('type="image/avif"');
      expect(componentContent).toContain('type="image/webp"');
    });
  });

  describe('Progressive Enhancement', () => {
    it('tiene carga progresiva', () => {
      expect(componentContent).toContain('progressive');
      expect(componentContent).toContain('decoding={progressive ? \'async\' : \'sync\'}');
    });

    it('maneja diferentes tipos de placeholder', () => {
      expect(componentContent).toContain('blur-placeholder');
      expect(componentContent).toContain('skeleton-placeholder');
      expect(componentContent).toContain('color-placeholder');
    });
  });

  describe('JavaScript Functionality', () => {
    it('incluye utilidades JavaScript', () => {
      expect(componentContent).toContain('window.lazyImageUtils');
      expect(componentContent).toContain('reloadImage');
      expect(componentContent).toContain('preloadImage');
    });

    it('tiene event handling', () => {
      expect(componentContent).toContain('addEventListener');
      expect(componentContent).toContain('dispatchEvent');
      expect(componentContent).toContain('CustomEvent');
    });

    it('maneja el ciclo de vida de la imagen', () => {
      expect(componentContent).toContain('onImageLoad');
      expect(componentContent).toContain('onImageError');
      expect(componentContent).toContain('imageLoaded');
    });
  });

  describe('CSS Styles', () => {
    it('incluye animaciones', () => {
      expect(componentContent).toContain('@keyframes');
      expect(componentContent).toContain('shimmer');
      expect(componentContent).toContain('fadeInScale');
    });

    it('tiene estados responsivos', () => {
      expect(componentContent).toContain('@media');
      expect(componentContent).toContain('max-width');
      expect(componentContent).toContain('min-height');
    });

    it('maneja el modo oscuro', () => {
      expect(componentContent).toContain('.dark');
      expect(componentContent).toContain('dark:bg-');
    });
  });
});

describe('LazyImage Files', () => {
  it('placeholder SVG existe', () => {
    const projectRoot = path.join(__dirname, '..');
    const placeholderPath = path.join(projectRoot, 'public', 'images', 'placeholder.svg');
    expect(fs.existsSync(placeholderPath)).toBe(true);
    
    const placeholderContent = fs.readFileSync(placeholderPath, 'utf8');
    expect(placeholderContent).toContain('<svg');
    expect(placeholderContent).toContain('viewBox');
  });

  it('documentación existe', () => {
    const projectRoot = path.join(__dirname, '..');
    const docsPath = path.join(projectRoot, 'docs', 'LAZY-IMAGE-COMPONENT.md');
    expect(fs.existsSync(docsPath)).toBe(true);
    
    const docsContent = fs.readFileSync(docsPath, 'utf8');
    expect(docsContent).toContain('LazyImage Component');
    expect(docsContent).toContain('## Características Principales');
    expect(docsContent).toContain('## Ejemplos de Uso');
  });
});
