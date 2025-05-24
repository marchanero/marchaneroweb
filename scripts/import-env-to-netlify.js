#!/usr/bin/env node

/**
 * Script para importar variables de entorno a Netlify desde el archivo .env local
 * 
 * Para usar este script:
 * 1. Asegúrate de que el archivo .env está correctamente configurado
 * 2. Ejecuta: npm run import:env:netlify
 */

require('dotenv').config();
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verificar que el archivo .env existe
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env en el directorio actual');
  console.log('Por favor, crea el archivo .env basado en .env.example');
  process.exit(1);
}

// Verificar que la CLI de Netlify está instalada
const netlifyCheck = spawnSync('netlify', ['--version'], { encoding: 'utf8' });
if (netlifyCheck.status !== 0) {
  console.error('❌ La CLI de Netlify no está instalada. Instálala con: npm install -g netlify-cli');
  process.exit(1);
}

// Verificar que el usuario está autenticado en Netlify
const authCheck = spawnSync('netlify', ['status'], { encoding: 'utf8' });
if (authCheck.stderr && authCheck.stderr.includes('Not logged in')) {
  console.error('❌ No has iniciado sesión en Netlify. Ejecuta: netlify login');
  process.exit(1);
}

console.log('🔍 Importando variables de entorno desde .env a Netlify...');

// Leer todas las variables del archivo .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('='); // Por si hay '=' en el valor
    return { key: key.trim(), value: value.trim() };
  })
  .filter(({ key, value }) => key && value);

// Verificar si hay variables para importar
if (envVars.length === 0) {
  console.error('❌ No se encontraron variables válidas en el archivo .env');
  process.exit(1);
}

console.log(`📋 Variables encontradas: ${envVars.length}`);

// Importar cada variable a Netlify
let importedCount = 0;
let skippedCount = 0;

for (const { key, value } of envVars) {
  if (!value) {
    console.log(`⚠️ La variable ${key} está vacía, saltando...`);
    skippedCount++;
    continue;
  }

  console.log(`🔒 Importando ${key}...`);
  
  // Usar la CLI de Netlify para configurar la variable
  const result = spawnSync('netlify', ['env:set', key, value], { 
    encoding: 'utf8',
    stdio: 'pipe' // Capturar la salida para no mostrar valores sensibles
  });

  if (result.status !== 0) {
    console.error(`❌ Error al importar ${key}: ${result.stderr}`);
  } else {
    console.log(`✅ Variable ${key} importada correctamente`);
    importedCount++;
  }
}

console.log('\n📊 Resumen:');
console.log(`✅ Variables importadas: ${importedCount}`);
console.log(`⚠️ Variables saltadas: ${skippedCount}`);
console.log(`🔒 Total procesado: ${envVars.length}`);

if (importedCount > 0) {
  console.log('\n🚀 Variables de entorno importadas correctamente a Netlify');
  console.log('ℹ️ Puedes verificarlas en: https://app.netlify.com/sites/[tu-sitio]/settings/env');
} else {
  console.error('\n❌ No se importó ninguna variable');
}

// Recordatorio de seguridad
console.log('\n⚠️ RECORDATORIO DE SEGURIDAD:');
console.log('No subas el archivo .env al repositorio');
console.log('Mantén tus secretos seguros y actualiza las variables según sea necesario');
