#!/usr/bin/env node

/**
 * Script para probar la integración completa del sistema de actualizaciones automáticas
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = promisify(fs.readFile);
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

async function testDataIntegrity() {
  console.log('🔍 Verificando integridad de datos...\n');

  try {
    // Verificar archivo principal de Scholar
    const scholarPath = path.join(__dirname, '../src/data/scholar.json');
    const scholarData = JSON.parse(await readFile(scholarPath, 'utf8'));
    
    console.log('📊 Datos de Scholar:');
    console.log(`- Última actualización: ${new Date(scholarData.lastUpdated).toLocaleString('es-ES')}`);
    console.log(`- Total de publicaciones: ${scholarData.publications.length}`);
    console.log(`- Total de citas: ${scholarData.author.statistics.totalCitations}`);
    console.log(`- Índice h: ${scholarData.author.statistics.hIndex}`);
    console.log(`- Índice i10: ${scholarData.author.statistics.i10Index}`);

    // Verificar archivo detallado
    const detailedPath = path.join(__dirname, '../src/data/scholar-detailed.json');
    const detailedData = JSON.parse(await readFile(detailedPath, 'utf8'));
    
    console.log('\n📚 Datos detallados:');
    console.log(`- Publicaciones con detalles: ${detailedData.publications.length}`);
    console.log(`- Tamaño del archivo: ${Math.round((await stat(detailedPath)).size / 1024)} KB`);

    // Verificar archivo de paginación
    const paginationPath = path.join(__dirname, '../src/data/scholar-pagination.json');
    const paginationData = JSON.parse(await readFile(paginationPath, 'utf8'));
    
    console.log('\n📈 Análisis temporal:');
    console.log(`- Span de carrera: ${paginationData.temporalAnalysis.careerSpan} años`);
    console.log(`- Años activos: ${paginationData.temporalAnalysis.activeYears}`);
    console.log(`- Publicaciones por año:`, Object.entries(paginationData.temporalAnalysis.publicationsByYear).slice(-3));

    return true;
  } catch (error) {
    console.error('❌ Error verificando datos:', error.message);
    return false;
  }
}

async function testComponentsExist() {
  console.log('\n🧩 Verificando componentes...\n');

  const components = [
    '../src/components/ScholarMetrics.astro',
    '../src/components/RecentPublications.astro',
    '../src/pages/index.astro',
    '../src/pages/publicaciones.astro'
  ];

  let allExist = true;

  for (const component of components) {
    try {
      const componentPath = path.join(__dirname, component);
      await access(componentPath);
      console.log(`✅ ${component}`);
    } catch (error) {
      console.log(`❌ ${component} - No encontrado`);
      allExist = false;
    }
  }

  return allExist;
}

async function testWorkflowConfiguration() {
  console.log('\n⚙️ Verificando configuración de workflows...\n');

  try {
    // Verificar workflow de GitHub Actions
    const workflowPath = path.join(__dirname, '../.github/workflows/update-scholar-data.yml');
    await access(workflowPath);
    console.log('✅ Workflow de GitHub Actions existe');

    // Verificar función de Netlify
    const functionPath = path.join(__dirname, '../netlify/functions/update-scholar.js');
    await access(functionPath);
    console.log('✅ Función de Netlify existe');

    // Verificar configuración de Netlify
    const netlifyConfigPath = path.join(__dirname, '../netlify.toml');
    await access(netlifyConfigPath);
    console.log('✅ Configuración de Netlify existe');

    // Verificar script de scraping
    const scrapingScript = path.join(__dirname, 'scrape-scholar-advanced.js');
    await access(scrapingScript);
    console.log('✅ Script de scraping avanzado existe');

    return true;
  } catch (error) {
    console.error('❌ Error verificando configuración:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔐 Verificando variables de entorno...\n');

  const requiredVars = ['SERPAPI_API_KEY'];
  const optionalVars = ['GITHUB_TOKEN', 'NETLIFY_HOOK_URL', 'WEBHOOK_SECRET'];

  let allRequired = true;

  console.log('Variables requeridas:');
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Configurada`);
    } else {
      console.log(`❌ ${varName}: Faltante`);
      allRequired = false;
    }
  }

  console.log('\nVariables opcionales (para producción):');
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Configurada`);
    } else {
      console.log(`⚪ ${varName}: No configurada`);
    }
  }

  return allRequired;
}

async function generateReport() {
  console.log('\n📋 Generando reporte de integración...\n');

  const report = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  // Ejecutar todas las pruebas
  report.tests.dataIntegrity = await testDataIntegrity();
  report.tests.componentsExist = await testComponentsExist();
  report.tests.workflowConfiguration = await testWorkflowConfiguration();
  report.tests.environmentVariables = await testEnvironmentVariables();

  // Calcular estado general
  const allPassed = Object.values(report.tests).every(test => test);
  report.status = allPassed ? 'SUCCESS' : 'PARTIAL';

  // Guardar reporte
  const reportPath = path.join(__dirname, '../integration-test-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('\n📊 RESUMEN DE INTEGRACIÓN');
  console.log('================================================================================');
  console.log(`Estado: ${report.status === 'SUCCESS' ? '✅ ÉXITO' : '⚠️ PARCIAL'}`);
  console.log(`Fecha: ${new Date(report.timestamp).toLocaleString('es-ES')}`);
  console.log('\nPruebas:');
  console.log(`- Integridad de datos: ${report.tests.dataIntegrity ? '✅' : '❌'}`);
  console.log(`- Componentes: ${report.tests.componentsExist ? '✅' : '❌'}`);
  console.log(`- Configuración workflows: ${report.tests.workflowConfiguration ? '✅' : '❌'}`);
  console.log(`- Variables de entorno: ${report.tests.environmentVariables ? '✅' : '❌'}`);

  if (report.status === 'SUCCESS') {
    console.log('\n🎉 ¡Sistema listo para producción!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Configura las variables de entorno en GitHub y Netlify');
    console.log('2. Haz push de los cambios al repositorio');
    console.log('3. Verifica que el workflow se ejecute correctamente');
    console.log('4. Prueba la función de Netlify manualmente');
  } else {
    console.log('\n⚠️ Se requieren ajustes antes de la producción');
    console.log('Revisa los elementos marcados con ❌ arriba');
  }

  console.log(`\n📄 Reporte completo guardado en: integration-test-report.json`);
}

// Ejecutar pruebas
generateReport().catch(console.error);
