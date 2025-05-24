#!/usr/bin/env node

/**
 * Script para verificar la compatibilidad de Chromium/Puppeteer
 * Este script intenta iniciar una instancia de Chromium usando Puppeteer
 * para verificar si funciona en el entorno actual.
 */

const chalk = require('chalk');

async function checkChromium() {
  console.log(chalk.blue('✓ Verificando compatibilidad de Chromium/Puppeteer...'));
  
  try {
    // Intentamos importar puppeteer
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (e) {
      console.log(chalk.yellow('⚠ Puppeteer no está instalado. Instalándolo temporalmente...'));
      const { execSync } = require('child_process');
      execSync('npm install --no-save puppeteer', { stdio: 'inherit' });
      puppeteer = require('puppeteer');
    }
    
    console.log(chalk.blue('  Iniciando Chromium...'));
    
    // Intentamos primero sin modificar el sandbox
    try {
      console.log(chalk.blue('  Intentando con la configuración predeterminada...'));
      const browser1 = await puppeteer.launch({ timeout: 30000 });
      await browser1.close();
      console.log(chalk.green('✓ Chromium funciona correctamente con la configuración predeterminada'));
      return true;
    } catch (defaultError) {
      console.log(chalk.yellow(`⚠ Error con configuración predeterminada: ${defaultError.message}`));
      
      // Si falló, intentamos con --no-sandbox
      try {
        console.log(chalk.blue('  Intentando con --no-sandbox...'));
        const browser2 = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          timeout: 30000
        });
        await browser2.close();
        console.log(chalk.green('✓ Chromium funciona correctamente con --no-sandbox'));
        console.log(chalk.yellow('⚠ Tu entorno requiere la opción --no-sandbox para Chromium'));
        return true;
      } catch (noSandboxError) {
        console.log(chalk.red(`✗ Error incluso con --no-sandbox: ${noSandboxError.message}`));
        console.log(chalk.red('✗ Chromium no funciona en este entorno'));
        
        // Sugerencias para corregir el problema
        console.log(chalk.yellow('\nSugerencias para solucionar el problema:'));
        console.log(chalk.yellow('1. Asegúrate de que Chromium está instalado en el sistema'));
        console.log(chalk.yellow('2. Si estás en Linux, ejecuta:'));
        console.log(chalk.yellow('   sudo apt-get update && sudo apt-get install -y libgbm-dev libasound2'));
        console.log(chalk.yellow('3. Si estás en un entorno CI, asegúrate de que la imagen base tiene compatibilidad con navegadores'));
        
        return false;
      }
    }
  } catch (error) {
    console.log(chalk.red('✗ Error al verificar Chromium:'));
    console.log(chalk.red(`  ${error.message}`));
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkChromium()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = checkChromium;
