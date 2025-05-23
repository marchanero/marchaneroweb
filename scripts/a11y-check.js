#!/usr/bin/env node

/**
 * Script de verificación de accesibilidad
 * Este script ejecuta pruebas de accesibilidad en las páginas del sitio
 * usando pa11y-ci con una configuración especial para entornos CI.
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');

// Función para ejecutar las pruebas de accesibilidad
async function runA11yTests() {
  console.log(chalk.blue('✓ Ejecutando pruebas de accesibilidad...'));
  
  try {
    // Iniciar el servidor en segundo plano
    const serverProcess = execSync('npx serve dist -s -p 3000 &', { stdio: 'pipe' });
    
    // Esperar a que el servidor esté listo
    console.log(chalk.blue('  Esperando 5 segundos a que el servidor esté listo...'));
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Ejecutar pa11y-ci
    console.log(chalk.blue('  Ejecutando pa11y-ci con la configuración personalizada...'));
    execSync('npx pa11y-ci --config .pa11yci.json', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--no-warnings' // Suprimir advertencias de Node
      }
    });
    
    // Matar el proceso del servidor
    execSync('pkill -f "serve dist"', { stdio: 'pipe' });
    
    console.log(chalk.green('✓ Pruebas de accesibilidad completadas con éxito'));
    return true;
  } catch (error) {
    // Asegurarse de matar el proceso del servidor incluso en caso de error
    try {
      execSync('pkill -f "serve dist"', { stdio: 'pipe' });
    } catch (e) {
      // Ignorar errores al intentar matar el proceso
    }
    
    console.log(chalk.red('✗ Las pruebas de accesibilidad han fallado'));
    console.log(chalk.red(`  Error: ${error.message}`));
    
    // Mostrar consejos para resolver problemas comunes
    console.log(chalk.yellow('\nSoluciones comunes para problemas de accesibilidad:'));
    console.log(chalk.yellow('1. Asegúrate de que todas las imágenes tienen atributos alt'));
    console.log(chalk.yellow('2. Verifica que los elementos interactivos son accesibles por teclado'));
    console.log(chalk.yellow('3. Comprueba que el contraste de color es adecuado'));
    console.log(chalk.yellow('4. Añade etiquetas a los campos de formulario'));
    console.log(chalk.yellow('5. Estructura correctamente los encabezados (h1, h2, etc.)'));
    console.log(chalk.yellow('\nPara más información, consulta: https://www.w3.org/WAI/WCAG21/quickref/'));
    
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runA11yTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = runA11yTests;
