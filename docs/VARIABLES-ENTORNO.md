# Gestión de Variables de Entorno

## Introducción

Este documento explica cómo gestionar las variables de entorno y secretos para el sitio web del Dr. Roberto Sánchez Reolid. Usamos un enfoque basado en archivos `.env` para el desarrollo local y los secretos de GitHub/Netlify para los entornos de producción.

## Configuración Local

### Archivo .env

Para el desarrollo local, todas las variables de entorno se almacenan en un archivo `.env` en la raíz del proyecto. Este archivo **NO** debe subirse al repositorio (ya está incluido en `.gitignore`).

Para comenzar, copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` para añadir tus valores:

```
# Notificaciones Telegram
TELEGRAM_TO=tu_chat_id_aquí
TELEGRAM_TOKEN=tu_bot_token_aquí

# ... otras variables
```

### Verificación de la Configuración

Para verificar que las variables de entorno de Telegram están correctamente configuradas:

```bash
npm run verify:telegram
```

## Despliegue en Netlify

### Importar Variables a Netlify

Para importar todas las variables desde tu archivo `.env` local a Netlify:

1. Asegúrate de tener la CLI de Netlify instalada:
   ```bash
   npm install -g netlify-cli
   ```

2. Inicia sesión en Netlify:
   ```bash
   netlify login
   ```

3. Ejecuta el script de importación:
   ```bash
   npm run import:env:netlify
   ```

Este script importará automáticamente todas las variables definidas en tu archivo `.env` a la configuración de tu sitio en Netlify.

### Variables Manuales en Netlify

También puedes configurar las variables manualmente en la interfaz de Netlify:

1. Ve a la interfaz web de Netlify
2. Navega a Site settings > Build & deploy > Environment
3. Añade cada variable con su valor correspondiente

## GitHub Actions

Los workflows de GitHub Actions están configurados para usar las variables de entorno desde los secretos de GitHub.

### Configuración de Secretos en GitHub

1. Ve a la configuración del repositorio en GitHub
2. Navega a Settings > Secrets and variables > Actions
3. Añade cada variable como un secreto

Las siguientes variables deben configurarse como secretos:

- `TELEGRAM_TO`
- `TELEGRAM_TOKEN`
- `MAIL_SERVER`
- `MAIL_PORT` 
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### Script de Carga de Variables

Los workflows de GitHub Actions usan el script `scripts/load-env-vars.js` para cargar y validar las variables de entorno necesarias. Este script verifica que todas las variables críticas estén disponibles antes de la ejecución del workflow.

## Variables Requeridas

### Notificaciones Telegram

- `TELEGRAM_TO`: ID del chat donde enviar las notificaciones
- `TELEGRAM_TOKEN`: Token del bot de Telegram

### Correo Electrónico

- `MAIL_SERVER`: Servidor SMTP
- `MAIL_PORT`: Puerto del servidor SMTP
- `MAIL_USERNAME`: Nombre de usuario para el servidor SMTP
- `MAIL_PASSWORD`: Contraseña para el servidor SMTP

### Netlify

- `NETLIFY_AUTH_TOKEN`: Token de autenticación de Netlify
- `NETLIFY_SITE_ID`: ID del sitio en Netlify

## Notas de Seguridad

- **Nunca** subas el archivo `.env` al repositorio
- Rota tus secretos regularmente, especialmente los tokens de acceso
- Limita los permisos de los tokens a lo estrictamente necesario
- Verifica periódicamente el acceso a los secretos en GitHub y Netlify
