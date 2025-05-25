#!/usr/bin/env node

/**
 * Script para cargar variables de entorno en workflows de GitHub Actions
 * Este script se usa para cargar variables de un archivo .env o de secretos de GitHub
 * dependiendo del entorno en el que se ejecute.
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

// Importamos las variables necesarias para los workflows
const ENV_VARS = [
  // 'TELEGRAM_TO',
  // 'TELEGRAM_TOKEN',
  // 'MAIL_SERVER',
  // 'MAIL_PORT',
  // 'MAIL_USERNAME',
  // 'MAIL_PASSWORD',
  // 'NETLIFY_AUTH_TOKEN',
  // 'NETLIFY_SITE_ID'
];

// Función para cargar variables de entorno
function loadEnvVars() {
  // Verificar si estamos en GitHub Actions
  const isGitHubAction = process.env.GITHUB_ACTIONS === 'true';
  console.log(`Entorno detectado: ${isGitHubAction ? 'GitHub Actions' : 'Local'}`);

  const loadedVars = {};
  const missingVars = [];

  // Iterar a través de las variables requeridas
  for (const varName of ENV_VARS) {
    const varValue = process.env[varName];
    
    if (varValue) {
      loadedVars[varName] = varValue;
      console.log(`✅ Variable ${varName} cargada`);
    } else {
      missingVars.push(varName);
      console.log(`⚠️ Variable ${varName} no encontrada`);
    }
  }

  // Resumen
  console.log(`\nResumen de carga de variables de entorno:`);
  console.log(`- Total de variables requeridas: ${ENV_VARS.length}`);
  console.log(`- Variables cargadas: ${Object.keys(loadedVars).length}`);
  console.log(`- Variables faltantes: ${missingVars.length}`);

  if (missingVars.length > 0) {
    console.log(`\nVariables faltantes:`);
    missingVars.forEach(varName => console.log(`- ${varName}`));
  }

  // En GitHub Actions, exportar variables al entorno
  if (isGitHubAction) {
    const envFilePath = process.env.GITHUB_ENV;
    if (envFilePath) {
      Object.entries(loadedVars).forEach(([key, value]) => {
        fs.appendFileSync(envFilePath, `${key}=${value}\n`);
      });
      console.log(`\nVariables exportadas a GITHUB_ENV`);
    } else {
      console.error('❌ No se pudo acceder a GITHUB_ENV');
    }
  }

  return {
    loadedVars,
    missingVars
  };
}

// Ejecutar la función
const result = loadEnvVars();

// Salir con código de error si faltan variables críticas
const CRITICAL_VARS = ['TELEGRAM_TO', 'TELEGRAM_TOKEN', 'NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID'];
const missingCritical = result.missingVars.filter(v => CRITICAL_VARS.includes(v));

if (missingCritical.length > 0) {
  console.error('\n❌ Faltan variables críticas para el funcionamiento del workflow:');
  missingCritical.forEach(v => console.error(`- ${v}`));
  process.exit(1);
}

console.log('\n✅ Variables de entorno cargadas correctamente');
