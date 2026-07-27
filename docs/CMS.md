# Edición de contenido con Sveltia CMS

El sitio incluye un panel de administración ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)) para editar el contenido sin tocar código. Los cambios se guardan como **commits en el repositorio**, lo que dispara automáticamente el despliegue en Netlify (~2 minutos).

## Qué se puede editar

| Contenido | Dónde se guarda | Dónde se muestra |
| :--- | :--- | :--- |
| Textos y líneas de investigación de la home | `content/home.json` | `/` |
| Proyectos de investigación | `content/proyectos/*.md` | `/proyectos` y destacados en `/` |
| Asignaturas | `content/asignaturas/*.md` | `/asignaturas` |

Las **publicaciones y métricas** no se editan aquí: se actualizan solas desde Google Scholar (ver `docs/GOOGLE-SCHOLAR-INTEGRATION.md`).

## Activación (una sola vez, ~5 minutos)

El CMS usa **Netlify Identity** para el login y **Git Gateway** para commitear al repo. Se activan desde el dashboard de Netlify:

1. **Activar Identity**
   - Netlify → tu sitio → **Site configuration** → **Identity** → **Enable Identity**

2. **Restringir registro (recomendado)**
   - En **Identity** → **Settings and usage** → **Registration preferences** → selecciona **Invite only**

3. **Activar Git Gateway**
   - En **Identity** → **Services** → **Git Gateway** → **Enable Git Gateway**
   - Esto permite que el CMS escriba en el repositorio de GitHub en tu nombre

4. **Invitarte a ti mismo**
   - En la pestaña **Identity** (lista de usuarios) → **Invite users** → introduce tu email
   - Recibirás un correo: ábrelo y acepta la invitación (te llevará a la web para crear tu contraseña)

5. **Entrar al CMS**
   - Ve a `https://marchanero.netlify.app/admin`
   - Inicia sesión con tu email y contraseña de Identity
   - Edita, guarda ("Save") y el cambio se despliega solo

## Alternativa sin CMS: editar Markdown directamente

Todo lo que edita el CMS son archivos del repo, así que también puedes:

- Editarlos directamente en **github.com** (botón lápiz sobre el archivo) — funciona desde el móvil
- O editarlos en local y hacer `git push`

En ambos casos el despliegue es automático tras el push a `main`. El CMS solo añade una interfaz cómoda encima del mismo mecanismo.

## Estructura técnica

```
public/admin/
├── index.html    # Carga Sveltia CMS + Netlify Identity
└── config.yml    # Definición de colecciones (campos editables)

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

- **"Error al iniciar sesión"** en `/admin`: Git Gateway no está activado (paso 3) o el usuario no está invitado (paso 4).
- **El correo de invitación lleva a una página en blanco**: asegúrate de que la build desplegada incluye el widget de Identity (está en `Layout.astro`).
- **Los cambios no aparecen**: revisa en GitHub que el CMS creó el commit, y en Netlify que el deploy terminó. Recuerda que el navegador puede tener la página cacheada (Ctrl/Cmd+Shift+R).
