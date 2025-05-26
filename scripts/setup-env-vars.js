#!/usr/bin/env node

/**
 * Script para configurar las variables de entorno necesarias para actualizaciones automáticas
 * de Google Scholar en GitHub Actions y Netlify
 */

import https from 'https';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🔧 Configuración de variables de entorno para actualizaciones automáticas');
  console.log('================================================================================\n');

  console.log('📋 Variables necesarias:');
  console.log('1. SERPAPI_API_KEY - Para scraping de Google Scholar');
  console.log('2. GITHUB_TOKEN - Para disparar workflows de GitHub Actions');
  console.log('3. NETLIFY_HOOK_URL - Para disparar builds de Netlify');
  console.log('4. WEBHOOK_SECRET (opcional) - Para autenticación del webhook\n');

  console.log('🔑 Configuración de GitHub Secrets:');
  console.log('Ve a: https://github.com/rsanchezreolid/marchaneroweb/settings/secrets/actions');
  console.log('Y añade las siguientes variables:\n');

  // SERPAPI_API_KEY
  const serpapiKey = await question('Introduce tu SERPAPI_API_KEY: ');
  if (serpapiKey) {
    console.log('✅ SERPAPI_API_KEY configurada');
  }

  // GITHUB_TOKEN
  console.log('\n📝 Para GITHUB_TOKEN:');
  console.log('1. Ve a https://github.com/settings/tokens');
  console.log('2. Genera un token con permisos: repo, workflow');
  const githubToken = await question('Introduce tu GITHUB_TOKEN: ');
  if (githubToken) {
    console.log('✅ GITHUB_TOKEN configurada');
  }

  // NETLIFY_HOOK_URL
  console.log('\n🌐 Para NETLIFY_HOOK_URL:');
  console.log('1. Ve a tu dashboard de Netlify');
  console.log('2. Site settings → Build & deploy → Build hooks');
  console.log('3. Crea un nuevo hook llamado "Scholar Data Update"');
  const netlifyHook = await question('Introduce tu NETLIFY_HOOK_URL: ');
  if (netlifyHook) {
    console.log('✅ NETLIFY_HOOK_URL configurada');
  }

  // WEBHOOK_SECRET (opcional)
  const webhookSecret = await question('Introduce un WEBHOOK_SECRET (opcional, presiona Enter para omitir): ');
  if (webhookSecret) {
    console.log('✅ WEBHOOK_SECRET configurada');
  }

  console.log('\n📄 Resumen de configuración:');
  console.log('================================================================================');
  console.log('GitHub Secrets a configurar:');
  console.log(`- SERPAPI_API_KEY: ${serpapiKey ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- GITHUB_TOKEN: ${githubToken ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- NETLIFY_HOOK_URL: ${netlifyHook ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`- WEBHOOK_SECRET: ${webhookSecret ? '✅ Configurada' : '⚪ Opcional'}`);

  console.log('\n🚀 Próximos pasos:');
  console.log('1. Configura las variables en GitHub Secrets');
  console.log('2. Configura las variables en Netlify (Environment variables)');
  console.log('3. Prueba el workflow manualmente desde GitHub Actions');
  console.log('4. El sistema se ejecutará automáticamente cada día a las 6:00 AM UTC');

  console.log('\n📖 Documentación adicional:');
  console.log('- Workflow: .github/workflows/update-scholar-data.yml');
  console.log('- Función Netlify: netlify/functions/update-scholar.js');
  console.log('- Script de scraping: scripts/scrape-scholar-advanced.js');

  // Generar comandos para configurar variables de entorno localmente (para pruebas)
  console.log('\n🧪 Para pruebas locales, crea un archivo .env con:');
  console.log('================================================================================');
  if (serpapiKey) console.log(`SERPAPI_API_KEY=${serpapiKey}`);
  if (githubToken) console.log(`GITHUB_TOKEN=${githubToken}`);
  if (netlifyHook) console.log(`NETLIFY_HOOK_URL=${netlifyHook}`);
  if (webhookSecret) console.log(`WEBHOOK_SECRET=${webhookSecret}`);

  rl.close();
}

main().catch(console.error);
