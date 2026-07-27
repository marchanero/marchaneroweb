# Web Personal del Dr. Roberto Sánchez Reolid

Sitio web académico del Dr. Roberto Sánchez Reolid, investigador en la Universidad de Castilla-La Mancha (UCLM). Construido con [Astro](https://astro.build), presenta su perfil de investigador, publicaciones científicas, proyectos, asignaturas y CV.

[![Deploy to Netlify](https://github.com/marchanero/marchaneroweb/actions/workflows/deploy-netlify.yml/badge.svg)](https://github.com/marchanero/marchaneroweb/actions/workflows/deploy-netlify.yml)
[![Run Tests](https://github.com/marchanero/marchaneroweb/actions/workflows/run-tests.yml/badge.svg)](https://github.com/marchanero/marchaneroweb/actions/workflows/run-tests.yml)
[![Update Scholar Data](https://github.com/marchanero/marchaneroweb/actions/workflows/update-scholar-data.yml/badge.svg)](https://github.com/marchanero/marchaneroweb/actions/workflows/update-scholar-data.yml)

🌐 **Sitio en producción:** [https://marchanero.netlify.app](https://marchanero.netlify.app)

## 🚀 Características

- **Integración automática con Google Scholar**: las publicaciones y métricas bibliométricas (citas, índice h, i10) se actualizan automáticamente cada día mediante SerpAPI y GitHub Actions
- **CMS integrado (Sveltia)**: edición de proyectos, asignaturas y textos de la home desde `/admin`, sin tocar código — los cambios se guardan como commits y se despliegan solos
- **Diseño responsive y moderno** con Tailwind CSS y modo oscuro
- **Optimización SEO** y alto rendimiento (generación de sitemap, HTML comprimido, assets optimizados)
- **Formulario de contacto** funcional con Netlify Forms
- **Accesibilidad verificada** con tests automatizados (pa11y)
- **Suite completa de tests** con Jest: páginas, SEO, accesibilidad, rendimiento y responsive
- **CI/CD automatizado** con GitHub Actions y despliegue en Netlify

## 🛠️ Stack tecnológico

- [Astro 5](https://astro.build) — generador de sitios estáticos
- [Tailwind CSS 3](https://tailwindcss.com) — estilos
- [TypeScript](https://www.typescriptlang.org/) — tipado
- [Jest](https://jestjs.io) — tests
- [pa11y-ci](https://github.com/pa11y/pa11y-ci) — tests de accesibilidad
- [SerpAPI](https://serpapi.com) — datos de Google Scholar
- [Netlify](https://www.netlify.com) — hosting y funciones serverless

## 📁 Estructura del proyecto

```text
/
├── .github/workflows/       # CI/CD: deploy, tests, actualización de Scholar
├── content/                 # Contenido editable (CMS): home.json, proyectos/, asignaturas/
├── docs/                    # Documentación adicional del proyecto
├── netlify/functions/       # Funciones serverless (update-scholar)
├── public/
│   └── admin/               # Panel del CMS (Sveltia)
├── scripts/                 # Scripts de scraping, verificación y despliegue
├── src/
│   ├── assets/              # Imágenes procesadas por Astro
│   ├── components/          # Componentes Astro (ScholarMetrics, ThemeToggle...)
│   ├── content.config.ts    # Esquemas de las Content Collections
│   ├── data/                # Datos de Google Scholar (JSON generados)
│   ├── layouts/             # Layout base
│   ├── pages/               # Páginas: index, publicaciones, proyectos, cv...
│   ├── styles/              # Estilos globales
│   └── types/               # Tipos TypeScript
└── test/                    # Suite de tests Jest
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                     | Acción                                                       |
| :-------------------------- | :----------------------------------------------------------- |
| `npm install`               | Instala las dependencias                                     |
| `npm run dev`               | Inicia el servidor de desarrollo en `localhost:4321`         |
| `npm run build`             | Construye el sitio para producción en `./dist/`              |
| `npm run preview`           | Previsualiza la build de producción localmente               |
| `npm run test`              | Ejecuta la suite de tests con Jest                           |
| `npm run test:pages`        | Ejecuta solo los tests de páginas y SEO                      |
| `npm run test:a11y`         | Ejecuta los tests de accesibilidad con pa11y                 |
| `npm run check:performance` | Analiza el rendimiento con Lighthouse CI                     |
| `npm run deploy`            | Verificaciones pre-despliegue + build de producción          |
| `npm run update:scholar`    | Actualiza los datos de Google Scholar vía SerpAPI            |
| `npm run scholar:verify`    | Verifica el sistema completo de integración Scholar          |
| `npm run scholar:summary`   | Genera el resumen ejecutivo de métricas bibliométricas       |

## 🎓 Integración con Google Scholar

El sitio obtiene y muestra automáticamente las publicaciones y métricas del perfil de Google Scholar del autor:

- **Scraping optimizado** (`scripts/scrape-scholar-ultra-optimized.js`): obtiene todas las publicaciones en una sola petición a SerpAPI, minimizando el consumo de la cuota mensual de la API
- **Actualización automática diaria**: el workflow `update-scholar-data.yml` se ejecuta cada día a las 6:00 UTC, actualiza `src/data/scholar.json` solo si hay cambios y dispara un nuevo despliegue
- **Componentes**: `ScholarMetrics.astro` (métricas bibliométricas), `RecentPublications.astro` (últimas publicaciones en la home) y la página `publicaciones.astro` (lista completa con filtros)

Para más detalles, consulta [docs/GOOGLE-SCHOLAR-INTEGRATION.md](./docs/GOOGLE-SCHOLAR-INTEGRATION.md).

## ✏️ Edición de contenido (CMS)

El contenido del sitio (proyectos, asignaturas, textos de la home) vive en archivos Markdown/JSON dentro de `content/` y se puede editar de dos formas:

1. **Desde el CMS** en `https://marchanero.netlify.app/admin` (Sveltia CMS, requiere activación única de Netlify Identity + Git Gateway)
2. **Directamente en GitHub**: editar los archivos de `content/` y hacer commit

En ambos casos, el cambio dispara automáticamente un nuevo despliegue. Guía completa en [docs/CMS.md](./docs/CMS.md).

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y completa los valores. Las principales variables son:

| Variable           | Descripción                                        |
| :----------------- | :------------------------------------------------- |
| `SERPAPI_API_KEY`  | Clave de SerpAPI para el scraping de Google Scholar |
| `TELEGRAM_TOKEN`   | Token del bot de Telegram para notificaciones      |
| `TELEGRAM_TO`      | Chat ID de Telegram para las notificaciones        |
| `NETLIFY_AUTH_TOKEN` | Token de acceso a Netlify (para scripts)         |
| `NETLIFY_SITE_ID`  | ID del sitio en Netlify                            |
| `NETLIFY_HOOK_URL` | Webhook de build de Netlify                        |
| `GITHUB_TOKEN`     | Token de GitHub para disparar workflows            |

Consulta `.env.template` y [docs/VARIABLES-ENTORNO.md](./docs/VARIABLES-ENTORNO.md) para más información.

## 🔄 CI/CD

El proyecto utiliza GitHub Actions para la integración y el despliegue continuos:

1. **Deploy to Netlify** (`.github/workflows/deploy-netlify.yml`)
   - Push a `main`: validación, tests, build y despliegue en producción

2. **Run Tests** (`.github/workflows/run-tests.yml`)
   - Pull Requests y ramas `develop`/`feature/**`/`fix/**`/`hotfix/**`: ejecuta la suite de tests

3. **Update Scholar Data** (`.github/workflows/update-scholar-data.yml`)
   - Ejecución diaria programada (6:00 UTC): actualiza los datos de Google Scholar y redespliega si hay cambios

## 🧪 Testing

La suite de tests cubre:

- **Estructura de páginas** y rutas (`pages.test.js`)
- **SEO** y metadatos (`seo.test.js`, `advanced-seo.test.js`)
- **Accesibilidad** (`accessibility.test.js` + pa11y-ci)
- **Componentes** (`components.test.js`, `advanced-components.test.js`)
- **Responsive** (`responsive.test.js`)
- **Rendimiento** (`performance.test.js`)
- **Contenido y datos** (`content.test.js`, `data.test.js`)

## 📚 Documentación adicional

- [docs/CMS.md](./docs/CMS.md) — Edición de contenido con el CMS (Sveltia)
- [DEPLOY.md](./DEPLOY.md) — Instrucciones detalladas de despliegue
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Guía para contribuir al proyecto
- [docs/GOOGLE-SCHOLAR-INTEGRATION.md](./docs/GOOGLE-SCHOLAR-INTEGRATION.md) — Sistema de integración con Google Scholar
- [docs/WORKFLOW-UNIFICADO.md](./docs/WORKFLOW-UNIFICADO.md) — Pipeline de CI/CD
- [docs/ACCESSIBILITY.md](./docs/ACCESSIBILITY.md) — Accesibilidad
- [docs/VARIABLES-ENTORNO.md](./docs/VARIABLES-ENTORNO.md) — Variables de entorno
