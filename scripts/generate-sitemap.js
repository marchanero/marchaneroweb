/**
 * Script para generar automáticamente el sitemap.xml
 * para el sitio web académico del Dr. Roberto Sánchez Reolid
 */

const fs = require('fs');
const path = require('path');

// URL base del sitio
const baseUrl = 'https://robertosanchezreolid.netlify.app';

// Función para escanear el directorio dist y encontrar archivos HTML
function scanDir(dirPath, baseDir = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let urls = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    
    if (entry.isDirectory()) {
      // Escanear subdirectorios recursivamente
      urls = urls.concat(scanDir(fullPath, relativePath));
    } else if (entry.name === 'index.html') {
      // Convertir rutas de archivos index.html a URLs
      const urlPath = baseDir === '' ? '/' : `/${baseDir}/`;
      urls.push({ 
        url: urlPath, 
        priority: getUrlPriority(urlPath),
        changefreq: getChangeFreq(urlPath)
      });
    } else if (entry.name.endsWith('.html')) {
      // Otras páginas HTML que no son index
      const urlPath = `/${relativePath.replace(/\.html$/, '')}`;
      urls.push({ 
        url: urlPath, 
        priority: getUrlPriority(urlPath),
        changefreq: getChangeFreq(urlPath)
      });
    }
  }
  
  return urls;
}

// Determinar la prioridad de la URL basada en su ruta
function getUrlPriority(urlPath) {
  if (urlPath === '/') return 1.0; // Página principal
  if (urlPath === '/proyectos/' || urlPath.startsWith('/proyectos/')) return 0.9; // Investigaciones
  if (urlPath === '/sobre-mi/') return 0.8; // Perfil
  return 0.7; // Otras páginas
}

// Determinar la frecuencia de cambio basada en la ruta
function getChangeFreq(urlPath) {
  if (urlPath === '/') return 'weekly';
  if (urlPath === '/proyectos/' || urlPath.startsWith('/proyectos/')) return 'monthly';
  return 'monthly';
}

// Generar XML del sitemap
function generateSitemap(urls) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Añadir cada URL
  urls.forEach(item => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${item.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Iniciar el proceso
try {
  console.log('Escaneando el directorio dist para generar sitemap.xml...');
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Verificar que el directorio existe
  if (!fs.existsSync(distDir)) {
    console.error('No se encontró el directorio dist. Ejecute "npm run build" primero.');
    process.exit(1);
  }
  
  const urls = scanDir(distDir);
  
  console.log(`Se encontraron ${urls.length} URLs para incluir en el sitemap:`);
  urls.forEach(item => console.log(`- ${item.url} (Prioridad: ${item.priority})`));
  
  // Generar el XML
  const sitemap = generateSitemap(urls);
  
  // Guardar el sitemap.xml
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('sitemap.xml generado correctamente en el directorio dist/');
  
  // También guardar una copia para el repositorio
  fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), sitemap);
  console.log('Copia del sitemap.xml guardada en la raíz del repositorio.');
} catch (error) {
  console.error('Error generando el sitemap:', error);
  process.exit(1);
}
