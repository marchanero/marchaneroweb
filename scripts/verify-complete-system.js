#!/usr/bin/env node

/**
 * Script de verificación completa del sistema de scraping de Google Scholar
 * 
 * Este script verifica que todos los componentes del sistema estén funcionando correctamente:
 * 1. Scripts de scraping
 * 2. Archivos de datos generados
 * 3. Análisis de paginación
 * 4. Resumen ejecutivo
 * 5. GitHub Actions workflow
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class SystemVerification {
  constructor() {
    this.results = {
      scripts: {},
      dataFiles: {},
      analysis: {},
      recommendations: []
    };
  }

  checkScriptExists(scriptName) {
    const scriptPath = `./scripts/${scriptName}`;
    const exists = fs.existsSync(scriptPath);
    
    if (exists) {
      const stats = fs.statSync(scriptPath);
      this.results.scripts[scriptName] = {
        exists: true,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        status: 'OK'
      };
    } else {
      this.results.scripts[scriptName] = {
        exists: false,
        status: 'ERROR'
      };
    }
    
    return exists;
  }

  checkDataFile(fileName) {
    const filePath = `./src/data/${fileName}`;
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const stats = fs.statSync(filePath);
        
        this.results.dataFiles[fileName] = {
          exists: true,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          recordCount: this.getRecordCount(data),
          dataQuality: this.assessDataQuality(data),
          status: 'OK'
        };
      } catch (error) {
        this.results.dataFiles[fileName] = {
          exists: true,
          status: 'ERROR',
          error: 'Invalid JSON format'
        };
      }
    } else {
      this.results.dataFiles[fileName] = {
        exists: false,
        status: 'ERROR'
      };
    }
    
    return exists;
  }

  getRecordCount(data) {
    if (data.publications) return data.publications.length;
    if (data.articles) return data.articles.length;
    if (data.detailedArticles) return data.detailedArticles.length;
    if (data.pagination) return data.pagination.totalArticles;
    if (Array.isArray(data)) return data.length;
    return Object.keys(data).length;
  }

  assessDataQuality(data) {
    const quality = {
      score: 0,
      issues: []
    };

    // Verificar completitud de datos
    if (data.author && data.author.name) quality.score += 20;
    else quality.issues.push('Información del autor incompleta');

    if (data.publications && data.publications.length > 0) quality.score += 30;
    else if (data.articles && data.articles.length > 0) quality.score += 30;
    else quality.issues.push('No hay publicaciones/artículos');

    if (data.metrics || (data.author && data.author.totalCitations)) quality.score += 20;
    else quality.issues.push('Métricas de citación faltantes');

    if (data.lastUpdated) quality.score += 15;
    else quality.issues.push('Fecha de actualización faltante');

    // Verificar actualidad de los datos
    if (data.lastUpdated) {
      const lastUpdate = new Date(data.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate <= 7) quality.score += 15;
      else if (daysSinceUpdate <= 30) quality.score += 10;
      else quality.issues.push(`Datos desactualizados (${Math.floor(daysSinceUpdate)} días)`);
    }

    return {
      score: Math.min(quality.score, 100),
      grade: this.getGrade(quality.score),
      issues: quality.issues
    };
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  checkWorkflowFile() {
    const workflowPath = './.github/workflows/run-tests.yml';
    const exists = fs.existsSync(workflowPath);
    
    if (exists) {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const hasOutputs = content.includes('outputs:');
      const hasProperConditions = content.includes('needs.test.outputs.');
      const hasGitHubCLI = content.includes('gh pr create') || content.includes('gh issue create');
      
      this.results.workflow = {
        exists: true,
        hasOutputs: hasOutputs,
        hasProperConditions: hasProperConditions,
        usesGitHubCLI: hasGitHubCLI,
        status: (hasOutputs && hasProperConditions) ? 'OK' : 'NEEDS_IMPROVEMENT'
      };
    } else {
      this.results.workflow = {
        exists: false,
        status: 'ERROR'
      };
    }
    
    return exists;
  }

  runVerification() {
    console.log('🔍 Iniciando verificación completa del sistema...\n');

    // Verificar scripts
    console.log('📜 Verificando scripts...');
    const scripts = [
      'scrape-scholar.js',
      'scrape-scholar-advanced.js',
      'analyze-pagination.js',
      'generate-executive-summary.js',
      'fetch-scholar.js'
    ];

    scripts.forEach(script => {
      const exists = this.checkScriptExists(script);
      console.log(`  ${exists ? '✅' : '❌'} ${script}`);
    });

    // Verificar archivos de datos
    console.log('\n📊 Verificando archivos de datos...');
    const dataFiles = [
      'scholar.json',
      'scholar-detailed.json',
      'scholar-pagination.json',
      'scholar-executive-summary.json'
    ];

    dataFiles.forEach(file => {
      const exists = this.checkDataFile(file);
      const result = this.results.dataFiles[file];
      console.log(`  ${exists ? '✅' : '❌'} ${file} ${exists ? `(${result.recordCount} records, Grade: ${result.dataQuality.grade})` : ''}`);
    });

    // Verificar workflow de GitHub Actions
    console.log('\n⚙️ Verificando GitHub Actions workflow...');
    const workflowExists = this.checkWorkflowFile();
    console.log(`  ${workflowExists ? '✅' : '❌'} run-tests.yml ${workflowExists ? `(${this.results.workflow.status})` : ''}`);

    // Generar análisis y recomendaciones
    this.generateAnalysis();
    this.generateRecommendations();

    // Mostrar resumen
    this.displaySummary();
  }

  generateAnalysis() {
    const scriptsOK = Object.values(this.results.scripts).filter(s => s.status === 'OK').length;
    const dataFilesOK = Object.values(this.results.dataFiles).filter(d => d.status === 'OK').length;
    const workflowOK = this.results.workflow?.status === 'OK';

    this.results.analysis = {
      scriptsHealth: `${scriptsOK}/${Object.keys(this.results.scripts).length}`,
      dataFilesHealth: `${dataFilesOK}/${Object.keys(this.results.dataFiles).length}`,
      workflowHealth: workflowOK ? 'OK' : 'NEEDS_ATTENTION',
      overallHealth: (scriptsOK === Object.keys(this.results.scripts).length && 
                     dataFilesOK === Object.keys(this.results.dataFiles).length && 
                     workflowOK) ? 'EXCELLENT' : 'GOOD',
      dataFreshness: this.assessDataFreshness(),
      systemReadiness: this.assessSystemReadiness()
    };
  }

  assessDataFreshness() {
    const scholarData = this.results.dataFiles['scholar.json'];
    if (!scholarData || !scholarData.exists) return 'UNKNOWN';

    try {
      const data = JSON.parse(fs.readFileSync('./src/data/scholar.json', 'utf8'));
      if (data.lastUpdated) {
        const lastUpdate = new Date(data.lastUpdated);
        const now = new Date();
        const hoursOld = (now - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursOld <= 24) return 'FRESH';
        if (hoursOld <= 168) return 'RECENT'; // 1 week
        return 'STALE';
      }
    } catch (error) {
      return 'UNKNOWN';
    }
    
    return 'UNKNOWN';
  }

  assessSystemReadiness() {
    const criticalComponents = [
      this.results.scripts['scrape-scholar.js']?.status === 'OK',
      this.results.dataFiles['scholar.json']?.status === 'OK',
      this.results.workflow?.status === 'OK'
    ];

    const readyComponents = criticalComponents.filter(Boolean).length;
    
    if (readyComponents === criticalComponents.length) return 'PRODUCTION_READY';
    if (readyComponents >= 2) return 'MOSTLY_READY';
    return 'NEEDS_WORK';
  }

  generateRecommendations() {
    // Recomendaciones basadas en scripts
    Object.entries(this.results.scripts).forEach(([script, result]) => {
      if (result.status === 'ERROR') {
        this.results.recommendations.push({
          priority: 'HIGH',
          category: 'Scripts',
          issue: `Script ${script} no encontrado`,
          action: `Crear o restaurar el script ${script}`
        });
      }
    });

    // Recomendaciones basadas en datos
    Object.entries(this.results.dataFiles).forEach(([file, result]) => {
      if (result.status === 'ERROR') {
        this.results.recommendations.push({
          priority: 'HIGH',
          category: 'Data',
          issue: `Archivo de datos ${file} inválido o faltante`,
          action: `Ejecutar scripts de scraping para regenerar ${file}`
        });
      } else if (result.dataQuality && result.dataQuality.score < 70) {
        this.results.recommendations.push({
          priority: 'MEDIUM',
          category: 'Data Quality',
          issue: `Calidad de datos baja en ${file} (Grade: ${result.dataQuality.grade})`,
          action: `Revisar y mejorar la calidad de datos: ${result.dataQuality.issues.join(', ')}`
        });
      }
    });

    // Recomendaciones de workflow
    if (this.results.workflow?.status !== 'OK') {
      this.results.recommendations.push({
        priority: 'MEDIUM',
        category: 'CI/CD',
        issue: 'GitHub Actions workflow necesita mejoras',
        action: 'Revisar y corregir la configuración del workflow'
      });
    }

    // Recomendaciones de frescura de datos
    if (this.results.analysis.dataFreshness === 'STALE') {
      this.results.recommendations.push({
        priority: 'LOW',
        category: 'Maintenance',
        issue: 'Datos desactualizados',
        action: 'Ejecutar scraping para actualizar datos'
      });
    }
  }

  displaySummary() {
    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
    console.log('═'.repeat(50));
    
    console.log(`\n🏥 ESTADO GENERAL: ${this.results.analysis.overallHealth}`);
    console.log(`📜 Scripts: ${this.results.analysis.scriptsHealth}`);
    console.log(`📊 Archivos de datos: ${this.results.analysis.dataFilesHealth}`);
    console.log(`⚙️ Workflow: ${this.results.analysis.workflowHealth}`);
    console.log(`🕐 Frescura de datos: ${this.results.analysis.dataFreshness}`);
    console.log(`🚀 Preparación del sistema: ${this.results.analysis.systemReadiness}`);

    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority}] ${rec.category}: ${rec.action}`);
      });
    } else {
      console.log('\n✅ ¡No hay recomendaciones! El sistema está funcionando perfectamente.');
    }

    // Mostrar métricas clave si están disponibles
    if (this.results.dataFiles['scholar.json']?.exists) {
      try {
        const scholarData = JSON.parse(fs.readFileSync('./src/data/scholar.json', 'utf8'));
        console.log('\n📈 MÉTRICAS CLAVE:');
        console.log(`• Publicaciones: ${scholarData.publications?.length || 0}`);
        console.log(`• Citas totales: ${scholarData.metrics?.totalCitations || 0}`);
        console.log(`• Índice h: ${scholarData.metrics?.hIndex || 0}`);
        console.log(`• Última actualización: ${scholarData.lastUpdated ? new Date(scholarData.lastUpdated).toLocaleString() : 'Desconocida'}`);
      } catch (error) {
        console.log('\n⚠️ No se pudieron cargar las métricas clave');
      }
    }

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 Verificación completada');
  }

  saveResults() {
    const reportPath = './verification-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.analysis,
      details: this.results,
      recommendations: this.results.recommendations
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte detallado guardado en: ${reportPath}`);
  }
}

// Función principal
function main() {
  console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA DE SCHOLAR SCRAPING');
  console.log('═'.repeat(60));
  
  const verification = new SystemVerification();
  verification.runVerification();
  verification.saveResults();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SystemVerification;
