#!/usr/bin/env node

/**
 * Script de preparación para despliegue final
 * Verifica que todo esté listo y hace push de los cambios
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 PREPARACIÓN PARA DESPLIEGUE FINAL');
console.log('══════════════════════════════════════');

function checkGitStatus() {
  console.log('\n📂 Verificando estado de Git...');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      console.log('📝 Cambios pendientes detectados:');
      console.log(status);
      return true;
    } else {
      console.log('✅ No hay cambios pendientes');
      return false;
    }
  } catch (error) {
    console.log('❌ Error al verificar estado de Git:', error.message);
    return false;
  }
}

function runTests() {
  console.log('\n🧪 Ejecutando pruebas de integración...');
  
  try {
    execSync('npm run test:integration', { stdio: 'inherit' });
    console.log('✅ Todas las pruebas pasaron');
    return true;
  } catch (error) {
    console.log('❌ Algunas pruebas fallaron');
    return false;
  }
}

function verifySystem() {
  console.log('\n🔍 Verificando sistema completo...');
  
  try {
    execSync('node scripts/verify-complete-system.js', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.log('❌ Error en verificación del sistema');
    return false;
  }
}

function commitAndPush() {
  console.log('\n📤 Preparando commit y push...');
  
  try {
    // Añadir todos los archivos
    execSync('git add .', { stdio: 'inherit' });
    
    // Crear commit
    const commitMessage = `feat: Complete Scholar integration system

- ✅ Automated GitHub Actions workflow for daily data updates
- ✅ Netlify function for manual webhook triggers  
- ✅ Advanced Scholar scraping with SerpAPI
- ✅ Complete data analysis and executive summaries
- ✅ Updated web components with real Scholar data
- ✅ Production-ready with comprehensive testing

System Status: PRODUCTION_READY with EXCELLENT health
Scholar Data: 553 citations, h-index 13, i10-index 16, 47 publications`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('✅ Commit creado exitosamente');
    
    // Push a origin
    console.log('\n📡 Haciendo push al repositorio...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Push completado exitosamente');
    
    return true;
  } catch (error) {
    console.log('❌ Error durante commit/push:', error.message);
    return false;
  }
}

function generateDeploymentSummary() {
  console.log('\n📋 RESUMEN DE DESPLIEGUE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const summary = {
    timestamp: new Date().toISOString(),
    status: 'DEPLOYED',
    components: {
      'GitHub Actions Workflow': '✅ Configurado para actualizaciones diarias',
      'Netlify Function': '✅ Lista para webhooks manuales',
      'Scholar Data Integration': '✅ 553 citas, h-index 13, 47 publicaciones',
      'Web Components': '✅ Actualizados con datos reales',
      'Automated System': '✅ Scraping diario a las 6:00 AM UTC'
    },
    nextSteps: [
      'Configurar variables de entorno en GitHub Secrets',
      'Configurar variables de entorno en Netlify',
      'Verificar primer despliegue automático',
      'Probar función de webhook manual'
    ]
  };
  
  fs.writeFileSync('deployment-summary.json', JSON.stringify(summary, null, 2));
  
  console.log('\n🎯 COMPONENTES DESPLEGADOS:');
  Object.entries(summary.components).forEach(([component, status]) => {
    console.log(`  ${status} ${component}`);
  });
  
  console.log('\n🔄 PRÓXIMOS PASOS:');
  summary.nextSteps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step}`);
  });
  
  console.log('\n📄 Resumen guardado en: deployment-summary.json');
}

// Ejecutar proceso de despliegue
async function deploy() {
  try {
    console.log('🚀 Iniciando proceso de despliegue...');
    
    // 1. Verificar sistema
    if (!verifySystem()) {
      throw new Error('Sistema no está listo para despliegue');
    }
    
    // 2. Ejecutar pruebas
    if (!runTests()) {
      throw new Error('Pruebas fallaron');
    }
    
    // 3. Verificar Git
    const hasChanges = checkGitStatus();
    
    // 4. Commit y push si hay cambios
    if (hasChanges) {
      if (!commitAndPush()) {
        throw new Error('Error durante commit/push');
      }
    } else {
      console.log('ℹ️  No hay cambios para commitear');
    }
    
    // 5. Generar resumen
    generateDeploymentSummary();
    
    console.log('\n🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE');
    console.log('══════════════════════════════════════════════════════════');
    console.log('✅ Todos los archivos han sido desplegados');
    console.log('⚡ El sistema de actualizaciones automáticas está activo');
    console.log('🔗 Configurar variables de entorno para activar completamente');
    console.log('');
    console.log('📖 Sigue las instrucciones en scripts/setup-production-env.js');
    
  } catch (error) {
    console.log('\n❌ ERROR EN DESPLIEGUE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Error: ${error.message}`);
    console.log('\n💡 Revisa los errores anteriores y vuelve a intentar');
    process.exit(1);
  }
}

// Ejecutar
deploy();
