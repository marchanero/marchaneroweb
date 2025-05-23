# Web Personal de Robert Marchanero

Este proyecto es una web personal construida con [Astro](https://astro.build), un moderno framework para creación de sitios web estáticos. El sitio está diseñado para ser rápido, accesible y fácil de mantener.

[![Netlify Status](https://api.netlify.com/api/v1/badges/badge-id/deploy-status)](https://app.netlify.com/)
[![CI/CD Pipeline](https://github.com/tu-usuario/tu-repositorio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/tu-usuario/tu-repositorio/actions/workflows/ci-cd.yml)

## 🚀 Características

- Diseño responsive y moderno
- Optimización SEO
- Alto rendimiento (puntuación perfecta en Lighthouse)
- Formulario de contacto funcional con Netlify Forms
- Sección de proyectos destacados
- CI/CD automatizado con GitHub Actions y Netlify

## 🧞 Comandos

| Comando                   | Acción                                             |
| :------------------------ | :------------------------------------------------- |
| `npm install`             | Instala las dependencias                           |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321`|
| `npm run build`           | Construye el sitio para producción en `./dist/`    |
| `npm run preview`         | Previsualiza la versión de producción localmente   |
| `npm run astro ...`       | Ejecuta los comandos CLI de Astro                  |

## 🔄 CI/CD

Este proyecto utiliza GitHub Actions para la integración y despliegue continuos:

- **Validación de Pull Requests**: Cada PR es construida y verificada automáticamente.
- **Despliegue Automático**: Los cambios en la rama principal se despliegan automáticamente en Netlify.
- **Deploy Previews**: Cada Pull Request genera una previsualización del sitio para facilitar la revisión.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
