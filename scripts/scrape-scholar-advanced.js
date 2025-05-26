import { getJson } from 'serpapi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SCHOLAR_ID = process.env.GOOGLE_SCHOLAR_ID || 'PCALePwAAAAJ';
const SERPAPI_KEY = process.env.SERPAPI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'scholar.json');
const DETAILED_OUTPUT_FILE = path.join(OUTPUT_DIR, 'scholar-detailed.json');
const PAGINATION_OUTPUT_FILE = path.join(OUTPUT_DIR, 'scholar-pagination.json');

// Configuración avanzada
const MAX_PUBLICATIONS_PER_REQUEST = 100; // SerpAPI permite hasta 100
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 segundos entre requests para evitar rate limiting
const MAX_RETRIES = 3;

class AdvancedScholarScraper {
  constructor() {
    this.apiKey = SERPAPI_KEY;
    this.scholarId = SCHOLAR_ID;
    this.requestCount = 0;
    
    if (!this.apiKey) {
      console.error(chalk.red('❌ Error: SERPAPI_API_KEY no está configurada'));
      console.log(chalk.yellow('💡 Configura tu API key de SerpAPI en las variables de entorno'));
      process.exit(1);
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeApiRequest(params, retryCount = 0) {
    try {
      this.requestCount++;
      console.log(chalk.blue(`📡 API Request #${this.requestCount}: ${params.engine}`));
      
      await this.delay(DELAY_BETWEEN_REQUESTS);
      
      const result = await getJson({
        ...params,
        api_key: this.apiKey
      });
      
      return result;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.warn(chalk.yellow(`⚠️ Retry ${retryCount + 1}/${MAX_RETRIES}: ${error.message}`));
        await this.delay(DELAY_BETWEEN_REQUESTS * (retryCount + 1));
        return this.makeApiRequest(params, retryCount + 1);
      }
      throw error;
    }
  }

  async getAuthorProfile() {
    console.log(chalk.blue('👤 Obteniendo perfil completo del autor...'));
    
    const profile = await this.makeApiRequest({
      engine: "google_scholar_author",
      author_id: this.scholarId,
      num: MAX_PUBLICATIONS_PER_REQUEST
    });

    return {
      name: profile.author?.name || '',
      affiliation: profile.author?.affiliations || '',
      email: profile.author?.email || '',
      interests: profile.author?.interests || [],
      statistics: {
        totalCitations: profile.cited_by?.table?.[0]?.citations?.all || 0,
        hIndex: profile.cited_by?.table?.[1]?.h_index?.all || 0,
        i10Index: profile.cited_by?.table?.[2]?.i10_index?.all || 0
      },
      citationChart: profile.cited_by?.graph || [],
      profileUrl: `https://scholar.google.com/citations?user=${this.scholarId}`,
      scholarId: this.scholarId
    };
  }

  async getAllPublications() {
    console.log(chalk.blue('📖 Obteniendo todas las publicaciones disponibles...'));
    
    let allPublications = [];
    let start = 0;
    let hasMore = true;
    
    while (hasMore && allPublications.length < 200) { // Límite de seguridad
      console.log(chalk.blue(`📄 Obteniendo publicaciones ${start + 1} - ${start + MAX_PUBLICATIONS_PER_REQUEST}...`));
      
      const response = await this.makeApiRequest({
        engine: "google_scholar_author",
        author_id: this.scholarId,
        start: start,
        num: MAX_PUBLICATIONS_PER_REQUEST
      });

      const publications = response.articles || [];
      
      if (publications.length === 0) {
        hasMore = false;
        break;
      }

      allPublications = allPublications.concat(publications);
      start += MAX_PUBLICATIONS_PER_REQUEST;
      
      // Si recibimos menos de lo solicitado, probablemente es la última página
      if (publications.length < MAX_PUBLICATIONS_PER_REQUEST) {
        hasMore = false;
      }
      
      console.log(chalk.green(`✓ ${allPublications.length} publicaciones obtenidas hasta ahora`));
    }

    console.log(chalk.green(`✅ Total: ${allPublications.length} publicaciones obtenidas`));
    return allPublications;
  }

  async getPublicationDetails(citationId, title) {
    try {
      console.log(chalk.blue(`  🔍 Obteniendo detalles de: "${title.substring(0, 50)}..."`));
      
      const details = await this.makeApiRequest({
        engine: "google_scholar_cite",
        q: citationId,
      });

      return {
        citationId: citationId,
        abstract: details.abstract || null,
        doi: this.extractDoi(details),
        isbn: details.isbn || null,
        pages: this.extractPages(details),
        volume: this.extractVolume(details),
        issue: this.extractIssue(details),
        publisher: details.publisher || null,
        citations: details.citations || [],
        citationFormats: {
          bibtex: details.bibtex || null,
          mla: details.mla || null,
          apa: details.apa || null,
          chicago: details.chicago || null
        },
        url: details.url || null
      };
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ No se pudieron obtener detalles para: ${title}`));
      return null;
    }
  }

  extractDoi(details) {
    if (details.links) {
      for (const link of details.links) {
        if (link.title && link.title.toLowerCase().includes('doi')) {
          const doiMatch = link.link?.match(/10\.\d+\/\S+/);
          if (doiMatch) return doiMatch[0];
        }
      }
    }
    return null;
  }

  extractPages(details) {
    const text = JSON.stringify(details);
    const pageMatches = [
      /pages?\s+(\d+[-–]\d+)/i,
      /pp?\.\s*(\d+[-–]\d+)/i,
      /(\d+)\s*[-–]\s*(\d+)/
    ];
    
    for (const pattern of pageMatches) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || `${match[1]}-${match[2]}`;
      }
    }
    return null;
  }

  extractVolume(details) {
    const text = JSON.stringify(details);
    const volumeMatch = text.match(/volume\s+(\d+)|vol\.\s*(\d+)|(\d+)\s*\(\d+\)/i);
    return volumeMatch ? (volumeMatch[1] || volumeMatch[2] || volumeMatch[3]) : null;
  }

  extractIssue(details) {
    const text = JSON.stringify(details);
    const issueMatch = text.match(/(?:issue|number|no\.)\s*(\d+)|\((\d+)\)/i);
    return issueMatch ? (issueMatch[1] || issueMatch[2]) : null;
  }  async processPublicationsWithDetails(publications) {
    console.log(chalk.blue(`🔍 Procesando detalles de TODOS los ${publications.length} artículos...`));
    
    const detailedPublications = [];
    // Procesar TODOS los artículos en lugar de limitarlos
    const publicationsToProcess = publications;
    
    for (let i = 0; i < publicationsToProcess.length; i++) {
      const pub = publicationsToProcess[i];
      
      console.log(chalk.blue(`  📖 ${i + 1}/${publicationsToProcess.length}: "${pub.title.substring(0, 50)}..."`));
      
      try {
        // Intentar obtener detalles adicionales usando el citation_id
        let publicationDetails = null;
        
        if (pub.citation_id) {
          publicationDetails = await this.getPublicationDetails(pub.citation_id, pub.title);
        }
        
        // Enriquecer la publicación con información adicional
        const enrichedPublication = {
          ...pub,
          id: pub.citation_id || `pub_${i + 1}`,
          citedBy: pub.cited_by?.value || 0,
          publicationYear: pub.year || this.extractYearFromTitle(pub.title),
          venue: pub.publication || '',
          detailedInfo: publicationDetails,
          extractedMetadata: this.extractMetadataFromPublication(pub),
          citationFormats: this.generateCitationFormats(pub, publicationDetails)
        };
        
        detailedPublications.push(enrichedPublication);
        
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ Error procesando "${pub.title}": ${error.message}`));
        
        // Agregar publicación básica sin detalles
        detailedPublications.push({
          ...pub,
          id: pub.citation_id || `pub_${i + 1}`,
          citedBy: pub.cited_by?.value || 0,
          publicationYear: pub.year || null,
          venue: pub.publication || '',
          detailedInfo: null,
          extractedMetadata: this.extractMetadataFromPublication(pub),
          citationFormats: this.generateCitationFormats(pub, null)
        });
      }
    }
    
    return detailedPublications;
  }

  extractYearFromTitle(title) {
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }

  extractMetadataFromPublication(publication) {
    const authors = publication.authors || '';
    const venue = publication.publication || '';
    
    return {
      authorCount: authors.split(',').filter(a => a.trim().length > 0).length,
      isJournalPaper: this.isJournalPublication(venue),
      isConferencePaper: this.isConferencePublication(venue),
      venueType: this.getVenueType(venue),
      hasCoAuthors: authors.includes(','),
      estimatedImpact: this.estimateImpact(publication.cited_by?.value || 0, publication.year)
    };
  }

  isJournalPublication(venue) {
    const journalKeywords = ['journal', 'transactions', 'letters', 'review', 'magazine'];
    return journalKeywords.some(keyword => venue.toLowerCase().includes(keyword));
  }

  isConferencePublication(venue) {
    const conferenceKeywords = ['conference', 'proceedings', 'symposium', 'workshop', 'meeting'];
    return conferenceKeywords.some(keyword => venue.toLowerCase().includes(keyword));
  }

  getVenueType(venue) {
    if (this.isJournalPublication(venue)) return 'journal';
    if (this.isConferencePublication(venue)) return 'conference';
    if (venue.toLowerCase().includes('book')) return 'book';
    if (venue.toLowerCase().includes('thesis')) return 'thesis';
    return 'other';
  }

  estimateImpact(citations, year) {
    const currentYear = new Date().getFullYear();
    const ageInYears = Math.max(1, currentYear - (year || currentYear));
    const citationsPerYear = citations / ageInYears;
    
    if (citationsPerYear >= 10) return 'high';
    if (citationsPerYear >= 3) return 'medium';
    return 'low';
  }

  generateCitationFormats(publication, details) {
    const year = publication.year || new Date().getFullYear();
    const authors = publication.authors || 'Unknown Author';
    const title = publication.title || 'Unknown Title';
    const venue = publication.publication || 'Unknown Venue';
    
    return {
      bibtex: this.generateBibTeX({ ...publication, authors, title, venue }, { year }),
      apa: this.generateAPA({ ...publication, authors, title, venue }, { year }),
      mla: this.generateMLA({ ...publication, authors, title, venue }, { year }),
      chicago: this.generateChicago({ ...publication, authors, title, venue }, { year })
    };
  }

  async generatePaginationInfo(totalPublications, detailedPublications) {
    console.log(chalk.blue('📊 Generando información de paginación y métricas...'));
    
    const currentYear = new Date().getFullYear();
    const publicationsByYear = {};
    const citationsByYear = {};
    const venueAnalysis = {};
    
    // Análisis temporal
    totalPublications.forEach(pub => {
      const year = pub.year || currentYear;
      const citations = pub.cited_by?.value || 0;
      
      if (!publicationsByYear[year]) {
        publicationsByYear[year] = 0;
        citationsByYear[year] = 0;
      }
      
      publicationsByYear[year]++;
      citationsByYear[year] += citations;
      
      // Análisis de venues
      const venue = pub.publication || 'Unknown';
      if (!venueAnalysis[venue]) {
        venueAnalysis[venue] = { count: 0, totalCitations: 0 };
      }
      venueAnalysis[venue].count++;
      venueAnalysis[venue].totalCitations += citations;
    });
    
    // Calcular métricas de productividad
    const years = Object.keys(publicationsByYear).map(Number).sort();
    const activeYears = years.length;
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const careerSpan = lastYear - firstYear + 1;
    
    // Métricas de colaboración
    const collaborationMetrics = this.analyzeCollaboration(totalPublications);
    
    // Análisis de impacto
    const impactMetrics = this.analyzeImpact(totalPublications);
    
    return {
      totalPublications: totalPublications.length,
      publicationsWithDetails: detailedPublications.length,
      paginationMetadata: {
        itemsPerPage: MAX_PUBLICATIONS_PER_REQUEST,
        totalPages: Math.ceil(totalPublications.length / MAX_PUBLICATIONS_PER_REQUEST),
        lastPageItems: totalPublications.length % MAX_PUBLICATIONS_PER_REQUEST || MAX_PUBLICATIONS_PER_REQUEST
      },
      temporalAnalysis: {
        publicationsByYear,
        citationsByYear,
        careerSpan,
        activeYears,
        averagePublicationsPerYear: Math.round((totalPublications.length / careerSpan) * 100) / 100,
        productivityTrend: this.calculateTrend(publicationsByYear)
      },
      venueAnalysis: {
        totalVenues: Object.keys(venueAnalysis).length,
        topVenues: Object.entries(venueAnalysis)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10)
          .map(([venue, data]) => ({
            venue,
            publications: data.count,
            totalCitations: data.totalCitations,
            averageCitations: Math.round(data.totalCitations / data.count)
          }))
      },
      collaborationMetrics,
      impactMetrics,
      qualityMetrics: {
        highImpactPapers: totalPublications.filter(p => (p.cited_by?.value || 0) >= 50).length,
        mediumImpactPapers: totalPublications.filter(p => {
          const cites = p.cited_by?.value || 0;
          return cites >= 10 && cites < 50;
        }).length,
        recentHighImpact: totalPublications.filter(p => {
          const year = p.year || 0;
          const citations = p.cited_by?.value || 0;
          return year >= currentYear - 5 && citations >= 20;
        }).length
      },
      generatedAt: new Date().toISOString()
    };
  }

  analyzeCollaboration(publications) {
    const authorCounts = publications.map(pub => {
      const authors = pub.authors || '';
      return authors.split(',').filter(a => a.trim().length > 0).length;
    });
    
    const soloWorks = authorCounts.filter(count => count === 1).length;
    const collaborativeWorks = authorCounts.filter(count => count > 1).length;
    const averageAuthorsPerPaper = authorCounts.length > 0 
      ? Math.round((authorCounts.reduce((sum, count) => sum + count, 0) / authorCounts.length) * 100) / 100
      : 0;
    
    return {
      totalWorks: publications.length,
      soloWorks,
      collaborativeWorks,
      collaborationRate: Math.round((collaborativeWorks / publications.length) * 100),
      averageAuthorsPerPaper,
      maxAuthorsOnPaper: Math.max(...authorCounts, 0),
      minAuthorsOnPaper: Math.min(...authorCounts, 0)
    };
  }

  analyzeImpact(publications) {
    const citations = publications.map(pub => pub.cited_by?.value || 0);
    const totalCitations = citations.reduce((sum, cites) => sum + cites, 0);
    
    citations.sort((a, b) => b - a);
    
    // Calcular h-index
    let hIndex = 0;
    for (let i = 0; i < citations.length; i++) {
      if (citations[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }
    
    // Calcular i10-index
    const i10Index = citations.filter(cites => cites >= 10).length;
    
    return {
      totalCitations,
      averageCitationsPerPaper: publications.length > 0 
        ? Math.round((totalCitations / publications.length) * 100) / 100 
        : 0,
      hIndex,
      i10Index,
      mostCitedPaper: {
        citations: citations[0] || 0,
        paper: publications.find(p => (p.cited_by?.value || 0) === citations[0])
      },
      citationDistribution: {
        papers0Citations: citations.filter(c => c === 0).length,
        papers1to10Citations: citations.filter(c => c >= 1 && c <= 10).length,
        papers11to50Citations: citations.filter(c => c >= 11 && c <= 50).length,
        papers50PlusCitations: citations.filter(c => c > 50).length
      }
    };
  }

  calculateTrend(dataByYear) {
    const years = Object.keys(dataByYear).map(Number).sort();
    if (years.length < 2) return 'insufficient_data';
    
    const recent5Years = years.slice(-5);
    const earlier5Years = years.slice(-10, -5);
    
    if (recent5Years.length === 0) return 'insufficient_data';
    
    const recentAverage = recent5Years.reduce((sum, year) => sum + dataByYear[year], 0) / recent5Years.length;
    const earlierAverage = earlier5Years.length > 0 
      ? earlier5Years.reduce((sum, year) => sum + dataByYear[year], 0) / earlier5Years.length
      : recentAverage;
    
    if (recentAverage > earlierAverage * 1.2) return 'increasing';
    if (recentAverage < earlierAverage * 0.8) return 'decreasing';
    return 'stable';
  }

  async scrapeComplete() {
    try {
      console.log(chalk.blue('📚 Iniciando scraping avanzado de Google Scholar con SerpAPI...'));
      
      // 1. Obtener información del perfil del autor
      const authorProfile = await this.getAuthorProfile();
      console.log(chalk.green(`✅ Perfil obtenido: ${authorProfile.name}`));
      
      // 2. Obtener todas las publicaciones disponibles
      const allPublications = await this.getAllPublications();
      console.log(chalk.green(`✅ ${allPublications.length} publicaciones obtenidas`));
      
      // 3. Procesar publicaciones con detalles adicionales
      const detailedPublications = await this.processPublicationsWithDetails(allPublications);
      console.log(chalk.green(`✅ ${detailedPublications.length} publicaciones procesadas con detalles`));
      
      // 4. Generar información avanzada de paginación y métricas
      const paginationInfo = await this.generatePaginationInfo(allPublications, detailedPublications);
      console.log(chalk.green('✅ Análisis de paginación y métricas completado'));
      
      // Preparar datos básicos
      const basicData = {
        lastUpdated: new Date().toISOString(),
        author: authorProfile,
        publications: allPublications.slice(0, 20), // Primeras 20 para compatibilidad
        metrics: {
          totalCitations: authorProfile.statistics.totalCitations,
          hIndex: authorProfile.statistics.hIndex,
          i10Index: authorProfile.statistics.i10Index,
          citationsRecent: 0, // SerpAPI no proporciona esto directamente
          hIndexRecent: 0,
          i10IndexRecent: 0
        },
        summary: {
          totalPublications: allPublications.length,
          totalCitations: allPublications.reduce((sum, pub) => sum + (pub.cited_by?.value || 0), 0),
          averageCitationsPerPublication: allPublications.length > 0 
            ? Math.round(allPublications.reduce((sum, pub) => sum + (pub.cited_by?.value || 0), 0) / allPublications.length * 100) / 100
            : 0
        }
      };
      
      // Preparar datos detallados
      const detailedData = {
        ...basicData,
        allPublications: allPublications,
        detailedPublications: detailedPublications,
        advancedMetrics: paginationInfo,
        scrapingMetadata: {
          engine: 'SerpAPI',
          totalApiRequests: this.requestCount,
          processingTime: new Date().toISOString(),
          dynamicProcessing: true,
          articlesProcessed: detailedPublications.length,
          version: '2.0.0-serpapi'
        }
      };
      
      // Guardar archivos
      this.ensureDirectoryExists(OUTPUT_DIR);
      
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(basicData, null, 2));
      fs.writeFileSync(DETAILED_OUTPUT_FILE, JSON.stringify(detailedData, null, 2));
      fs.writeFileSync(PAGINATION_OUTPUT_FILE, JSON.stringify(paginationInfo, null, 2));

      console.log(chalk.green('✅ Scraping avanzado completado exitosamente!'));
      console.log(chalk.blue(`📊 Datos básicos guardados en: ${OUTPUT_FILE}`));
      console.log(chalk.blue(`📋 Datos detallados guardados en: ${DETAILED_OUTPUT_FILE}`));
      console.log(chalk.blue(`📄 Información de paginación guardada en: ${PAGINATION_OUTPUT_FILE}`));
      console.log(chalk.yellow(`📈 Total de publicaciones: ${allPublications.length}`));
      console.log(chalk.yellow(`🔍 Publicaciones con detalles: ${detailedPublications.length}`));
      console.log(chalk.yellow(`📡 Requests de API utilizados: ${this.requestCount}`));

      return {
        basic: basicData,
        detailed: detailedData,
        pagination: paginationInfo
      };

    } catch (error) {
      console.error(chalk.red('❌ Error durante el scraping:'), error);
      throw error;
    }
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateBibTeX(publication, extractedData) {
    const year = publication.year || extractedData?.year || new Date().getFullYear();
    const authors = publication.authors || 'Unknown Author';
    const title = publication.title || 'Unknown Title';
    const venue = publication.publication || 'Unknown Venue';
    
    // Crear clave de citación
    const firstAuthor = Array.isArray(authors) ? authors[0] : authors.split(',')[0];
    const authorKey = firstAuthor.toLowerCase().replace(/[^a-z]/g, '');
    
    return `@article{${authorKey}${year},
  title={${title.replace(/[{}]/g, '')}},
  author={${Array.isArray(authors) ? authors.join(' and ') : authors}},
  journal={${venue}},
  year={${year}},
  volume={${extractedData?.volume || ''}},
  number={${extractedData?.issue || ''}},
  pages={${extractedData?.pages || ''}},
  doi={${extractedData?.doi || ''}}
}`;
  }

  generateAPA(publication, extractedData) {
    const year = publication.year || extractedData?.year || new Date().getFullYear();
    const authors = publication.authors || 'Unknown Author';
    const title = publication.title || 'Unknown Title';
    const venue = publication.publication || 'Unknown Venue';
    
    const authorText = Array.isArray(authors) ? authors.join(', ') : authors;
    return `${authorText} (${year}). ${title}. ${venue}.`;
  }

  generateMLA(publication, extractedData) {
    const year = publication.year || extractedData?.year || new Date().getFullYear();
    const authors = publication.authors || 'Unknown Author';
    const title = publication.title || 'Unknown Title';
    const venue = publication.publication || 'Unknown Venue';
    
    const authorText = Array.isArray(authors) ? authors.join(', ') : authors;
    return `${authorText}. "${title}." ${venue} (${year}).`;
  }

  generateChicago(publication, extractedData) {
    const year = publication.year || extractedData?.year || new Date().getFullYear();
    const authors = publication.authors || 'Unknown Author';
    const title = publication.title || 'Unknown Title';
    const venue = publication.publication || 'Unknown Venue';
    
    const authorText = Array.isArray(authors) ? authors.join(', ') : authors;
    return `${authorText}. "${title}." ${venue} (${year}).`;
  }
}

// Ejecución principal
async function main() {
  const scraper = new AdvancedScholarScraper();
  
  try {
    const results = await scraper.scrapeComplete();
    console.log(chalk.green('\n🎉 ¡Scraping avanzado de Google Scholar completado exitosamente!'));
    
    // Mostrar resumen detallado
    console.log(chalk.blue('\n📊 RESUMEN DETALLADO:'));
    console.log(chalk.yellow(`• Publicaciones totales: ${results.basic.summary.totalPublications}`));
    console.log(chalk.yellow(`• Citaciones totales: ${results.basic.summary.totalCitations}`));
    console.log(chalk.yellow(`• Promedio citas/publicación: ${results.basic.summary.averageCitationsPerPublication}`));
    console.log(chalk.yellow(`• Publicaciones con detalles: ${results.detailed.detailedPublications.length}`));
    console.log(chalk.yellow(`• Índice h: ${results.basic.author.statistics.hIndex}`));
    console.log(chalk.yellow(`• Índice i10: ${results.basic.author.statistics.i10Index}`));
    console.log(chalk.yellow(`• Requests API utilizados: ${results.detailed.scrapingMetadata.totalApiRequests}`));
    
    if (results.pagination.temporalAnalysis) {
      const years = Object.keys(results.pagination.temporalAnalysis.publicationsByYear);
      const recentYear = Math.max(...years.map(Number));
      const recentPubs = results.pagination.temporalAnalysis.publicationsByYear[recentYear] || 0;
      console.log(chalk.yellow(`• Publicaciones en ${recentYear}: ${recentPubs}`));
      console.log(chalk.yellow(`• Tendencia de productividad: ${results.pagination.temporalAnalysis.productivityTrend}`));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error en el scraping avanzado:'), error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default AdvancedScholarScraper;
