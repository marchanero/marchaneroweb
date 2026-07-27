import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Responsive Design', () => {
  let indexContent;
  let sobreMiContent;
  let proyectosContent;
  let publicacionesContent;
  let contactoContent;
  let layoutContent;

  beforeAll(() => {
    const projectRoot = path.join(__dirname, '..');

    indexContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'index.astro'), 'utf8');
    sobreMiContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'sobre-mi.astro'), 'utf8');
    proyectosContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'proyectos.astro'), 'utf8');
    publicacionesContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'publicaciones.astro'), 'utf8');
    contactoContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'contacto.astro'), 'utf8');
    layoutContent = fs.readFileSync(path.join(projectRoot, 'src', 'layouts', 'Layout.astro'), 'utf8');
  });

  describe('Clases Responsive de Tailwind', () => {
    it('verifica el uso consistente de breakpoints', () => {
      const pages = [
        { name: 'index', content: indexContent },
        { name: 'sobre-mi', content: sobreMiContent },
        { name: 'proyectos', content: proyectosContent },
        { name: 'publicaciones', content: publicacionesContent },
        { name: 'contacto', content: contactoContent }
      ];

      pages.forEach(page => {
        expect(page.content.length).toBeGreaterThan(100);

        const hasSm = page.content.match(/sm:[\w-]+/);
        if (page.name === 'index' || page.name === 'proyectos' || page.name === 'publicaciones') {
          expect(hasSm).toBeTruthy();
        }

        const hasLg = page.content.match(/(lg|md):[\w-]+/);
        expect(hasLg).toBeTruthy();
      });
    });

    it('verifica spacing responsive consistente', () => {
      // La ritmía vertical se resuelve a nivel de sección (py-* responsive)
      // en lugar de duplicarse en cada margen individual.
      [indexContent, sobreMiContent, proyectosContent].forEach(content => {
        expect(content).toMatch(/py-\d+\s+sm:py-\d+/);
      });

      // Al menos una página usa además gap/mb responsive de grano fino
      const combined = indexContent + sobreMiContent + proyectosContent;
      expect(combined).toMatch(/mb-\d+\s+sm:mb-\d+/);
      expect(combined).toMatch(/gap-\d+\s+sm:gap-\d+/);
    });

    it('verifica tipografía responsive', () => {
      // Titular del hero con varios saltos de breakpoint
      expect(indexContent).toMatch(/text-5xl\s+sm:text-6xl\s+lg:text-7xl/);

      [sobreMiContent, proyectosContent, publicacionesContent].forEach(content => {
        expect(content).toMatch(/text-\w+\s+sm:text-\w+/);
      });
    });

    it('verifica grids responsive', () => {
      // Grid de líneas de investigación
      expect(indexContent).toContain('grid-cols-1 sm:grid-cols-2');

      // Grid de proyectos destacados
      expect(indexContent).toContain('grid-cols-1 md:grid-cols-2');

      // Grid principal (investigación + métricas)
      expect(indexContent).toContain('grid-cols-1 lg:grid-cols-3');

      expect(proyectosContent).toMatch(/grid-cols-\d+\s+(sm|md|lg):grid-cols-\d+/);
    });

    it('verifica flex layouts responsive', () => {
      const hasFlexDirection = indexContent.match(/flex-col\s+(sm|md|lg):flex-row/);
      expect(hasFlexDirection).toBeTruthy();
    });
  });

  describe('Contenedores y Anchos Máximos', () => {
    it('verifica el uso consistente de contenedores', () => {
      const maxWidthClasses = ['max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl'];

      [indexContent, proyectosContent, publicacionesContent].forEach(content => {
        const hasMaxWidth = maxWidthClasses.some(className => content.includes(className));
        expect(hasMaxWidth).toBeTruthy();
      });
    });

    it('verifica padding horizontal responsive en el layout compartido', () => {
      expect(layoutContent).toContain('px-4 sm:px-6 lg:px-8');
    });
  });

  describe('Imágenes Responsive', () => {
    it('verifica configuración responsive de imágenes', () => {
      expect(indexContent).toContain('w-56 sm:w-72');
      expect(indexContent).toContain('widths={[400, 800]}');
      expect(indexContent).toContain('sizes="(max-width: 768px) 100vw, 320px"');
    });
  });

  describe('Componentes Responsive', () => {
    it('verifica que las cards usan un componente compartido con relleno consistente', () => {
      // El sistema de diseño usa la clase .spec-card en todas las páginas
      [indexContent, proyectosContent, publicacionesContent, sobreMiContent].forEach(content => {
        expect(content).toContain('spec-card');
      });
    });

    it('verifica espaciado responsive entre secciones', () => {
      [indexContent, sobreMiContent, proyectosContent].forEach(content => {
        expect(content).toMatch(/py-\d+\s+sm:py-\d+/);
      });
    });

    it('verifica que los botones comparten estilo mediante la clase .btn', () => {
      [indexContent, proyectosContent, contactoContent].forEach(content => {
        expect(content).toMatch(/class="btn btn-(primary|outline|secondary)/);
      });
    });
  });

  describe('Movimiento y accesibilidad', () => {
    it('verifica soporte de prefers-reduced-motion centralizado', () => {
      const projectRoot = path.join(__dirname, '..');
      const globalCss = fs.readFileSync(path.join(projectRoot, 'src', 'styles', 'global.css'), 'utf8');
      expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)');
    });
  });

  describe('Navegación Responsive', () => {
    it('verifica que el hero se adapta a móviles', () => {
      expect(indexContent).toContain('flex-col lg:flex-row');
      expect(indexContent).toContain('text-center lg:text-left');
    });

    it('verifica que la navegación alterna entre menú de escritorio y móvil', () => {
      expect(layoutContent).toContain('hidden md:flex');
      expect(layoutContent).toContain('md:hidden');
      expect(layoutContent).toContain('mobile-menu');
    });
  });
});
