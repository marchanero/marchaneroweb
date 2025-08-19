#!/usr/bin/env node

/**
 * Script de verificación previa al despliegue
 * Este script realiza comprobaciones básicas para asegurarse de que
 * el sitio está listo para ser desplegado.
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Directorios y archivos esenciales que deben existir
const requiredFiles = [
  'astro.config.mjs',
  'netlify.toml',
  'src/pages/index.astro',
  'src/layouts/Layout.astro',
  'public/favicon.svg'
];

// Verifica la existencia de archivos requeridos
function checkRequiredFiles() {
  console.log(chalk.blue('✓ Verificando archivos esenciales...'));
  
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.log(chalk.red('✗ Faltan archivos requeridos:'));
    missingFiles.forEach(file => console.log(chalk.red(`  - ${file}`)));
    return false;
  }
  
  console.log(chalk.green('✓ Todos los archivos esenciales están presentes'));
  return true;
}

// Verifica las rutas definidas en las páginas
function checkPagesRoutes() {
  console.log(chalk.blue('✓ Verificando rutas de páginas...'));
  
  const pagesDir = path.join(process.cwd(), 'src/pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.log(chalk.red('✗ Directorio de páginas no encontrado'));
    return false;
  }
  
  const pages = [
    'index.astro',
    'sobre-mi.astro',
    'proyectos.astro',
    'contacto.astro'
  ];
  
  const missingPages = [];
  
  for (const page of pages) {
    const pagePath = path.join(pagesDir, page);
    
    if (!fs.existsSync(pagePath)) {
      missingPages.push(page);
    }
  }
  
  if (missingPages.length > 0) {
    console.log(chalk.red('✗ Faltan páginas importantes:'));
    missingPages.forEach(page => console.log(chalk.red(`  - ${page}`)));
    return false;
  }
  
  console.log(chalk.green('✓ Todas las rutas importantes están definidas'));
  return true;
}

// Verifica que las URLs dentro del contenido sean coherentes
function checkContentUrls() {
  console.log(chalk.blue('✓ Verificando URLs en el contenido...'));
  
  const contentFiles = [
    'src/pages/index.astro',
    'src/pages/sobre-mi.astro',
    'src/pages/proyectos.astro',
    'src/pages/contacto.astro',
    'src/layouts/Layout.astro'
  ];
  
  const validInternalUrls = [
    '/',
    '/sobre-mi',
    '/proyectos',
    '/contacto'
  ];
  
  const problematicUrls = [];
  
  for (const file of contentFiles) {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Buscar href que comienzan con / pero no son rutas válidas
      const hrefMatches = content.match(/href=["']\/[^"']+["']/g) || [];
      
      for (const match of hrefMatches) {
        const href = match.match(/href=["']([^"']+)["']/)[1];
        
        // Solo nos preocupamos por rutas internas
        if (href.startsWith('/') && !href.startsWith('//')) {
          const isValid = validInternalUrls.some(validUrl => 
            href === validUrl || href.startsWith(`${validUrl}/`)
          );
          
          if (!isValid && !href.startsWith('/assets/') && !href.startsWith('/images/')) {
            problematicUrls.push({ file, url: href });
          }
        }
      }
    }
  }
  
  if (problematicUrls.length > 0) {
    console.log(chalk.yellow('⚠ Posibles URLs problemáticas encontradas:'));
    problematicUrls.forEach(({ file, url }) => {
      console.log(chalk.yellow(`  - ${file}: ${url}`));
    });
    console.log(chalk.yellow('  Revisa que estas rutas existan o actualízalas'));
    // Advertencia pero no falla la verificación
  } else {
    console.log(chalk.green('✓ No se encontraron URLs problemáticas'));
  }
  
  return true;
}

// Verificar accesibilidad (opcional)
async function checkAccessibility() {
  console.log(chalk.blue('✓ Verificando accesibilidad...'));
  
  try {
    // Verificamos si existe el build directory
    if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
      console.log(chalk.yellow('⚠ No se encontró el directorio dist, no se pueden ejecutar pruebas de accesibilidad.'));
      console.log(chalk.yellow('  Ejecute primero "npm run build" para generar el sitio.'));
      return true; // No bloqueamos el despliegue
    }

    // Intentamos importar el script de verificación de accesibilidad
    try {
      const { default: runA11yTests } = await import('./a11y-check.js');
      const success = await runA11yTests();
      return success;
    } catch (err) {
      console.log(chalk.yellow('⚠ No se pudieron ejecutar las pruebas de accesibilidad:'));
      console.log(chalk.yellow(`  ${err.message}`));
      // No bloqueamos el despliegue si hay un error en las pruebas de accesibilidad
      return true;
    }
  } catch (error) {
    console.log(chalk.yellow('⚠ Error al verificar la accesibilidad:'));
    console.log(chalk.yellow(`  ${error.message}`));
    // No bloqueamos el despliegue si hay un error en las pruebas de accesibilidad
    return true;
  }
}

// Función principal
async function runChecks() {
  console.log(chalk.bold('\n🚀 Realizando verificaciones previas al despliegue...\n'));
  
  const results = [
    checkRequiredFiles(),
    checkPagesRoutes(),
    checkContentUrls()
  ];
  
  // Añadimos la verificación de accesibilidad si existe el directorio dist
  if (process.argv.includes('--with-a11y')) {
    results.push(await checkAccessibility());
  }
  
  const success = results.every(result => result);
  
  if (success) {
    console.log(chalk.bold.green('\n✅ El sitio está listo para ser desplegado!\n'));
    process.exit(0);
  } else {
    console.log(chalk.bold.red('\n❌ Se encontraron problemas que deben ser resueltos antes del despliegue.\n'));
    process.exit(1);
  }
}

// Ejecutar verificaciones
runChecks().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});
