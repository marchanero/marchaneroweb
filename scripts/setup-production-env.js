#!/usr/bin/env node

/**
 * Script para configurar variables de entorno en producción
 * Este script ayuda a configurar las variables necesarias en GitHub Secrets y Netlify
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 CONFIGURACIÓN DE VARIABLES DE ENTORNO PARA PRODUCCIÓN');
console.log('══════════════════════════════════════════════════════════');

// Variables requeridas
const requiredVars = {
  github: [
    {
      name: 'SERPAPI_API_KEY',
      description: 'API Key de SerpAPI para obtener datos de Google Scholar',
      sensitive: true,
      required: true
    },
    {
      name: 'GITHUB_TOKEN',
      description: 'Token de GitHub con permisos para workflows (auto-generado)',
      sensitive: true,
      required: true,
      note: 'Se genera automáticamente por GitHub Actions'
    },
    {
      name: 'NETLIFY_HOOK_URL',
      description: 'URL del webhook de Netlify para disparar builds',
      sensitive: false,
      required: true
    },
    {
      name: 'WEBHOOK_SECRET',
      description: 'Secreto para autenticar webhooks (opcional pero recomendado)',
      sensitive: true,
      required: false
    }
  ],
  netlify: [
    {
      name: 'GITHUB_TOKEN',
      description: 'Token de GitHub para disparar workflows desde Netlify',
      sensitive: true,
      required: true
    },
    {
      name: 'WEBHOOK_SECRET',
      description: 'Secreto para autenticar webhooks (debe coincidir con GitHub)',
      sensitive: true,
      required: false
    }
  ]
};

function generateInstructions() {
  console.log('📋 INSTRUCCIONES DE CONFIGURACIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n🔧 GITHUB SECRETS:');
  console.log('Ir a: https://github.com/rsanchezreolid/marchaneroweb/settings/secrets/actions');
  console.log('');
  
  requiredVars.github.forEach((variable, index) => {
    console.log(`${index + 1}. ${variable.name}`);
    console.log(`   Descripción: ${variable.description}`);
    if (variable.note) {
      console.log(`   Nota: ${variable.note}`);
    }
    console.log(`   Requerido: ${variable.required ? 'Sí' : 'No'}`);
    console.log(`   Sensible: ${variable.sensitive ? 'Sí' : 'No'}`);
    console.log('');
  });
  
  console.log('\n🌐 NETLIFY ENVIRONMENT VARIABLES:');
  console.log('Ir a: https://app.netlify.com/sites/[tu-sitio]/settings/env');
  console.log('');
  
  requiredVars.netlify.forEach((variable, index) => {
    console.log(`${index + 1}. ${variable.name}`);
    console.log(`   Descripción: ${variable.description}`);
    console.log(`   Requerido: ${variable.required ? 'Sí' : 'No'}`);
    console.log(`   Sensible: ${variable.sensitive ? 'Sí' : 'No'}`);
    console.log('');
  });
}

function generateEnvTemplate() {
  console.log('\n📄 PLANTILLA DE VARIABLES (.env):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const envTemplate = `# Variables de entorno para el sistema de Scholar Scraping
# ⚠️  NO COMMITEAR ESTE ARCHIVO - Está en .gitignore

# SerpAPI para obtener datos de Google Scholar
SERPAPI_API_KEY=your_serpapi_key_here

# GitHub Token para disparar workflows
GITHUB_TOKEN=your_github_token_here

# Netlify webhook URL para disparar builds
NETLIFY_HOOK_URL=https://api.netlify.com/build_hooks/your_hook_id

# Secreto para autenticar webhooks (opcional)
WEBHOOK_SECRET=your_random_secret_here
`;

  console.log(envTemplate);
  
  // Guardar plantilla en archivo
  fs.writeFileSync('.env.template', envTemplate);
  console.log('✅ Plantilla guardada en .env.template');
}

function checkCurrentEnv() {
  console.log('\n🔍 VERIFICACIÓN DE VARIABLES LOCALES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const envFile = '.env';
  if (fs.existsSync(envFile)) {
    console.log('✅ Archivo .env encontrado');
    
    const envContent = fs.readFileSync(envFile, 'utf8');
    const envVars = envContent.split('\n')
      .filter(line => line.includes('=') && !line.startsWith('#'))
      .map(line => line.split('=')[0]);
    
    const allRequiredVars = [...new Set([
      ...requiredVars.github.map(v => v.name),
      ...requiredVars.netlify.map(v => v.name)
    ])];
    
    allRequiredVars.forEach(varName => {
      const hasVar = envVars.includes(varName);
      console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`);
    });
  } else {
    console.log('❌ Archivo .env no encontrado');
    console.log('💡 Usa .env.template como referencia');
  }
}

function generateCommands() {
  console.log('\n⚡ COMANDOS ÚTILES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n# Probar el sistema localmente:');
  console.log('npm run test:integration');
  
  console.log('\n# Ejecutar scraping manual:');
  console.log('node scripts/scrape-scholar-advanced.js');
  
  console.log('\n# Verificar sistema completo:');
  console.log('node scripts/verify-complete-system.js');
  
  console.log('\n# Disparar workflow manualmente:');
  console.log('gh workflow run update-scholar-data.yml');
  
  console.log('\n# Ver logs del último workflow:');
  console.log('gh run list --workflow=update-scholar-data.yml');
}

function generateChecklist() {
  console.log('\n✅ CHECKLIST DE DESPLIEGUE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const checklist = [
    '□ Configurar SERPAPI_API_KEY en GitHub Secrets',
    '□ Configurar NETLIFY_HOOK_URL en GitHub Secrets',
    '□ Configurar WEBHOOK_SECRET en GitHub Secrets (opcional)',
    '□ Configurar GITHUB_TOKEN en Netlify Environment Variables',
    '□ Configurar WEBHOOK_SECRET en Netlify Environment Variables (opcional)',
    '□ Verificar que el repositorio esté público o que los secrets estén configurados',
    '□ Hacer push de todos los cambios',
    '□ Probar el workflow manualmente desde GitHub Actions',
    '□ Verificar que Netlify se despliega correctamente',
    '□ Probar la función de Netlify para updates manuales',
    '□ Verificar que las métricas se muestran en el sitio web'
  ];
  
  checklist.forEach(item => console.log(`  ${item}`));
}

// Ejecutar todas las funciones
generateInstructions();
generateEnvTemplate();
checkCurrentEnv();
generateCommands();
generateChecklist();

console.log('\n🎉 CONFIGURACIÓN COMPLETADA');
console.log('══════════════════════════════════════════════════════════');
console.log('📖 Sigue las instrucciones anteriores para configurar las variables de entorno');
console.log('🚀 Una vez configuradas, el sistema funcionará automáticamente');
console.log('');
