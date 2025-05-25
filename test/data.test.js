import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Datos y Configuración', () => {
  it('verifica la estructura de datos de scholar.json', () => {
    const projectRoot = path.join(__dirname, '..');
    const scholarPath = path.join(projectRoot, 'src', 'data', 'scholar.json');
    
    expect(fs.existsSync(scholarPath)).toBe(true);
    
    const scholarData = JSON.parse(fs.readFileSync(scholarPath, 'utf8'));
    
    // Verificar estructura básica
    expect(scholarData).toHaveProperty('publications');
    expect(scholarData).toHaveProperty('metrics');
    expect(Array.isArray(scholarData.publications)).toBe(true);
    
    // Verificar métricas
    expect(scholarData.metrics).toHaveProperty('totalCitations');
    expect(scholarData.metrics).toHaveProperty('hIndex');
    expect(typeof scholarData.metrics.totalCitations).toBe('number');
    expect(typeof scholarData.metrics.hIndex).toBe('number');
    
    // Verificar que las publicaciones tienen la estructura esperada
    if (scholarData.publications.length > 0) {
      const firstPublication = scholarData.publications[0];
      expect(firstPublication).toHaveProperty('title');
      expect(firstPublication).toHaveProperty('authors');
      expect(firstPublication).toHaveProperty('year');
    }
  });

  it('verifica la configuración de package.json', () => {
    const projectRoot = path.join(__dirname, '..');
    const packagePath = path.join(projectRoot, 'package.json');
    
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Verificar información básica
    expect(packageData.name).toBe('roberto-sanchez-reolid-web');
    expect(packageData.type).toBe('module');
    expect(packageData.author).toBe('Roberto Sánchez Reolid');
    
    // Verificar scripts importantes
    expect(packageData.scripts).toHaveProperty('dev');
    expect(packageData.scripts).toHaveProperty('build');
    expect(packageData.scripts).toHaveProperty('test');
    expect(packageData.scripts).toHaveProperty('preview');
    
    // Verificar dependencias importantes
    expect(packageData.devDependencies).toHaveProperty('astro');
    expect(packageData.devDependencies).toHaveProperty('jest');
    expect(packageData.devDependencies).toHaveProperty('tailwindcss');
  });

  it('verifica la configuración de Tailwind', () => {
    const projectRoot = path.join(__dirname, '..');
    const tailwindPath = path.join(projectRoot, 'tailwind.config.mjs');
    
    expect(fs.existsSync(tailwindPath)).toBe(true);
    
    const content = fs.readFileSync(tailwindPath, 'utf8');
    
    // Verificar que incluye configuraciones básicas
    expect(content).toContain('content');
    expect(content).toContain('./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}');
  });

  it('verifica la existencia de archivos de configuración importantes', () => {
    const projectRoot = path.join(__dirname, '..');
    
    const configFiles = [
      'astro.config.mjs',
      'tailwind.config.mjs',
      'jest.config.js',
      'package.json',
      'tsconfig.json'
    ];

    configFiles.forEach(file => {
      expect(fs.existsSync(path.join(projectRoot, file))).toBe(true);
    });
  });

  it('verifica la estructura de directorios del proyecto', () => {
    const projectRoot = path.join(__dirname, '..');
    
    const expectedDirs = [
      'src',
      'src/pages',
      'src/components',
      'src/layouts',
      'src/data',
      'src/styles',
      'test',
      'public',
      'scripts'
    ];

    expectedDirs.forEach(dir => {
      expect(fs.existsSync(path.join(projectRoot, dir))).toBe(true);
    });
  });

  it('verifica que existe el archivo de estilos global', () => {
    const projectRoot = path.join(__dirname, '..');
    const globalCssPath = path.join(projectRoot, 'src', 'styles', 'global.css');
    
    expect(fs.existsSync(globalCssPath)).toBe(true);
    
    const content = fs.readFileSync(globalCssPath, 'utf8');
    
    // Verificar que incluye Tailwind
    expect(content).toContain('@tailwind base');
    expect(content).toContain('@tailwind components');
    expect(content).toContain('@tailwind utilities');
  });
});
