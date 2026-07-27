import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sistema de diseño "traza de señal" y movimiento', () => {
  let projectRoot;
  let globalCss;
  let layoutContent;
  let signalTraceContent;
  let indexContent;

  beforeAll(() => {
    projectRoot = path.join(__dirname, '..');

    globalCss = fs.readFileSync(path.join(projectRoot, 'src', 'styles', 'global.css'), 'utf8');
    layoutContent = fs.readFileSync(path.join(projectRoot, 'src', 'layouts', 'Layout.astro'), 'utf8');
    signalTraceContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'SignalTrace.astro'), 'utf8');
    indexContent = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'index.astro'), 'utf8');
  });

  describe('Componente de firma SignalTrace', () => {
    it('soporta las variantes ecg y eda', () => {
      expect(signalTraceContent).toContain("variant === 'ecg'");
      expect(signalTraceContent).toContain('edaPath');
      expect(signalTraceContent).toContain('ecgPath');
    });

    it('usa pathLength para normalizar el trazado y animarlo con stroke-dashoffset', () => {
      expect(signalTraceContent).toContain('pathLength');
      expect(signalTraceContent).toContain('stroke-dashoffset');
    });

    it('respeta prefers-reduced-motion', () => {
      expect(signalTraceContent).toContain('@media (prefers-reduced-motion: reduce)');
    });
  });

  describe('Revelado al hacer scroll', () => {
    it('Layout observa los elementos .reveal y .signal-trace con IntersectionObserver', () => {
      expect(layoutContent).toContain('IntersectionObserver');
      expect(layoutContent).toContain("'.reveal, .signal-trace'");
    });

    it('la clase .reveal está definida como utilidad global', () => {
      expect(globalCss).toContain('.reveal');
      expect(globalCss).toContain('is-visible');
    });
  });

  describe('Accesibilidad del movimiento', () => {
    it('el CSS global respeta reduced motion', () => {
      expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)');
      expect(globalCss).toContain('animation-duration: 0.01ms !important');
    });
  });

  describe('Regresión: sin restos del sistema anterior', () => {
    it('no quedan referencias al antiguo sistema de partículas', () => {
      [indexContent, globalCss, layoutContent].forEach((content) => {
        expect(content).not.toContain('floating-particles');
        expect(content).not.toContain('createParticles');
      });
    });

    it('no quedan gradientes/efectos de la paleta indigo genérica anterior', () => {
      expect(indexContent).not.toContain('hero-gradient');
      expect(indexContent).not.toContain('btn-enhanced');
      expect(indexContent).not.toContain('profile-glow');
      expect(indexContent).not.toMatch(/from-indigo-\d{3}/);
    });
  });
});
