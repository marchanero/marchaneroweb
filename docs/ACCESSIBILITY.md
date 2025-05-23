# Solución de problemas de accesibilidad y Chromium Sandbox

Este documento explica cómo resolver problemas comunes relacionados con las pruebas de accesibilidad y el sandbox de Chromium en diferentes entornos.

## Problema del Sandbox en Chromium

Cuando ejecutamos pruebas de accesibilidad con pa11y-ci (que utiliza Puppeteer y Chromium), podemos encontrar el siguiente error:

```
No usable sandbox! Update your kernel or see https://chromium.googlesource.com/chromium/src/+/master/docs/linux/suid_sandbox_development.md for more information on developing with the SUID sandbox. If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.
```

### Solución implementada

Hemos configurado pa11y-ci para usar las siguientes opciones que resuelven este problema:

1. En el archivo `.pa11yci.json`:
```json
{
  "defaults": {
    "chromeLaunchConfig": {
      "args": ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    }
  }
}
```

2. En GitHub Actions:
   - Utilizamos la instalación local de pa11y-ci en lugar de la global.
   - Ejecutamos directamente el script `npm run test:a11y` que contiene la configuración adecuada.

## Ejecutando pruebas de accesibilidad localmente

Para ejecutar pruebas de accesibilidad en tu entorno local:

1. Asegúrate de que el sitio está compilado:
```bash
npm run build
```

2. Ejecuta las pruebas de accesibilidad:
```bash
npm run test:a11y
```

## Verificación previa al despliegue con pruebas de accesibilidad

Si deseas incluir las pruebas de accesibilidad como parte de la verificación previa al despliegue:

```bash
npm run deploy:a11y
```

Este comando:
1. Compila el sitio
2. Ejecuta todas las verificaciones estándar
3. Ejecuta las pruebas de accesibilidad
4. Si todo es correcto, vuelve a compilar el sitio para su despliegue

## Problemas comunes de accesibilidad

Si las pruebas de accesibilidad fallan, los problemas más comunes son:

1. **Imágenes sin texto alternativo**: Asegúrate de que todas las imágenes tienen un atributo `alt` apropiado.
2. **Contraste de color insuficiente**: Verifica que el contraste entre texto y fondo cumple con las pautas WCAG.
3. **Elementos interactivos no accesibles por teclado**: Todos los botones, enlaces y elementos interactivos deben ser accesibles mediante teclado.
4. **Formularios sin etiquetas**: Cada campo de formulario debe tener una etiqueta asociada.
5. **Estructura incorrecta de encabezados**: Asegúrate de usar encabezados (h1-h6) en orden jerárquico.

## Referencias

- [Pa11y-ci Configuration Documentation](https://github.com/pa11y/pa11y-ci#configuration)
- [Chromium Sandbox Issues](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
