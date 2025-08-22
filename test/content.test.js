import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sistema de Contenido Markdown', () => {
  let projectRoot;

  beforeAll(() => {
    projectRoot = path.join(__dirname, '..');
  });

  describe('Estructura de Carpetas', () => {
    it('verifica que existe la carpeta content', () => {
      const contentDir = path.join(projectRoot, 'content');
      expect(fs.existsSync(contentDir)).toBe(true);
    });

    it('verifica que NO existe la carpeta content-md', () => {
      const contentMdDir = path.join(projectRoot, 'content-md');
      expect(fs.existsSync(contentMdDir)).toBe(false);
    });

    it('verifica la estructura de subdirectorios', () => {
      const contentDir = path.join(projectRoot, 'content');
      const expectedDirs = ['about-me', 'articulos', 'proyectos', 'recursos', 'tutoriales', 'diario'];
      
      expectedDirs.forEach(dir => {
        expect(fs.existsSync(path.join(contentDir, dir))).toBe(true);
      });
    });
  });

  describe('Archivo index.md principal', () => {
    it('verifica que existe content/index.md', () => {
      const indexPath = path.join(projectRoot, 'content', 'index.md');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('verifica el formato del frontmatter en index.md', () => {
      const indexPath = path.join(projectRoot, 'content', 'index.md');
      const fileContent = fs.readFileSync(indexPath, 'utf8');
      const { data, content } = matter(fileContent);

      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('date');
      expect(data).toHaveProperty('summary');
      expect(typeof data.title).toBe('string');
      expect(typeof data.summary).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('Contenido About Me', () => {
    it('verifica que existe about-me/about-me.md', () => {
      const aboutMePath = path.join(projectRoot, 'content', 'about-me', 'about-me.md');
      expect(fs.existsSync(aboutMePath)).toBe(true);
    });

    it('verifica el formato del frontmatter en about-me.md', () => {
      const aboutMePath = path.join(projectRoot, 'content', 'about-me', 'about-me.md');
      const fileContent = fs.readFileSync(aboutMePath, 'utf8');
      const { data, content } = matter(fileContent);

      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('date');
      expect(data).toHaveProperty('summary');
      expect(typeof data.title).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('Contenido de Proyectos', () => {
    it('verifica que existe proyectos/proyectos.json', () => {
      const proyectosJsonPath = path.join(projectRoot, 'content', 'proyectos', 'proyectos.json');
      expect(fs.existsSync(proyectosJsonPath)).toBe(true);
    });

    it('verifica la estructura del índice de proyectos', () => {
      const proyectosJsonPath = path.join(projectRoot, 'content', 'proyectos', 'proyectos.json');
      const proyectosData = JSON.parse(fs.readFileSync(proyectosJsonPath, 'utf8'));

      expect(Array.isArray(proyectosData)).toBe(true);
      expect(proyectosData.length).toBeGreaterThan(0);

      proyectosData.forEach(proyecto => {
        expect(proyecto).toHaveProperty('id');
        expect(proyecto).toHaveProperty('file');
        expect(typeof proyecto.id).toBe('string');
        expect(typeof proyecto.file).toBe('string');
        expect(proyecto.file).toMatch(/\.md$/);
      });
    });

    it('verifica que existen los archivos de proyectos referenciados', () => {
      const proyectosJsonPath = path.join(projectRoot, 'content', 'proyectos', 'proyectos.json');
      const proyectosData = JSON.parse(fs.readFileSync(proyectosJsonPath, 'utf8'));
      const proyectosDir = path.join(projectRoot, 'content', 'proyectos');

      proyectosData.forEach(proyecto => {
        const filePath = path.join(proyectosDir, proyecto.file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('verifica el formato del frontmatter en archivos de proyectos', () => {
      const proyectosJsonPath = path.join(projectRoot, 'content', 'proyectos', 'proyectos.json');
      const proyectosData = JSON.parse(fs.readFileSync(proyectosJsonPath, 'utf8'));
      const proyectosDir = path.join(projectRoot, 'content', 'proyectos');

      proyectosData.forEach(proyecto => {
        const filePath = path.join(proyectosDir, proyecto.file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Campos obligatorios
        expect(data).toHaveProperty('titulo');
        expect(data).toHaveProperty('fechaInicio');
        expect(data).toHaveProperty('fechaFin');
        expect(data).toHaveProperty('estado');
        expect(data).toHaveProperty('progreso');
        expect(data).toHaveProperty('presupuesto');
        expect(data).toHaveProperty('etiquetas');
        expect(data).toHaveProperty('destacado');
        expect(data).toHaveProperty('imagen');
        expect(data).toHaveProperty('altImagen');
        expect(data).toHaveProperty('url');

        // Verificar tipos de datos
        expect(typeof data.titulo).toBe('string');
        expect(typeof data.estado).toBe('string');
        expect(typeof data.progreso).toBe('number');
        expect(typeof data.destacado).toBe('boolean');
        expect(Array.isArray(data.etiquetas)).toBe(true);
        expect(content.length).toBeGreaterThan(0);

        // Verificar valores válidos
        expect(['En curso', 'Finalizado', 'Planificado']).toContain(data.estado);
        expect(data.progreso).toBeGreaterThanOrEqual(0);
        expect(data.progreso).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Integración con Páginas Astro', () => {
    it('verifica que index.astro carga desde content/index.md', () => {
      const indexAstroPath = path.join(projectRoot, 'src', 'pages', 'index.astro');
      const indexContent = fs.readFileSync(indexAstroPath, 'utf8');

      expect(indexContent).toContain("path.resolve('./content/index.md')");
      expect(indexContent).toContain('matter.read(indexPath)');
      expect(indexContent).toContain('{indexData.title}');
      expect(indexContent).toContain('{indexData.summary}');
    });

    it('verifica que sobre-mi.astro carga desde content/about-me/about-me.md', () => {
      const sobreMiPath = path.join(projectRoot, 'src', 'pages', 'sobre-mi.astro');
      const sobreMiContent = fs.readFileSync(sobreMiPath, 'utf8');

      expect(sobreMiContent).toContain("path.resolve('./content/about-me/about-me.md')");
      expect(sobreMiContent).toContain('matter.read(aboutMePath)');
      expect(sobreMiContent).toContain('{aboutMeData.title}');
      expect(sobreMiContent).toContain('{aboutMeData.summary}');
    });

    it('verifica que proyectos.astro carga desde content/proyectos/', () => {
      const proyectosPath = path.join(projectRoot, 'src', 'pages', 'proyectos.astro');
      const proyectosContent = fs.readFileSync(proyectosPath, 'utf8');

      expect(proyectosContent).toContain("path.resolve('./content/proyectos')");
      expect(proyectosContent).toContain('proyectos.json');
      expect(proyectosContent).toContain('matter.read(filePath)');
    });
  });

  describe('Componentes de Contenido', () => {
    it('verifica que existe ProyectoCard.astro', () => {
      const componentPath = path.join(projectRoot, 'src', 'components', 'ProyectoCard.astro');
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('verifica la estructura del componente ProyectoCard', () => {
      const componentPath = path.join(projectRoot, 'src', 'components', 'ProyectoCard.astro');
      const componentContent = fs.readFileSync(componentPath, 'utf8');

      // Verificar que maneja props de proyecto
      expect(componentContent).toContain('title');
      expect(componentContent).toContain('descripcion');
      expect(componentContent).toContain('estado');
      expect(componentContent).toContain('etiquetas');
    });
  });

  describe('Consistencia del Sistema', () => {
    it('verifica que no hay referencias a content-md en el código', () => {
      const srcDir = path.join(projectRoot, 'src');
      
      function checkDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            checkDirectory(fullPath);
          } else if (item.match(/\.(astro|js|ts|jsx|tsx)$/)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            expect(content).not.toContain('content-md');
          }
        });
      }
      
      checkDirectory(srcDir);
    });

    it('verifica que todas las dependencias de gray-matter están instaladas', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies).toHaveProperty('gray-matter');
    });

    it('verifica que el build funciona con el nuevo sistema', async () => {
      // Este test verificará indirectamente que el sistema funciona
      // al comprobar que los archivos de contenido son accesibles
      const contentFiles = [
        path.join(projectRoot, 'content', 'index.md'),
        path.join(projectRoot, 'content', 'about-me', 'about-me.md'),
        path.join(projectRoot, 'content', 'proyectos', 'proyectos.json')
      ];

      contentFiles.forEach(file => {
        expect(fs.existsSync(file)).toBe(true);
        
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(file, 'utf8');
          expect(() => matter(content)).not.toThrow();
        } else if (file.endsWith('.json')) {
          const content = fs.readFileSync(file, 'utf8');
          expect(() => JSON.parse(content)).not.toThrow();
        }
      });
    });
  });
});
