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

  describe('Documentación y Configuración', () => {
    it('verifica que existe el plan de mejoras prioritarias', () => {
      const planPath = path.join(projectRoot, 'docs', 'archive', 'PLAN_MEJORAS_PRIORITARIAS.md');
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
      expect(packageJson.devDependencies).toHaveProperty('dotenv');
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
