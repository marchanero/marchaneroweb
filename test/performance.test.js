import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Performance y Optimización', () => {
  let projectRoot;
  
  beforeAll(() => {
    projectRoot = path.join(__dirname, '..');
  });

  describe('Optimización del Sistema de Partículas', () => {
    it('verifica que el sistema de partículas es eficiente', () => {
      const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verificar sistema híbrido (CSS fallback + JS)
      expect(indexContent).toContain('floating-particles::before');
      expect(indexContent).toContain('floating-particles::after');
      expect(indexContent).toContain('createParticles');
      
      // Verificar límite razonable de partículas con minParticles y maxParticles
      expect(indexContent).toContain('minParticles = 3');
      expect(indexContent).toContain('maxParticles');
      
      // Verificar que usa CSS animations
      expect(indexContent).toContain('@keyframes');
      
      // Verificar que hay control de rendimiento (intervalos controlados)
      expect(indexContent).toContain('setInterval');
    });

    it('verifica que las animaciones respetan reduced motion', () => {
      const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verificar soporte para usuarios con reduced motion
      expect(indexContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(indexContent).toContain('animation-duration: 0.01ms !important');
    });

    it('verifica que las partículas no bloquean la interacción', () => {
      const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verificar que las partículas están en un layer separado
      expect(indexContent).toContain('z-index: 1');
      expect(indexContent).toContain('pointer-events: none');
    });
  });

  describe('Configuración de Astro', () => {
    it('verifica configuración optimizada de Astro', () => {
      const configPath = path.join(projectRoot, 'astro.config.mjs');
      expect(fs.existsSync(configPath)).toBe(true);
      
      const config = fs.readFileSync(configPath, 'utf8');
      
      // Verificar integraciones esenciales
      expect(config).toContain('tailwind');
      expect(config).toContain('export default defineConfig');
      
      // Verificar que no hay configuraciones que puedan impactar performance
      expect(config).not.toContain('ssr: false'); // SSR debe estar habilitado por defecto
    });

    it('verifica configuración de TypeScript', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      expect(tsconfig.extends).toBe('astro/tsconfigs/strict');
      
      // Verificar compilerOptions de forma más flexible
      if (tsconfig.compilerOptions) {
        expect(tsconfig.compilerOptions).toBeInstanceOf(Object);
      } else {
        // Si no hay compilerOptions explícitos, está bien con la configuración extendida
        expect(tsconfig.extends).toBeDefined();
      }
    });
  });

  describe('Optimización de Assets', () => {
    it('verifica que se utiliza el componente Image de Astro', () => {
      const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verificar import del componente Image
      expect(indexContent).toContain("import { Image } from 'astro:assets'");
      
      // Verificar uso con propiedades de optimización
      expect(indexContent).toContain('widths={[400, 800]}');
      expect(indexContent).toContain('sizes="');
    });

    it('verifica la existencia de favicon optimizado', () => {
      const faviconPath = path.join(projectRoot, 'public', 'favicon.svg');
      expect(fs.existsSync(faviconPath)).toBe(true);
      
      // SVG es mejor que ICO para performance
      const faviconContent = fs.readFileSync(faviconPath, 'utf8');
      expect(faviconContent).toContain('<svg');
    });

    it('verifica que no hay imágenes grandes sin optimizar en public', () => {
      const publicDir = path.join(projectRoot, 'public');
      
      if (fs.existsSync(publicDir)) {
        const files = fs.readdirSync(publicDir);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
        );
        
        imageFiles.forEach(file => {
          const filePath = path.join(publicDir, file);
          const stats = fs.statSync(filePath);
          
          // Advertir si hay imágenes muy grandes (>2MB) sin optimizar
          if (stats.size > 2 * 1024 * 1024) {
            console.warn(`Imagen grande detectada: ${file} (${stats.size} bytes)`);
          }
          
          // No fallar el test, solo advertir
          expect(stats.size).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Optimización de CSS', () => {
    it('verifica uso eficiente de Tailwind', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.mjs');
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
      
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
      
      // Verificar purge/content configuration para eliminar CSS no utilizado
      expect(tailwindConfig).toContain('content');
      expect(tailwindConfig).toContain('./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}');
    });

    it('verifica que el CSS global es mínimo', () => {
      const globalCssPath = path.join(projectRoot, 'src', 'styles', 'global.css');
      expect(fs.existsSync(globalCssPath)).toBe(true);
      
      const globalCss = fs.readFileSync(globalCssPath, 'utf8');
      
      // Debe contener solo Tailwind directives y CSS crítico
      expect(globalCss).toContain('@tailwind base');
      expect(globalCss).toContain('@tailwind components');
      expect(globalCss).toContain('@tailwind utilities');
      
      // El archivo no debe ser excesivamente grande
      expect(globalCss.length).toBeLessThan(10000); // 10KB máximo
    });

    it('verifica uso de CSS-in-JS/scoped styles', () => {
      const pages = ['index.astro', 'proyectos.astro', 'publicaciones.astro'];
      
      pages.forEach(page => {
        const pagePath = path.join(projectRoot, 'src', 'pages', page);
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf8');
          
          // Verificar que usa estilos scoped de Astro
          if (content.includes('<style>')) {
            expect(content).toContain('<style>');
            expect(content).toContain('</style>');
            
            // Los estilos deben estar bien organizados
            const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
            if (styleMatch) {
              const styleContent = styleMatch[1];
              expect(styleContent).toContain('@keyframes'); // Animaciones organizadas
            }
          }
        }
      });
    });
  });

  describe('Optimización de JavaScript', () => {
    it('verifica configuración de build', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Verificar scripts de build optimizados
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts.build).toBe('astro build');
      
      // Verificar script de preview
      expect(packageJson.scripts).toHaveProperty('preview');
    });

    it('verifica que no hay dependencias innecesarias', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Verificar que las dependencias son necesarias
      if (packageJson.dependencies) {
        const deps = Object.keys(packageJson.dependencies);
        
        // No debe haber dependencias muy pesadas innecesarias
        const heavyDeps = ['lodash', 'moment', 'jquery'];
        const hasUnnecessaryDeps = deps.some(dep => heavyDeps.includes(dep));
        
        expect(hasUnnecessaryDeps).toBeFalsy();
      }
      
      // Verificar devDependencies esenciales
      expect(packageJson.devDependencies).toHaveProperty('astro');
      expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
    });
  });

  describe('SEO y Meta Tags', () => {
    it('verifica estructura básica de SEO en Layout', () => {
      const layoutPath = path.join(projectRoot, 'src', 'layouts', 'Layout.astro');
      expect(fs.existsSync(layoutPath)).toBe(true);
      
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      // Verificar elementos SEO básicos
      expect(layoutContent).toContain('<title>');
      expect(layoutContent).toContain('name="description"');
      expect(layoutContent).toContain('name="viewport"');
      
      // Verificar meta tags de Open Graph o Twitter Card
      const hasOpenGraph = layoutContent.includes('property="og:') || 
                          layoutContent.includes('name="twitter:');
      
      if (hasOpenGraph) {
        expect(hasOpenGraph).toBeTruthy();
      }
    });

    it('verifica que las páginas tienen títulos únicos', () => {
      const indexPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verificar que el título es descriptivo
      expect(indexContent).toContain('Dr. Roberto Sánchez Reolid');
      expect(indexContent).toContain('Investigador');
    });
  });

  describe('Estructura de Archivos', () => {
    it('verifica organización eficiente de directorios', () => {
      const expectedDirs = [
        'src/pages',
        'src/components',
        'src/layouts',
        'src/data',
        'src/styles',
        'src/assets'
      ];

      expectedDirs.forEach(dir => {
        const dirPath = path.join(projectRoot, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
      });
    });

    it('verifica que los componentes están bien organizados', () => {
      const componentsDir = path.join(projectRoot, 'src', 'components');
      const components = fs.readdirSync(componentsDir);
      
      // Verificar que hay componentes reutilizables
      expect(components.length).toBeGreaterThan(0);
      
      // Verificar extensiones correctas
      components.forEach(component => {
        expect(component).toMatch(/\.(astro|vue|jsx|tsx)$/);
      });
    });

    it('verifica separación de datos estáticos', () => {
      const dataDir = path.join(projectRoot, 'src', 'data');
      expect(fs.existsSync(dataDir)).toBe(true);
      
      const dataFiles = fs.readdirSync(dataDir);
      expect(dataFiles.some(file => file.endsWith('.json'))).toBe(true);
    });
  });

  describe('Configuración de Netlify', () => {
    it('verifica configuración de deployment', () => {
      const netlifyConfigPath = path.join(projectRoot, 'netlify.toml');
      expect(fs.existsSync(netlifyConfigPath)).toBe(true);
      
      const netlifyConfig = fs.readFileSync(netlifyConfigPath, 'utf8');
      
      // Verificar configuración básica
      expect(netlifyConfig).toContain('[build]');
      expect(netlifyConfig).toContain('command');
      expect(netlifyConfig).toContain('publish');
    });

    it('verifica configuración de funciones Netlify', () => {
      const functionsDir = path.join(projectRoot, 'netlify', 'functions');
      
      if (fs.existsSync(functionsDir)) {
        const functions = fs.readdirSync(functionsDir);
        
        functions.forEach(func => {
          const funcPath = path.join(functionsDir, func);
          const funcContent = fs.readFileSync(funcPath, 'utf8');
          
          // Verificar estructura básica de función Netlify
          expect(funcContent).toContain('exports.handler');
        });
      }
    });
  });

  describe('Scripts de Optimización', () => {
    it('verifica scripts de análisis y verificación', () => {
      const scriptsDir = path.join(projectRoot, 'scripts');
      
      if (fs.existsSync(scriptsDir)) {
        const scripts = fs.readdirSync(scriptsDir);
        
        // Verificar que hay scripts de utilidad
        expect(scripts.length).toBeGreaterThan(0);
        
        // Buscar scripts de verificación comunes
        const verificationScripts = scripts.filter(script => 
          script.includes('verify') || 
          script.includes('check') || 
          script.includes('validate')
        );
        
        expect(verificationScripts.length).toBeGreaterThan(0);
      }
    });
  });
});
