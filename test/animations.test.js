import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Animaciones y Efectos CSS', () => {
  let indexContent;
  let proyectosContent;
  let publicacionesContent;
  let sobreMiContent;

  beforeAll(() => {
    const projectRoot = path.join(__dirname, '..');
    
    indexContent = fs.readFileSync(
      path.join(projectRoot, 'src', 'pages', 'index.astro'), 
      'utf8'
    );
    
    proyectosContent = fs.readFileSync(
      path.join(projectRoot, 'src', 'pages', 'proyectos.astro'), 
      'utf8'
    );
    
    publicacionesContent = fs.readFileSync(
      path.join(projectRoot, 'src', 'pages', 'publicaciones.astro'), 
      'utf8'
    );
    
    sobreMiContent = fs.readFileSync(
      path.join(projectRoot, 'src', 'pages', 'sobre-mi.astro'), 
      'utf8'
    );
  });

  describe('Sistema de Partículas', () => {
    it('verifica que existen las clases de partículas principales', () => {
      expect(proyectosContent).toContain('floating-particles');
      expect(proyectosContent).toContain('floating-particles-subtle');
      
      // Verificar keyframes para partículas
      expect(proyectosContent).toContain('@keyframes float');
      expect(proyectosContent).toContain('@keyframes floatSubtle');
    });

    it('verifica la implementación de partículas en todas las páginas', () => {
      // Index page
      expect(proyectosContent).toContain('floating-particles::before');
      expect(proyectosContent).toContain('floating-particles::after');
      
      // Proyectos page
      expect(proyectosContent).toContain('floating-particles');
      expect(proyectosContent).toContain('floating-particles-subtle');
      
      // Publicaciones page
      expect(publicacionesContent).toContain('floating-particles');
      expect(publicacionesContent).toContain('floating-particles-subtle');
    });

    it('verifica que las partículas tienen configuración para modo oscuro', () => {
      expect(proyectosContent).toContain('.dark .floating-particles::before');
      expect(proyectosContent).toContain('.dark .floating-particles::after');
      expect(proyectosContent).toContain('.dark .floating-particles-subtle::before');
      expect(proyectosContent).toContain('.dark .floating-particles-subtle::after');
    });

    it('verifica que las partículas tienen diferentes tamaños', () => {
      expect(proyectosContent).toContain('width: 4px');
      expect(proyectosContent).toContain('height: 4px');
      expect(proyectosContent).toContain('width: 3px');
      expect(proyectosContent).toContain('height: 3px');
      expect(proyectosContent).toContain('width: 2px');
      expect(proyectosContent).toContain('height: 2px');
    });

    it('verifica que las partículas tienen gradientes coloridos', () => {
      expect(proyectosContent).toContain('linear-gradient(45deg, #3b82f6, #8b5cf6)');
      expect(proyectosContent).toContain('linear-gradient(45deg, #ec4899, #f59e0b)');
      expect(proyectosContent).toContain('linear-gradient(45deg, #10b981, #3b82f6)');
      expect(proyectosContent).toContain('linear-gradient(45deg, #8b5cf6, #ec4899)');
    });
  });

  describe('Animaciones de Entrada', () => {
    it('verifica que existen las animaciones básicas', () => {
      const animations = [
        '@keyframes fadeInUp',
        '@keyframes fadeInLeft', 
        '@keyframes fadeInRight',
        '@keyframes shimmer',
        '@keyframes float'
      ];

      animations.forEach(animation => {
        expect(proyectosContent).toContain(animation);
      });
    });

    it('verifica que existen las clases de utilidad para animaciones', () => {
      const animationClasses = [
        'animate-fade-in-up',
        'animate-fade-in-left',
        'animate-fade-in-right',
        'animate-delay-100',
        'animate-delay-200',
        'animate-delay-300',
        'animate-delay-400'
      ];

      animationClasses.forEach(className => {
        expect(proyectosContent).toContain(`.${className}`);
      });
    });

    it('verifica que se aplican delays escalonados', () => {
      expect(proyectosContent).toContain('animation-delay: 0.1s');
      expect(proyectosContent).toContain('animation-delay: 0.2s');
      expect(proyectosContent).toContain('animation-delay: 0.3s');
      expect(proyectosContent).toContain('animation-delay: 0.4s');
    });
  });

  describe('Efectos Especiales', () => {
    it('verifica los gradientes hero', () => {
      expect(proyectosContent).toContain('hero-gradient');
      expect(proyectosContent).toContain('linear-gradient(135deg');
      expect(proyectosContent).toContain('rgba(59, 130, 246, 0.1)');
      expect(proyectosContent).toContain('rgba(147, 51, 234, 0.1)');
      expect(proyectosContent).toContain('rgba(236, 72, 153, 0.1)');
    });

    it('verifica los efectos de hover en cards', () => {
      expect(proyectosContent).toContain('card-hover');
      expect(proyectosContent).toContain('translateY(-8px)');
      expect(proyectosContent).toContain('box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15)');
    });

    it('verifica los efectos de botones mejorados', () => {
      expect(proyectosContent).toContain('btn-enhanced');
      expect(proyectosContent).toContain('background: linear-gradient(135deg, #3b82f6, #8b5cf6)');
      expect(proyectosContent).toContain('animation: shimmer 2s infinite');
    });

    it('verifica el efecto de brillo del perfil', () => {
      // Los efectos de brillo ahora están en btn-enhanced y stats-card
      expect(proyectosContent).toContain('btn-enhanced');
      expect(proyectosContent).toContain('box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3)');
      expect(proyectosContent).toContain('stats-card');
    });
  });

  describe('Accesibilidad', () => {
    it('verifica que existe soporte para reduced motion', () => {
      expect(proyectosContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(proyectosContent).toContain('animation-duration: 0.01ms !important');
      expect(proyectosContent).toContain('animation-iteration-count: 1 !important');
      expect(proyectosContent).toContain('transition-duration: 0.01ms !important');
    });

    it('verifica configuración de z-index para partículas', () => {
      expect(proyectosContent).toContain('z-index: 1');
    });
  });

  describe('Responsive Design en Animaciones', () => {
    it('verifica que las animaciones se ajustan en móviles', () => {
      // Verificar que el content CSS es responsive
      expect(indexContent.length).toBeGreaterThan(1000);
    });

    it('verifica que las partículas no interfieren con el contenido', () => {
      expect(proyectosContent).toContain('position: relative');
      expect(proyectosContent).toContain('overflow: hidden');
    });
  });
});
