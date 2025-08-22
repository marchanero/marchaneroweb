# Integración con Strapi Cloud

Esta documentación explica cómo configurar y usar Strapi Cloud como CMS para el sitio web del Dr. Roberto Sánchez Reolid.

## 🚀 Configuración Inicial

### 1. Configuración de Strapi Cloud

1. **Crear cuenta en Strapi Cloud**: Ve a [strapi.io/cloud](https://strapi.io/cloud) y crea una cuenta
2. **Crear nuevo proyecto**: Conecta tu repositorio de GitHub con Strapi Cloud
3. **Configurar variables de entorno** en el panel de Strapi Cloud
4. **Desplegar** tu instancia de Strapi

### 2. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```bash
# URL pública de tu instancia de Strapi Cloud
PUBLIC_STRAPI_URL=https://tu-proyecto.strapiapp.com

# Token de API de Strapi (obtenerlo desde el panel de administración)
STRAPI_API_TOKEN=tu_token_de_api_aqui

# Webhook secret para regeneración automática (opcional)
STRAPI_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### 3. Content Types Recomendados

#### Article (Artículo/Publicación)
```json
{
  "title": "Text (Título del artículo)",
  "slug": "UID (URL amigable)",
  "content": "Rich Text (Contenido completo)",
  "excerpt": "Text (Resumen corto)",
  "image": "Media (Imagen destacada)",
  "authors": "Text (Autores)",
  "publication": "Text (Revista/Conferencia)",
  "year": "Number (Año de publicación)",
  "citedBy": "Number (Número de citas)",
  "link": "Text (Enlace externo)",
  "tags": "JSON (Etiquetas)",
  "featured": "Boolean (Artículo destacado)"
}
```

#### Project (Proyecto)
```json
{
  "title": "Text (Título del proyecto)",
  "slug": "UID (URL amigable)",
  "description": "Text (Descripción breve)",
  "fullDescription": "Rich Text (Descripción completa)",
  "startDate": "Date (Fecha de inicio)",
  "endDate": "Date (Fecha de finalización)",
  "status": "Enumeration (in_progress, completed, planned)",
  "budget": "Number (Presupuesto)",
  "funding": "Text (Fuente de financiación)",
  "progress": "Number (Porcentaje de progreso)",
  "technologies": "JSON (Tecnologías utilizadas)",
  "results": "JSON (Resultados destacados)",
  "image": "Media (Imagen principal)",
  "gallery": "Media (Galería de imágenes)",
  "featured": "Boolean (Proyecto destacado)"
}
```

#### Site Info (Información del Sitio)
```json
{
  "siteName": "Text (Nombre del sitio)",
  "siteDescription": "Text (Descripción del sitio)",
  "authorName": "Text (Nombre del autor)",
  "authorTitle": "Text (Título profesional)",
  "authorBio": "Rich Text (Biografía)",
  "email": "Email (Correo de contacto)",
  "phone": "Text (Teléfono)",
  "address": "Text (Dirección)",
  "socialLinks": "JSON (Enlaces a redes sociales)",
  "seo": "Component (Metadatos SEO)"
}
```

#### Academic Metrics (Métricas Académicas)
```json
{
  "totalCitations": "Number (Total de citas)",
  "hIndex": "Number (Índice h)",
  "i10Index": "Number (Índice i10)",
  "totalPublications": "Number (Total de publicaciones)",
  "recentPublications": "Number (Publicaciones recientes)",
  "collaborations": "Number (Colaboraciones)",
  "googleScholarId": "Text (ID de Google Scholar)",
  "orcidId": "Text (ID de ORCID)",
  "researchGateId": "Text (ID de ResearchGate)"
}
```

## 💻 Uso en el Código

### Importar la API de Strapi

```javascript
import { strapiAPI } from '../lib/strapi.js';
import type { StrapiArticle, StrapiProject } from '../types/Strapi.ts';
```

### Obtener contenido

```javascript
// Obtener artículos
const articles = await strapiAPI.getArticles({
  populate: ['image'],
  pagination: { pageSize: 5 },
  sort: ['publishedAt:desc']
});

// Obtener proyectos destacados
const featuredProjects = await strapiAPI.getProjects({
  filters: { featured: { $eq: true } },
  populate: ['image', 'gallery']
});

// Obtener un artículo específico
const article = await strapiAPI.getArticleBySlug('mi-articulo');
```

### Usar en componentes Astro

```astro
---
import { strapiAPI } from '../lib/strapi.js';

const articles = await strapiAPI.getArticles({ pagination: { pageSize: 3 } });
---

<section>
  {articles.data.map(article => (
    <article>
      <h2>{article.attributes.title}</h2>
      <p>{article.attributes.excerpt}</p>
    </article>
  ))}
</section>
```

## 🔄 Automatización con Webhooks

### Configurar Webhook en Strapi

1. Ve a Settings > Webhooks en tu panel de Strapi
2. Crea un nuevo webhook con la URL: `https://api.netlify.com/build_hooks/TU_HOOK_ID`
3. Selecciona los eventos que deben disparar la regeneración
4. Guarda el webhook

### Variables de entorno para Netlify

En tu panel de Netlify, añade:

```bash
PUBLIC_STRAPI_URL=https://tu-proyecto.strapiapp.com
STRAPI_API_TOKEN=tu_token_de_api
```

## 📝 Componentes Disponibles

### StrapiContent.astro
Componente para mostrar artículos dinámicos desde Strapi Cloud.

```astro
<StrapiContent 
  limit={5} 
  featured={true}
  showTitle={true} 
  title="Artículos Destacados"
/>
```

## 🚨 Manejo de Errores

El sistema incluye manejo robusto de errores:

- **Sin conexión**: Muestra contenido estático de respaldo
- **API no disponible**: Logs de error y estado visual
- **Contenido vacío**: Placeholders informativos
- **Imágenes rotas**: URLs de fallback

## 🔧 Desarrollo Local

### Opción 1: Usar Strapi Cloud en desarrollo
```bash
# En tu .env local
PUBLIC_STRAPI_URL=https://tu-proyecto.strapiapp.com
STRAPI_API_TOKEN=tu_token_de_api
```

### Opción 2: Instancia local de Strapi
```bash
# Configurar Strapi local
DEV_STRAPI_URL=http://localhost:1337
DEV_STRAPI_API_TOKEN=tu_token_dev
```

## 📊 Testing

Para probar la integración:

1. Visita `/strapi-test` en tu sitio web
2. Verifica el estado de conexión
3. Comprueba que el contenido se carga correctamente
4. Testa tanto el modo conectado como desconectado

## 🚀 Deployment

### En Netlify

1. **Variables de entorno**: Configura en el dashboard de Netlify
2. **Build hooks**: Configura webhooks para regeneración automática
3. **Build command**: Asegúrate de que sea `npm run build`

### GitHub Actions (opcional)

Puedes configurar GitHub Actions para:
- Regenerar el sitio cuando cambié el contenido en Strapi
- Sincronizar datos entre repositorios
- Validar la integridad del contenido

## 📚 Recursos Adicionales

- [Documentación de Strapi](https://docs.strapi.io)
- [Strapi Cloud Documentation](https://docs.strapi.io/cloud)
- [API Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html)

## 🆘 Troubleshooting

### Problemas Comunes

1. **Error 401**: Verificar el token de API
2. **Error 404**: Comprobar la URL base y los endpoints
3. **CORS Error**: Configurar dominios permitidos en Strapi
4. **Contenido vacío**: Verificar que el contenido esté publicado en Strapi

### Logs de Depuración

Los errores se registran en la consola del navegador y en los logs del servidor durante el build.
