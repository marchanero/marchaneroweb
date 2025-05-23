# Configuración de Secretos para GitHub Actions y Netlify

Para que el flujo de trabajo de CI/CD funcione correctamente, necesitas configurar algunos secretos en tu repositorio de GitHub:

## Secretos Requeridos

1. **NETLIFY_AUTH_TOKEN**: Token de autenticación de Netlify
2. **NETLIFY_SITE_ID**: ID de tu sitio en Netlify

## Cómo obtener los valores

### NETLIFY_AUTH_TOKEN

1. Ve a [Netlify](https://app.netlify.com/)
2. Inicia sesión en tu cuenta
3. Ve a User Settings (Configuración de Usuario)
4. Haz clic en "Applications"
5. En la sección "Personal access tokens", crea un nuevo token con el botón "New access token"
6. Asigna un nombre descriptivo como "GitHub Actions Deploy"
7. Copia el token generado (solo se mostrará una vez)

### NETLIFY_SITE_ID

1. Ve a [Netlify](https://app.netlify.com/)
2. Selecciona tu sitio web de la lista
3. Ve a "Site settings" (Configuración del sitio)
4. En la sección "Site information", busca el "API ID"
5. Este es tu NETLIFY_SITE_ID

## Configurar Secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (Configuración)
3. En el menú lateral, haz clic en "Secrets and variables" y luego en "Actions"
4. Haz clic en "New repository secret"
5. Agrega los secretos:
   - Nombre: NETLIFY_AUTH_TOKEN, Valor: [tu token de Netlify]
   - Nombre: NETLIFY_SITE_ID, Valor: [ID de tu sitio]

Una vez configurados estos secretos, los flujos de trabajo de GitHub Actions podrán autenticarse con Netlify y desplegar tu sitio automáticamente.
