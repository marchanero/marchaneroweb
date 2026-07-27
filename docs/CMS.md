# Edición de contenido con Sveltia CMS

El sitio incluye un panel de administración ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)) para editar el contenido sin tocar código. Los cambios se guardan como **commits en el repositorio**, lo que dispara automáticamente el despliegue en Netlify (~2 minutos).

## Qué se puede editar

| Contenido | Dónde se guarda | Dónde se muestra |
| :--- | :--- | :--- |
| Textos y líneas de investigación de la home | `content/home.json` | `/` |
| Proyectos de investigación | `content/proyectos/*.md` | `/proyectos` y destacados en `/` |
| Asignaturas | `content/asignaturas/*.md` | `/asignaturas` |

Las **publicaciones y métricas** no se editan aquí: se actualizan solas desde Google Scholar (ver `docs/GOOGLE-SCHOLAR-INTEGRATION.md`).

## Acceso (sin configuración en el servidor)

El CMS usa el **backend de GitHub**: los cambios se commitean al repo directamente a través de la API de GitHub. **No hay que activar nada en Netlify ni en GitHub** — solo necesitas un token de acceso personal (PAT) la primera vez que entres:

1. Ve a `https://marchanero.netlify.app/admin`
2. Pulsa **"Sign In with Token"**
3. El diálogo incluye un enlace a la página de GitHub para crear el token **con los permisos ya preseleccionados** (contenido del repo: lectura y escritura)
4. Genera el token, cópialo y pégalo en el diálogo
5. Ya está: edita, guarda y el cambio se commitea y despliega solo

El token se guarda en el `localStorage` de tu navegador (no sale de tu equipo). Si lo borras o caduca, simplemente repite el proceso.

> **Nota**: si en el futuro editan personas no técnicas o varios usuarios, se puede montar el flujo OAuth con [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) (Cloudflare Workers) para tener botón de "Sign in with GitHub". Para uso personal, el PAT es suficiente.

## Alternativa sin CMS: editar Markdown directamente

Todo lo que edita el CMS son archivos del repo, así que también puedes:

- Editarlos directamente en **github.com** (botón lápiz sobre el archivo) — funciona desde el móvil
- O editarlos en local y hacer `git push`

En ambos casos el despliegue es automático tras el push a `main`. El CMS solo añade una interfaz cómoda encima del mismo mecanismo.

## Estructura técnica

```
public/admin/
├── index.html    # Carga Sveltia CMS desde CDN
└── config.yml    # Backend GitHub + definición de colecciones

content/
├── home.json           # Textos de la home
├── proyectos/*.md      # Un archivo por proyecto (frontmatter YAML)
└── asignaturas/*.md    # Un archivo por asignatura (frontmatter YAML)

src/content.config.ts   # Esquemas Zod de las colecciones de Astro
```

Las páginas leen el contenido con `getCollection()` de Astro en el build, por lo que **cada cambio en el CMS = commit + rebuild + despliegue**.

### Validación de datos

Los archivos `.md` se validan en cada build contra los esquemas de `src/content.config.ts`. Si el CMS guarda un dato con formato incorrecto (p. ej. `progreso` fuera de 0-100), la build fallará y el despliegue anterior seguirá activo.

### Campos destacados de proyectos

- `destacado: true` → aparece en la sección "Proyectos destacados" de `/proyectos`
- `destacadoHome: true` → aparece en "Investigaciones destacadas" de la home

## Imágenes

Las imágenes subidas desde el CMS se guardan en `public/images/uploads/` y se sirven desde `/images/uploads/`.

## Solución de problemas

- **El token no funciona**: verifica que se creó con permisos de contenido (lectura y escritura) sobre el repo `marchanero/marchaneroweb`. Si es un *fine-grained token*, debe incluir ese repositorio explícitamente.
- **Los cambios no aparecen**: revisa en GitHub que el CMS creó el commit, y en Netlify que el deploy terminó. Recuerda que el navegador puede tener la página cacheada (Ctrl/Cmd+Shift+R).
- **Errores de CSP en la consola**: las cabeceras de `/admin` están en `netlify.toml` siguiendo la [guía oficial de Sveltia](https://sveltiacms.app/en/docs/security).
