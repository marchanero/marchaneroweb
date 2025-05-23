# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! A continuación, encontrarás las instrucciones para configurar el entorno de desarrollo y los procedimientos para contribuir al código.

## Configuración del Entorno

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:4321`.

## Flujo de Trabajo para Contribuciones

1. **Crear una rama para tus cambios**

```bash
git checkout -b feature/nombre-de-la-caracteristica
```

2. **Hacer cambios y probar**

Después de realizar tus cambios, asegúrate de ejecutar las pruebas:

```bash
npm run test
```

3. **Realizar verificaciones previas al despliegue**

```bash
npm run pre-deploy
```

4. **Crear un Pull Request**

Cuando tus cambios estén listos, crea un Pull Request hacia la rama `main`.

## Lineamientos de Código

- Utiliza TypeScript para el código nuevo
- Sigue las convenciones de estilo existentes
- Documenta las funciones y componentes nuevos
- Añade pruebas para las nuevas características

## Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes y recursos
│   ├── components/      # Componentes reutilizables
│   ├── layouts/         # Layouts de Astro
│   └── pages/           # Páginas del sitio
├── test/                # Tests
└── scripts/             # Scripts de utilidad
```

## GitHub Actions

El proyecto utiliza GitHub Actions para CI/CD. Los flujos de trabajo incluyen:

- **CI/CD Pipeline**: Prueba, construye y despliega el sitio
- **Pull Request Validation**: Valida los Pull Requests
- **Quality Assurance**: Realiza pruebas de calidad y accesibilidad
- **Deployment Notifications**: Envía notificaciones tras el despliegue

## Despliegue

El despliegue en Netlify se realiza automáticamente cuando se fusionan cambios en la rama `main`. Para más detalles, consulta el archivo `DEPLOY.md`.
