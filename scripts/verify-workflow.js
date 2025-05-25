#!/usr/bin/env node

/**
 * Script para verificar el workflow de despliegue a Netlify
 * 
 * Este script analiza el archivo deploy-netlify.yml para verificar
 * la estructura, dependencias entre jobs, configuración de despliegue
 * y validación de configuraciones específicas para el sitio web académico
 * del Dr. Roberto Sánchez Reolid.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');

// Ruta al archivo de workflow de Netlify
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy-netlify.yml');

console.log(chalk.blue.bold('🔍 Verificando estructura del workflow unificado...'));

try {
  // Verificar si el archivo existe
  if (!fs.existsSync(workflowPath)) {
    console.error(chalk.red('❌ Error: No se encontró el archivo unified-pipeline.yml'));
    process.exit(1);
  }

  // Cargar el contenido del archivo
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  // Analizar el YAML
  const workflow = yaml.load(workflowContent);
  
  // Verificar estructura básica
  if (!workflow.name) {
    console.warn(chalk.yellow('⚠️ Advertencia: El workflow no tiene un nombre definido'));
  } else {
    console.log(chalk.green(`✓ Nombre del workflow: ${workflow.name}`));
  }
  
  if (!workflow.on) {
    console.error(chalk.red('❌ Error: El workflow no tiene definidos los eventos que lo activan'));
    process.exit(1);
  } else {
    console.log(chalk.green('✓ Eventos del workflow correctamente definidos'));
    
    // Verificar los eventos específicos
    const events = Object.keys(workflow.on);
    console.log(chalk.green(`  - Eventos configurados: ${events.join(', ')}`));
  }
  
  if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
    console.error(chalk.red('❌ Error: El workflow no tiene jobs definidos'));
    process.exit(1);
  }
  
  // Analizar los jobs y sus dependencias
  const jobs = workflow.jobs;
  const jobNames = Object.keys(jobs);
  
  console.log(chalk.green(`✓ El workflow tiene ${jobNames.length} jobs definidos`));
  
  // Construir grafo de dependencias
  const dependencyGraph = {};
  const reverseDependencies = {};
  
  jobNames.forEach(jobName => {
    const job = jobs[jobName];
    dependencyGraph[jobName] = [];
    
    // Inicializar reverseDependencies para cada job
    if (!reverseDependencies[jobName]) {
      reverseDependencies[jobName] = [];
    }
    
    if (job.needs) {
      // Si es un string, convertirlo a array
      const needs = Array.isArray(job.needs) ? job.needs : [job.needs];
      dependencyGraph[jobName] = needs;
      
      // Añadir dependencias inversas
      needs.forEach(need => {
        if (!reverseDependencies[need]) {
          reverseDependencies[need] = [];
        }
        reverseDependencies[need].push(jobName);
      });
    }
  });
  
  // Imprimir el grafo de dependencias
  console.log(chalk.blue.bold('\n🔄 Grafo de dependencias:'));
  jobNames.forEach(jobName => {
    const dependencies = dependencyGraph[jobName];
    if (dependencies.length > 0) {
      console.log(`  ${chalk.yellow(jobName)} depende de: ${chalk.cyan(dependencies.join(', '))}`);
    } else {
      console.log(`  ${chalk.yellow(jobName)} no tiene dependencias previas`);
    }
    
    // Imprimir qué jobs dependen de este
    const reverseDeps = reverseDependencies[jobName] || [];
    if (reverseDeps.length > 0) {
      console.log(`    → Jobs que dependen de ${chalk.yellow(jobName)}: ${chalk.magenta(reverseDeps.join(', '))}`);
    }
  });
  
  // Verificar ciclos
  const visited = {};
  const recStack = {};
  
  function isCyclicUtil(jobName, visited, recStack) {
    if (!visited[jobName]) {
      visited[jobName] = true;
      recStack[jobName] = true;
      
      const dependencies = dependencyGraph[jobName] || [];
      for (const dependency of dependencies) {
        if (!visited[dependency] && isCyclicUtil(dependency, visited, recStack)) {
          return true;
        } else if (recStack[dependency]) {
          return true;
        }
      }
    }
    recStack[jobName] = false;
    return false;
  }
  
  let hasCycle = false;
  for (const jobName of jobNames) {
    if (isCyclicUtil(jobName, visited, recStack)) {
      hasCycle = true;
      break;
    }
  }
  
  if (hasCycle) {
    console.error(chalk.red('❌ Error: Se detectó un ciclo en las dependencias de los jobs'));
    process.exit(1);
  } else {
    console.log(chalk.green('✓ No se detectaron ciclos en las dependencias'));
  }
  
  // Verificar que todos los jobs referencian dependencias válidas
  let invalidDependency = false;
  jobNames.forEach(jobName => {
    const dependencies = dependencyGraph[jobName];
    dependencies.forEach(dep => {
      if (!jobNames.includes(dep)) {
        console.error(chalk.red(`❌ Error: El job '${jobName}' depende de '${dep}', pero este job no existe`));
        invalidDependency = true;
      }
    });
  });
  
  if (invalidDependency) {
    process.exit(1);
  }
  
  // Verificar fases según comentarios
  const phases = {};
  let currentPhase = null;
  const lines = workflowContent.split('\n');
  
  lines.forEach(line => {
    const phaseMatch = line.match(/# FASE (\d+): (.*)/);
    if (phaseMatch) {
      currentPhase = {
        number: parseInt(phaseMatch[1]),
        name: phaseMatch[2].trim(),
        jobs: []
      };
      phases[currentPhase.number] = currentPhase;
    }
    
    const jobMatch = line.match(/^ {2}(\w+):/);
    if (jobMatch && currentPhase) {
      currentPhase.jobs.push(jobMatch[1]);
    }
  });
  
  // Mostrar resumen de fases
  if (Object.keys(phases).length > 0) {
    console.log(chalk.blue.bold('\n📋 Estructura de fases detectada:'));
    Object.values(phases).forEach(phase => {
      console.log(`  ${chalk.green(`FASE ${phase.number}`)}: ${chalk.cyan(phase.name)}`);
      phase.jobs.forEach(job => {
        console.log(`    - ${job}`);
      });
    });
  }
  
  console.log(chalk.green.bold('\n✅ Verificación del workflow unificado completada exitosamente'));
} catch (error) {
  console.error(chalk.red(`❌ Error al analizar el archivo: ${error.message}`));
  if (error instanceof yaml.YAMLException) {
    console.error(chalk.red(`  - Línea ${error.mark.line}, columna ${error.mark.column}: Sintaxis YAML incorrecta`));
  }
  process.exit(1);
}
