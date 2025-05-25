# Workflow Unificado de CI/CD

## Descripción
Este documento detalla el nuevo workflow unificado para CI/CD del sitio web del Dr. Roberto Sánchez Reolid. El pipeline integra todas las fases del proceso de desarrollo, testing, control de calidad y despliegue en una secuencia lógica y organizada.

## Estructura del Pipeline Unificado

El workflow `unified-pipeline.yml` está organizado en 5 fases secuenciales:

### FASE 1: VALIDACIÓN Y CONSTRUCCIÓN BÁSICA
- **Job: lint**: Verificación de sintaxis y formateo del código
  - Carga de variables de entorno
  - Verificación de configuración de Telegram
  - Compilación básica para asegurar que no hay errores de sintaxis
  
- **Job: test**: Ejecución de tests unitarios y funcionales
  - Depende de: lint (solo ejecuta si lint fue exitoso)
  - Ejecuta todos los tests del sitio web
  - Verifica específicamente los tests de páginas y SEO
  - Almacena resultados para revisión posterior

### FASE 2: CONSTRUCCIÓN Y OPTIMIZACIÓN
- **Job: build**: Build y optimización para producción
  - Depende de: test
  - Verificaciones pre-despliegue
  - Generación de archivos optimizados
  - Generación de sitemap.xml y robots.txt
  - Optimización de HTML, CSS y JavaScript
  - Compresión de archivos para CDN

### FASE 3: CONTROL DE CALIDAD
- **Jobs de calidad**: Se ejecutan en paralelo después del build
  - **html-validation**: Validación de HTML
  - **accessibility**: Validación de accesibilidad
  - **schema-validation**: Validación de esquemas Schema.org
  
- **Job: quality-report**: Reporte consolidado de calidad
  - Depende de: todos los jobs de calidad
  - Genera un informe unificado con los resultados

### FASE 4: DESPLIEGUES
- **Job: deploy-preview**: Deploy de vista previa (solo en PRs)
  - Depende de: build, test
  - Despliegue a URL temporal para revisión
  - Comentario automático en el PR con información y URL

- **Job: deploy-production**: Deploy a producción
  - Depende de: build, quality-report
  - Solo se ejecuta en rama main o ejecución manual
  - Importa variables de entorno a Netlify
  - Despliegue a la URL de producción

### FASE 5: NOTIFICACIONES
- **Job: notify**: Notificación de resultados
  - Depende de: todos los jobs de despliegue y calidad
  - Notificaciones por Telegram (éxito y error)
  - Notificaciones por correo (solo despliegues exitosos a producción)

## Eventos que activan el workflow
- **Push a main**: Ejecuta todo el pipeline y hace deploy a producción
- **Pull Request**: Ejecuta validación, tests y deploy de previsualización
- **Programación**: Ejecución automática cada lunes a las 8:00 AM UTC
- **Manual**: Permite ejecutar manualmente desde la interfaz de GitHub Actions

## Condiciones especiales
- **Pull Requests en borrador**: No ejecuta el workflow
- **Fallos en tests**: No continúa con el despliegue a producción
- **Fallos en cualquier fase**: Envía notificación de error por Telegram

## Mejoras respecto a la implementación anterior
1. **Secuencia única**: Todos los trabajos están en un solo workflow con dependencias claras
2. **Compartición de artefactos**: El build se comparte entre todos los trabajos que lo necesitan
3. **Condiciones claras**: Cada job tiene condiciones precisas de ejecución basadas en resultados previos
4. **Notificaciones inteligentes**: Las notificaciones dependen del tipo de evento y resultado
5. **Integración de variables**: Uso consistente del sistema de carga de variables en todos los pasos
6. **Simplificación**: Eliminación de pasos duplicados y consolidación de lógica similar

---
Fecha: 24 de mayo de 2025
Autor: Equipo de Desarrollo Web
