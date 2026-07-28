# Despliegue en Netlify

Este documento contiene las instrucciones para desplegar tu sitio web personal en Netlify.

## Opción 1: Despliegue desde GitHub

1. **Sube tu repositorio a GitHub**
   ```bash
   # Inicializa el repositorio (ya se hizo)
   # git init
   
   # Añade todos los archivos
   git add .
   
   # Crea un commit con tus cambios
   git commit -m "Versión inicial del sitio web personal"
   
   # Añade el repositorio remoto (reemplaza con tu URL de GitHub)
   git remote add origin https://github.com/tu-usuario/tu-repositorio.git
   
   # Sube los cambios
   git push -u origin main
   ```

2. **Conecta con Netlify**
   - Inicia sesión en [Netlify](https://app.netlify.com/)
   - Haz clic en "New site from Git"
   - Selecciona GitHub y autoriza a Netlify
   - Busca y selecciona tu repositorio
   - En la configuración de despliegue:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Haz clic en "Deploy site"

## Opción 2: Despliegue manual desde línea de comandos

1. **Instala la CLI de Netlify**
   ```bash
   npm install netlify-cli -g
   ```

2. **Inicia sesión en Netlify**
   ```bash
   netlify login
   ```

3. **Inicializa tu sitio**
   ```bash
   netlify init
   ```

4. **Despliega tu sitio**
   ```bash
   netlify deploy --prod
   ```

## Configuración del dominio personalizado

Una vez que el sitio esté desplegado:

1. En el dashboard de Netlify, selecciona tu sitio
2. Ve a "Domain settings"
3. Haz clic en "Add custom domain"
4. Sigue las instrucciones para configurar tu dominio personalizado

## Configuración del formulario de contacto

El formulario de contacto ya está configurado para funcionar con Netlify Forms. Una vez desplegado el sitio:

1. En el dashboard de Netlify, selecciona tu sitio
2. Ve a "Forms"
3. Deberías ver un formulario llamado "contact"
4. Aquí podrás gestionar todos los mensajes recibidos
