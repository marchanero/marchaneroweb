import fs from 'fs';
import path from 'path';

// Rutas de archivos
const SCHOLAR_FILE = './src/data/scholar.json';
const DETAILED_SCHOLAR_FILE = './src/data/scholar-detailed.json';
const PAGINATION_OUTPUT_FILE = './src/data/scholar-pagination.json';

class PaginationAnalyzer {
  constructor() {
    this.scholarData = null;
    this.detailedData = null;
  }

  loadData() {
    console.log('📁 Cargando datos de Scholar...');
    
    if (fs.existsSync(SCHOLAR_FILE)) {
      this.scholarData = JSON.parse(fs.readFileSync(SCHOLAR_FILE, 'utf8'));
      console.log(`✅ Datos básicos cargados: ${this.scholarData.articles?.length || 0} artículos`);
    } else {
      throw new Error('Archivo scholar.json no encontrado');
    }

    if (fs.existsSync(DETAILED_SCHOLAR_FILE)) {
      this.detailedData = JSON.parse(fs.readFileSync(DETAILED_SCHOLAR_FILE, 'utf8'));
      console.log(`✅ Datos detallados cargados: ${this.detailedData.detailedArticles?.length || 0} artículos con detalles`);
    } else {
      console.warn('⚠️ Archivo scholar-detailed.json no encontrado');
      this.detailedData = null;
    }
  }

  analyzeArticlesByYear() {
    const articles = this.scholarData.publications || [];
    const yearAnalysis = {};
    
    articles.forEach(article => {
      const year = article.year || 'Sin año';
      if (!yearAnalysis[year]) {
        yearAnalysis[year] = {
          count: 0,
          totalCitations: 0,
          articles: []
        };
      }
      
      yearAnalysis[year].count++;        yearAnalysis[year].totalCitations += article.citedBy || 0;
        yearAnalysis[year].articles.push({
          title: article.title,
          citations: article.citedBy || 0,
          venue: article.publication
        });
    });

    // Ordenar por año
    const sortedYears = Object.keys(yearAnalysis)
      .filter(year => year !== 'Sin año')
      .sort((a, b) => parseInt(b) - parseInt(a));
    
    if (yearAnalysis['Sin año']) {
      sortedYears.push('Sin año');
    }

    const orderedAnalysis = {};
    sortedYears.forEach(year => {
      orderedAnalysis[year] = yearAnalysis[year];
    });

    return orderedAnalysis;
  }

  analyzeArticlesByVenue() {
    const articles = this.scholarData.publications || [];
    const venueAnalysis = {};
    
    articles.forEach(article => {
      const venue = article.publication || 'Sin venue';
      if (!venueAnalysis[venue]) {
        venueAnalysis[venue] = {
          count: 0,
          totalCitations: 0,
          averageCitations: 0,
          articles: []
        };
      }
      
      venueAnalysis[venue].count++;
      venueAnalysis[venue].totalCitations += article.citedBy || 0;
      venueAnalysis[venue].articles.push({
        title: article.title,
        citations: article.citedBy || 0,
        year: article.year
      });
    });

    // Calcular promedios y ordenar por número de publicaciones
    Object.keys(venueAnalysis).forEach(venue => {
      const data = venueAnalysis[venue];
      data.averageCitations = data.count > 0 ? Math.round(data.totalCitations / data.count * 100) / 100 : 0;
    });

    const sortedVenues = Object.keys(venueAnalysis)
      .sort((a, b) => venueAnalysis[b].count - venueAnalysis[a].count);

    const orderedAnalysis = {};
    sortedVenues.forEach(venue => {
      orderedAnalysis[venue] = venueAnalysis[venue];
    });

    return orderedAnalysis;
  }

  analyzeCitationDistribution() {
    const articles = this.scholarData.publications || [];
    const citationRanges = {
      'Sin citas': { min: 0, max: 0, count: 0, articles: [] },
      '1-5 citas': { min: 1, max: 5, count: 0, articles: [] },
      '6-10 citas': { min: 6, max: 10, count: 0, articles: [] },
      '11-25 citas': { min: 11, max: 25, count: 0, articles: [] },
      '26-50 citas': { min: 26, max: 50, count: 0, articles: [] },
      '51-100 citas': { min: 51, max: 100, count: 0, articles: [] },
      'Más de 100 citas': { min: 101, max: Infinity, count: 0, articles: [] }
    };

    articles.forEach(article => {
      const citations = article.citedBy || 0;
      
      Object.keys(citationRanges).forEach(range => {
        const { min, max } = citationRanges[range];
        if (citations >= min && citations <= max) {
          citationRanges[range].count++;
          citationRanges[range].articles.push({
            title: article.title,
            citations: citations,
            year: article.year,
            venue: article.publication
          });
        }
      });
    });

    return citationRanges;
  }

  calculateProductivityMetrics() {
    const articles = this.scholarData.publications || [];
    const currentYear = new Date().getFullYear();
    
    // Artículos por año
    const articlesByYear = {};
    articles.forEach(article => {
      const year = article.year || currentYear;
      articlesByYear[year] = (articlesByYear[year] || 0) + 1;
    });

    // Calcular tendencias
    const years = Object.keys(articlesByYear)
      .map(y => parseInt(y))
      .filter(y => !isNaN(y))
      .sort();
    
    const recentYears = years.filter(y => y >= currentYear - 5);
    const averagePerYear = recentYears.length > 0 
      ? Math.round(recentYears.reduce((sum, year) => sum + (articlesByYear[year] || 0), 0) / recentYears.length * 100) / 100
      : 0;

    // Productividad por quinquenio
    const quinquennialAnalysis = {};
    years.forEach(year => {
      const quinquennium = Math.floor(year / 5) * 5;
      const quinquenniumLabel = `${quinquennium}-${quinquennium + 4}`;
      
      if (!quinquennialAnalysis[quinquenniumLabel]) {
        quinquennialAnalysis[quinquenniumLabel] = {
          count: 0,
          totalCitations: 0,
          years: []
        };
      }
      
      quinquennialAnalysis[quinquenniumLabel].count += articlesByYear[year] || 0;
      quinquennialAnalysis[quinquenniumLabel].years.push(year);
      
      // Sumar citaciones de artículos de ese año
      articles.filter(a => a.year === year).forEach(article => {
        quinquennialAnalysis[quinquenniumLabel].totalCitations += article.citedBy || 0;
      });
    });

    return {
      totalArticles: articles.length,
      yearRange: years.length > 0 ? `${Math.min(...years)}-${Math.max(...years)}` : 'N/A',
      averagePerYear: averagePerYear,
      mostProductiveYear: years.length > 0 
        ? years.reduce((max, year) => (articlesByYear[year] || 0) > (articlesByYear[max] || 0) ? year : max)
        : 'N/A',
      articlesByYear: articlesByYear,
      quinquennialAnalysis: quinquennialAnalysis,
      recentActivity: {
        last5Years: recentYears.reduce((sum, year) => sum + (articlesByYear[year] || 0), 0),
        averageLast5Years: averagePerYear
      }
    };
  }

  analyzeCollaborationPatterns() {
    const articles = this.scholarData.publications || [];
    const collaboratorAnalysis = {};
    const coAuthorNetworks = {};
    
    articles.forEach(article => {
      if (article.authors && Array.isArray(article.authors)) {
        // Los autores ya están en un array
        const authors = article.authors;
        const coAuthors = authors.filter(author => !author.toLowerCase().includes('roberto') && !author.toLowerCase().includes('sánchez'));
        
        coAuthors.forEach(coAuthor => {
          if (!collaboratorAnalysis[coAuthor]) {
            collaboratorAnalysis[coAuthor] = {
              count: 0,
              totalCitations: 0,
              articles: []
            };
          }
          
          collaboratorAnalysis[coAuthor].count++;
          collaboratorAnalysis[coAuthor].totalCitations += article.citedBy || 0;
          collaboratorAnalysis[coAuthor].articles.push({
            title: article.title,
            year: article.year,
            citations: article.citedBy
          });
        });

        // Análisis de redes de co-autoría
        for (let i = 0; i < coAuthors.length; i++) {
          for (let j = i + 1; j < coAuthors.length; j++) {
            const pair = [coAuthors[i], coAuthors[j]].sort().join(' & ');
            coAuthorNetworks[pair] = (coAuthorNetworks[pair] || 0) + 1;
          }
        }
      }
    });

    // Ordenar colaboradores por número de publicaciones
    const topCollaborators = Object.keys(collaboratorAnalysis)
      .sort((a, b) => collaboratorAnalysis[b].count - collaboratorAnalysis[a].count)
      .slice(0, 20)
      .reduce((obj, key) => {
        obj[key] = collaboratorAnalysis[key];
        return obj;
      }, {});

    // Top pares de co-autores
    const topCoAuthorPairs = Object.keys(coAuthorNetworks)
      .sort((a, b) => coAuthorNetworks[b] - coAuthorNetworks[a])
      .slice(0, 10)
      .reduce((obj, key) => {
        obj[key] = coAuthorNetworks[key];
        return obj;
      }, {});

    return {
      totalUniqueCollaborators: Object.keys(collaboratorAnalysis).length,
      topCollaborators: topCollaborators,
      topCoAuthorPairs: topCoAuthorPairs,
      averageCoAuthorsPerPaper: articles.length > 0 
        ? Math.round(articles.reduce((sum, article) => {
            const authorCount = article.authors && Array.isArray(article.authors) ? article.authors.length : 1;
            return sum + (authorCount - 1); // -1 para excluir al autor principal
          }, 0) / articles.length * 100) / 100
        : 0
    };
  }

  calculateImpactMetrics() {
    const articles = this.scholarData.publications || [];
    const totalCitations = articles.reduce((sum, article) => sum + (article.citedBy || 0), 0);
    
    // Calcular índice h manualmente
    const citationCounts = articles
      .map(article => article.citedBy || 0)
      .sort((a, b) => b - a);
    
    let hIndex = 0;
    for (let i = 0; i < citationCounts.length; i++) {
      if (citationCounts[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }

    // Calcular índice i10 (artículos con al menos 10 citas)
    const i10Index = articles.filter(article => (article.citedBy || 0) >= 10).length;

    // Top artículos más citados
    const topCitedArticles = articles
      .filter(article => article.citedBy > 0)
      .sort((a, b) => (b.citedBy || 0) - (a.citedBy || 0))
      .slice(0, 10)
      .map(article => ({
        title: article.title,
        citations: article.citedBy,
        year: article.year,
        venue: article.publication
      }));

    // Impacto por año
    const impactByYear = {};
    articles.forEach(article => {
      const year = article.year || new Date().getFullYear();
      if (!impactByYear[year]) {
        impactByYear[year] = {
          articles: 0,
          totalCitations: 0,
          averageCitations: 0
        };
      }
      
      impactByYear[year].articles++;
      impactByYear[year].totalCitations += article.citedBy || 0;
    });

    Object.keys(impactByYear).forEach(year => {
      const data = impactByYear[year];
      data.averageCitations = data.articles > 0 
        ? Math.round(data.totalCitations / data.articles * 100) / 100 
        : 0;
    });

    return {
      totalCitations: totalCitations,
      hIndex: hIndex,
      i10Index: i10Index,
      averageCitationsPerArticle: articles.length > 0 
        ? Math.round(totalCitations / articles.length * 100) / 100 
        : 0,
      topCitedArticles: topCitedArticles,
      impactByYear: impactByYear,
      articlesWithCitations: articles.filter(article => (article.citedBy || 0) > 0).length,
      uncitedArticles: articles.filter(article => (article.citedBy || 0) === 0).length
    };
  }

  generatePaginationInfo() {
    const articles = this.scholarData.publications || [];
    const totalArticles = articles.length;
    const articlesPerPage = 20; // Asumiendo que Google Scholar muestra 20 por página
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    
    const paginationInfo = {
      totalArticles: totalArticles,
      articlesPerPage: articlesPerPage,
      totalPages: totalPages,
      currentlyDisplayed: Math.min(totalArticles, articlesPerPage),
      hasMultiplePages: totalPages > 1,
      paginationBreakdown: []
    };

    // Generar información por página
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * articlesPerPage;
      const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
      const pageArticles = articles.slice(startIndex, endIndex);
      
      paginationInfo.paginationBreakdown.push({
        page: page,
        startIndex: startIndex + 1,
        endIndex: endIndex,
        articlesInPage: pageArticles.length,
        totalCitationsInPage: pageArticles.reduce((sum, article) => sum + (article.citedBy || 0), 0),
        yearRange: this.getYearRange(pageArticles),
        topArticleInPage: pageArticles.length > 0 
          ? pageArticles.reduce((max, article) => 
              (article.citedBy || 0) > (max.citedBy || 0) ? article : max
            )
          : null
      });
    }

    return paginationInfo;
  }

  getYearRange(articles) {
    const years = articles
      .map(article => article.year)
      .filter(year => year && !isNaN(year))
      .sort((a, b) => a - b);
    
    if (years.length === 0) return 'N/A';
    if (years.length === 1) return years[0].toString();
    return `${years[0]}-${years[years.length - 1]}`;
  }

  generateCompleteAnalysis() {
    console.log('📊 Iniciando análisis completo de paginación...');
    
    const analysis = {
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceFiles: [SCHOLAR_FILE, DETAILED_SCHOLAR_FILE],
        analysisVersion: '2.0.0'
      },
      
      pagination: this.generatePaginationInfo(),
      
      articleAnalysis: {
        byYear: this.analyzeArticlesByYear(),
        byVenue: this.analyzeArticlesByVenue(),
        citationDistribution: this.analyzeCitationDistribution()
      },
      
      productivityMetrics: this.calculateProductivityMetrics(),
      
      collaborationAnalysis: this.analyzeCollaborationPatterns(),
      
      impactMetrics: this.calculateImpactMetrics(),
      
      summary: {
        totalArticles: this.scholarData.publications?.length || 0,
        totalCitations: this.scholarData.publications?.reduce((sum, article) => sum + (article.citedBy || 0), 0) || 0,
        authorName: this.scholarData.author?.name || 'N/A',
        dataSource: 'Google Scholar',
        lastUpdated: this.scholarData.lastUpdated || new Date().toISOString()
      }
    };

    return analysis;
  }

  saveAnalysis(analysis) {
    fs.writeFileSync(PAGINATION_OUTPUT_FILE, JSON.stringify(analysis, null, 2));
    console.log(`✅ Análisis completo guardado en: ${PAGINATION_OUTPUT_FILE}`);
    
    // Mostrar resumen en consola
    console.log('\n📊 RESUMEN DEL ANÁLISIS:');
    console.log(`• Total de artículos: ${analysis.summary.totalArticles}`);
    console.log(`• Total de citas: ${analysis.summary.totalCitations}`);
    console.log(`• Páginas de resultados: ${analysis.pagination.totalPages}`);
    console.log(`• Años de actividad: ${analysis.productivityMetrics.yearRange}`);
    console.log(`• Colaboradores únicos: ${analysis.collaborationAnalysis.totalUniqueCollaborators}`);
    console.log(`• Índice h: ${analysis.impactMetrics.hIndex}`);
    console.log(`• Índice i10: ${analysis.impactMetrics.i10Index}`);
    
    if (analysis.articleAnalysis.byYear) {
      const years = Object.keys(analysis.articleAnalysis.byYear).filter(y => y !== 'Sin año');
      if (years.length > 0) {
        const mostRecentYear = years.sort().reverse()[0];
        console.log(`• Publicaciones en ${mostRecentYear}: ${analysis.articleAnalysis.byYear[mostRecentYear]?.count || 0}`);
      }
    }
  }

  async run() {
    try {
      this.loadData();
      const analysis = this.generateCompleteAnalysis();
      this.saveAnalysis(analysis);
      
      console.log('\n🎉 ¡Análisis de paginación completado exitosamente!');
      return analysis;
      
    } catch (error) {
      console.error('❌ Error durante el análisis:', error);
      throw error;
    }
  }
}

// Ejecución principal
async function main() {
  const analyzer = new PaginationAnalyzer();
  
  try {
    await analyzer.run();
  } catch (error) {
    console.error('❌ Error en el análisis:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default PaginationAnalyzer;
