# LazyImage Component - Documentación

## Componente de Carga Perezosa de Imágenes Mejorado

Este componente proporciona una carga optimizada de imágenes con múltiples mejoras de rendimiento y experiencia de usuario.

## Características Principales

✅ **Carga perezosa (Lazy Loading)** - Las imágenes se cargan solo cuando están visibles
✅ **Soporte para formatos modernos** - AVIF, WebP con fallback automático
✅ **Múltiples tipos de placeholder** - Blur, skeleton, color sólido
✅ **Progressive loading** - Carga progresiva para mejor percepción de velocidad
✅ **Error handling** - Fallback automático en caso de error
✅ **Responsive design** - Adapta automáticamente a diferentes tamaños
✅ **Accesibilidad mejorada** - Soporte para lectores de pantalla y preferencias de usuario
✅ **Performance optimizada** - IntersectionObserver, debounce, y preload inteligente

## Ejemplos de Uso

### Uso Básico
```astro
<LazyImage
  src="/images/mi-imagen.jpg"
  alt="Descripción de la imagen"
  width={800}
  height={600}
/>
```

### Con Placeholder Blur
```astro
<LazyImage
  src="/images/hero-image.jpg"
  alt="Imagen principal"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  progressive={true}
/>
```

### Con Skeleton Loading
```astro
<LazyImage
  src="/images/profile.jpg"
  alt="Foto de perfil"
  width={400}
  height={400}
  placeholder="skeleton"
  placeholderColor="#e5e7eb"
  objectFit="cover"
  class="rounded-full"
/>
```

### Imagen Prioritaria (Above the fold)
```astro
<LazyImage
  src="/images/hero.jpg"
  alt="Imagen principal"
  width={1920}
  height={1080}
  priority={true}
  loading="eager"
  progressive={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

### Con Fallback Personalizado
```astro
<LazyImage
  src="/images/puede-fallar.jpg"
  alt="Imagen que puede fallar"
  width={600}
  height={400}
  fallbackSrc="/images/mi-fallback-personalizado.jpg"
  placeholder="color"
  placeholderColor="#f3f4f6"
/>
```

## Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `src` | `string` | **requerido** | URL de la imagen |
| `alt` | `string` | **requerido** | Texto alternativo |
| `class` | `string` | `''` | Clases CSS adicionales |
| `width` | `number` | `undefined` | Ancho de la imagen |
| `height` | `number` | `undefined` | Alto de la imagen |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Estrategia de carga |
| `placeholder` | `'blur' \| 'skeleton' \| 'color' \| 'none'` | `'skeleton'` | Tipo de placeholder |
| `placeholderColor` | `string` | `'#f3f4f6'` | Color del placeholder |
| `fallbackSrc` | `string` | `'/images/placeholder.svg'` | Imagen de fallback |
| `sizes` | `string` | `undefined` | Atributo sizes para responsive |
| `quality` | `number` | `80` | Calidad de compresión |
| `progressive` | `boolean` | `true` | Habilitar carga progresiva |
| `blurDataURL` | `string` | auto | Data URL para placeholder blur |
| `objectFit` | `'cover' \| 'contain' \| 'fill' \| 'scale-down' \| 'none'` | `'cover'` | Como ajustar la imagen |
| `priority` | `boolean` | `false` | Marcar como prioritaria |

## Eventos

El componente emite eventos personalizados que puedes escuchar:

```javascript
// Escuchar cuando una imagen se carga exitosamente
document.addEventListener('imageLoaded', (event) => {
  console.log('Imagen cargada:', event.detail);
  // { src: string, componentId: string }
});

// Escuchar errores de carga
document.addEventListener('imageError', (event) => {
  console.log('Error cargando imagen:', event.detail);
  // { src: string, componentId: string }
});
```

## Utilidades JavaScript

```javascript
// Recargar una imagen específica manualmente
window.lazyImageUtils.reloadImage('component-id');

// Precargar una imagen
window.lazyImageUtils.preloadImage('/images/next-image.jpg')
  .then(img => console.log('Imagen precargada'))
  .catch(err => console.error('Error precargando'));
```

## Optimizaciones Automáticas

### Formatos de Imagen
El componente intenta automáticamente estos formatos en orden:
1. **AVIF** - Mejor compresión, soporte moderno
2. **WebP** - Buena compresión, amplio soporte
3. **Original** - Fallback para compatibilidad

### Estrategias de Carga
- **Lazy Loading**: Usa IntersectionObserver con margen de 50px
- **Priority Loading**: Para imágenes above-the-fold
- **Progressive Loading**: Mejora la percepción de velocidad
- **Timeout Protection**: Fallback automático después de 10s

### Accesibilidad
- Respeta `prefers-reduced-motion`
- Soporte para `prefers-contrast: high`
- ARIAs labels apropiados
- Focus management

## Estilos CSS

El componente incluye estilos responsivos y estados:

```css
/* Estados disponibles */
.lazy-image-container.loading { /* Cargando */ }
.lazy-image-container.loaded { /* Cargado */ }
.lazy-image-container.error { /* Error */ }

/* Clases de placeholder */
.skeleton-loading { /* Skeleton activo */ }
.blur-placeholder { /* Placeholder difuminado */ }
.color-placeholder { /* Placeholder sólido */ }
```

## Consideraciones de Rendimiento

- Usa `IntersectionObserver` para lazy loading eficiente
- Soporte automático para formatos modernos (AVIF, WebP)
- Carga progresiva para mejor UX
- Preload inteligente de imágenes críticas
- Gestión automática de memoria con cleanup

## Browser Support

- **Lazy Loading nativo**: Todos los navegadores modernos
- **IntersectionObserver**: IE11+ con polyfill
- **AVIF**: Chrome 85+, Firefox 93+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+

## Ejemplos Avanzados

### Galería de Imágenes
```astro
{images.map((image, index) => (
  <LazyImage
    src={image.url}
    alt={image.alt}
    width={300}
    height={200}
    placeholder="skeleton"
    class="gallery-item"
    priority={index < 4} // Primeras 4 prioritarias
    sizes="(max-width: 768px) 50vw, 300px"
  />
))}
```

### Hero Image Optimizada
```astro
<LazyImage
  src="/images/hero-4k.jpg"
  alt="Imagen principal del sitio"
  width={1920}
  height={1080}
  priority={true}
  loading="eager"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  progressive={true}
  sizes="100vw"
  class="hero-image"
/>
```
