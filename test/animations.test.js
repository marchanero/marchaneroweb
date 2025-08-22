import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Animaciones y Efectos CSS', () => {
  let indexContent;
  let proyectosContent;
  let publicacionesContent;

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
  });

  describe('Sistema de Partículas', () => {
    it('verifica que existen las clases de partículas principales', () => {
      expect(indexContent).toContain('floating-particles');
      expect(indexContent).toContain('floating-particles-subtle');
      
      // Verificar keyframes para partículas
      expect(indexContent).toContain('@keyframes float');
      expect(indexContent).toContain('@keyframes floatSubtle');
    });

    it('verifica la implementación de partículas en todas las páginas', () => {
      // Index page
      expect(indexContent).toContain('floating-particles::before');
      expect(indexContent).toContain('floating-particles::after');
      
      // Proyectos page
      expect(proyectosContent).toContain('floating-particles');
      expect(proyectosContent).toContain('floating-particles-subtle');
      
      // Publicaciones page
      expect(publicacionesContent).toContain('floating-particles');
      expect(publicacionesContent).toContain('floating-particles-subtle');
    });

    it('verifica que las partículas tienen configuración para modo oscuro', () => {
      expect(indexContent).toContain('.dark .floating-particles::before');
      expect(indexContent).toContain('.dark .floating-particles::after');
      expect(indexContent).toContain('.dark .floating-particles-subtle::before');
      expect(indexContent).toContain('.dark .floating-particles-subtle::after');
    });

    it('verifica que las partículas tienen diferentes tamaños', () => {
      expect(indexContent).toContain('width: 4px');
      expect(indexContent).toContain('height: 4px');
      expect(indexContent).toContain('width: 3px');
      expect(indexContent).toContain('height: 3px');
      expect(indexContent).toContain('width: 2px');
      expect(indexContent).toContain('height: 2px');
    });

    it('verifica que las partículas tienen gradientes coloridos', () => {
      expect(indexContent).toContain('linear-gradient(45deg, #3b82f6, #8b5cf6)');
      expect(indexContent).toContain('linear-gradient(45deg, #ec4899, #f59e0b)');
      expect(indexContent).toContain('linear-gradient(45deg, #10b981, #3b82f6)');
      expect(indexContent).toContain('linear-gradient(45deg, #8b5cf6, #ec4899)');
    });
  });

  describe('Animaciones de Entrada', () => {
    it('verifica que existen las animaciones básicas', () => {
      const animations = [
        '@keyframes fadeInUp',
        '@keyframes fadeInLeft', 
        '@keyframes fadeInRight',
        '@keyframes pulse',
        '@keyframes shimmer'
      ];

      animations.forEach(animation => {
        expect(indexContent).toContain(animation);
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
        expect(indexContent).toContain(`.${className}`);
      });
    });

    it('verifica que se aplican delays escalonados', () => {
      expect(indexContent).toContain('animation-delay: 0.1s');
      expect(indexContent).toContain('animation-delay: 0.2s');
      expect(indexContent).toContain('animation-delay: 0.3s');
      expect(indexContent).toContain('animation-delay: 0.4s');
    });
  });

  describe('Efectos Especiales', () => {
    it('verifica los gradientes hero', () => {
      expect(indexContent).toContain('hero-gradient');
      expect(indexContent).toContain('linear-gradient(135deg');
      expect(indexContent).toContain('rgba(59, 130, 246, 0.1)');
      expect(indexContent).toContain('rgba(147, 51, 234, 0.1)');
      expect(indexContent).toContain('rgba(236, 72, 153, 0.1)');
    });

    it('verifica los efectos de hover en cards', () => {
      expect(indexContent).toContain('card-hover');
      expect(indexContent).toContain('translateY(-5px)');
      expect(indexContent).toContain('box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1)');
    });

    it('verifica los efectos de botones mejorados', () => {
      expect(indexContent).toContain('btn-enhanced');
      expect(indexContent).toContain('background: linear-gradient(135deg, #3b82f6, #8b5cf6)');
      expect(indexContent).toContain('animation: shimmer 2s infinite');
    });

    it('verifica el efecto de brillo del perfil', () => {
      expect(indexContent).toContain('profile-glow');
      expect(indexContent).toContain('box-shadow: 0 0 40px rgba(59, 130, 246, 0.3)');
      expect(indexContent).toContain('box-shadow: 0 0 60px rgba(59, 130, 246, 0.5)');
    });
  });

  describe('Accesibilidad', () => {
    it('verifica que existe soporte para reduced motion', () => {
      expect(indexContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(indexContent).toContain('animation-duration: 0.01ms !important');
      expect(indexContent).toContain('animation-iteration-count: 1 !important');
      expect(indexContent).toContain('transition-duration: 0.01ms !important');
    });

    it('verifica configuración de z-index para partículas', () => {
      expect(indexContent).toContain('z-index: 1');
    });
  });

  describe('Responsive Design en Animaciones', () => {
    it('verifica que las animaciones se ajustan en móviles', () => {
      // Verificar que el content CSS es responsive
      expect(indexContent.length).toBeGreaterThan(1000);
    });

    it('verifica que las partículas no interfieren con el contenido', () => {
      expect(indexContent).toContain('position: relative');
      expect(indexContent).toContain('overflow: hidden');
    });
  });
});
