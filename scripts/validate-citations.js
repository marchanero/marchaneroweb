/**
 * Script para validar citas y DOIs académicos en el sitio web
 * del Dr. Roberto Sánchez Reolid
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Función para extraer DOIs y citas de un archivo HTML
function extractCitations(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Buscar citas en varios formatos
    const citations = {
      bibtex: [],
      doi: [],
      plaintext: []
    };
    
    // Buscar DOIs (formato 10.xxxx/xxxx)
    const doiPattern = /10\.\d{4,}\/[^\s"'<>)]+/g;
    const textContent = content.replace(/<[^>]*>/g, ' ');
    const doiMatches = textContent.match(doiPattern) || [];
    
    doiMatches.forEach(doi => {
      // Limpiar caracteres no deseados
      const cleanDoi = doi.replace(/[.,;:)"'\]]+$/, '');
      citations.doi.push(cleanDoi);
    });
    
    // Buscar elementos con citas en formato texto
    const citationElements = Array.from(document.querySelectorAll('.citation, .reference, cite, blockquote'));
    
    citationElements.forEach(element => {
      const text = element.textContent.trim();
      if (text) {
        citations.plaintext.push(text);
      }
    });
    
    return {
      file: filePath,
      citations
    };
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error);
    return {
      file: filePath,
      error: error.message,
      citations: { bibtex: [], doi: [], plaintext: [] }
    };
  }
}

// Función para escanear directorios recursivamente
function scanDirectory(dir) {
  const results = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...scanDirectory(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(extractCitations(fullPath));
    }
  }
  
  return results;
}

// Función para validar si una cita contiene elementos académicos esperados
function validateAcademicCitation(text) {
  // Elementos comunes en citas académicas
  const academicKeywords = [
    /journal/i, /doi/i, /vol(ume)?/i, /pp\./i, /pages/i, /proceedings/i, 
    /conference/i, /publisher/i, /university/i, /thesis/i, /dissertation/i,
    /ISBN/i, /ISSN/i, /article/i, /author/i, /[12][0-9]{3}/  // Año entre 1000-2999
  ];
  
  // Comprobar si el texto contiene al menos una palabra académica
  return academicKeywords.some(regex => regex.test(text));
}

// Función principal
async function main() {
  console.log('Analizando citas académicas en el sitio web...');
  
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Verificar que el directorio existe
  if (!fs.existsSync(distPath)) {
    console.error('No se encontró el directorio dist. Ejecute "npm run build" primero.');
    process.exit(1);
  }
  
  // Extraer citas de los archivos HTML
  const results = scanDirectory(distPath);
  
  // Eliminar duplicados de DOIs
  const allDois = new Set();
  results.forEach(result => {
    result.citations.doi.forEach(doi => allDois.add(doi));
  });
  
  // Validar citas de texto para ver cuáles parecen académicas
  let academicCitations = 0;
  let nonAcademicCitations = 0;
  
  results.forEach(result => {
    result.citations.plaintext.forEach(citation => {
      if (validateAcademicCitation(citation)) {
        academicCitations++;
      } else {
        nonAcademicCitations++;
      }
    });
  });
  
  // Crear directorio para resultados si no existe
  const resultsDir = path.join(__dirname, '..', 'citation-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }
  
  // Generar informe
  const report = {
    timestamp: new Date().toISOString(),
    total: {
      files: results.length,
      citations: {
        bibtex: results.reduce((sum, r) => sum + r.citations.bibtex.length, 0),
        doi: allDois.size,
        plaintext: results.reduce((sum, r) => sum + r.citations.plaintext.length, 0),
        academicCitations,
        nonAcademicCitations
      }
    },
    uniqueDois: Array.from(allDois),
    details: results
  };
  
  // Guardar resultados JSON
  fs.writeFileSync(path.join(resultsDir, 'citations.json'), JSON.stringify(report, null, 2));
  
  // Crear informe en Markdown
  let markdown = '# Informe de Citas Académicas\n\n';
  markdown += `Fecha: ${new Date().toISOString().split('T')[0]}\n\n`;
  
  markdown += '## Resumen\n\n';
  markdown += `- **Archivos analizados:** ${report.total.files}\n`;
  markdown += `- **DOIs únicos:** ${report.total.citations.doi}\n`;
  markdown += `- **Citas académicas:** ${report.total.citations.academicCitations}\n`;
  markdown += `- **Otras citas o referencias:** ${report.total.citations.nonAcademicCitations}\n\n`;
  
  markdown += '## DOIs encontrados\n\n';
  
  if (report.uniqueDois.length === 0) {
    markdown += '*No se encontraron DOIs en el sitio web.*\n\n';
    markdown += '### Recomendaciones\n\n';
    markdown += '- Incluir DOIs para todas las publicaciones académicas\n';
    markdown += '- Asegurar que las citas estén correctamente formateadas\n';
    markdown += '- Considerar usar microdatos Schema.org para publicaciones académicas\n';
  } else {
    report.uniqueDois.forEach(doi => {
      markdown += `- \`${doi}\`\n`;
    });
  }
  
  // Guardar informe Markdown
  fs.writeFileSync(path.join(resultsDir, 'citations-report.md'), markdown);
  
  console.log(`Análisis completado. Se han encontrado ${report.total.citations.doi} DOIs únicos.`);
  console.log(`Informe guardado en ${path.join(resultsDir, 'citations-report.md')}`);
}

// Ejecutar el script
main().catch(error => {
  console.error('Error durante el análisis de citas:', error);
  process.exit(1);
});
