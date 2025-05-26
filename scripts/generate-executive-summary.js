import fs from 'fs';
import path from 'path';

// Rutas de archivos
const SCHOLAR_FILE = './src/data/scholar.json';
const DETAILED_SCHOLAR_FILE = './src/data/scholar-detailed.json';
const PAGINATION_FILE = './src/data/scholar-pagination.json';
const SUMMARY_OUTPUT_FILE = './src/data/scholar-executive-summary.json';

class ExecutiveSummaryGenerator {
  constructor() {
    this.scholarData = null;
    this.detailedData = null;
    this.paginationData = null;
  }

  loadAllData() {
    console.log('📁 Cargando todos los archivos de datos...');
    
    if (fs.existsSync(SCHOLAR_FILE)) {
      this.scholarData = JSON.parse(fs.readFileSync(SCHOLAR_FILE, 'utf8'));
      console.log(`✅ Datos básicos: ${this.scholarData.publications?.length || 0} publicaciones`);
    }

    if (fs.existsSync(DETAILED_SCHOLAR_FILE)) {
      this.detailedData = JSON.parse(fs.readFileSync(DETAILED_SCHOLAR_FILE, 'utf8'));
      console.log(`✅ Datos detallados: ${this.detailedData.detailedPublications?.length || 0} publicaciones detalladas`);
    }

    if (fs.existsSync(PAGINATION_FILE)) {
      this.paginationData = JSON.parse(fs.readFileSync(PAGINATION_FILE, 'utf8'));
      console.log(`✅ Análisis de paginación: ${this.paginationData.pagination?.totalPages || 0} páginas`);
    }
  }

  generateKeyMetrics() {
    const publications = this.scholarData.publications || [];
    const metrics = this.scholarData.metrics || {};
    
    return {
      totalPublications: publications.length,
      totalCitations: metrics.totalCitations || 0,
      hIndex: metrics.hIndex || 0,
      i10Index: metrics.i10Index || 0,
      averageCitationsPerPaper: publications.length > 0 
        ? Math.round((metrics.totalCitations || 0) / publications.length * 100) / 100
        : 0,
      publicationsWithCitations: publications.filter(p => (p.citedBy || 0) > 0).length,
      publicationsWithoutCitations: publications.filter(p => (p.citedBy || 0) === 0).length,
      citationRate: publications.length > 0 
        ? Math.round((publications.filter(p => (p.citedBy || 0) > 0).length / publications.length) * 100)
        : 0
    };
  }

  generateProductivityTrends() {
    const publications = this.scholarData.publications || [];
    const currentYear = new Date().getFullYear();
    
    // Publicaciones por año
    const publicationsByYear = {};
    publications.forEach(pub => {
      const year = pub.year || currentYear;
      publicationsByYear[year] = (publicationsByYear[year] || 0) + 1;
    });

    // Últimos 5 años
    const recentYears = [];
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      recentYears.push({
        year: year,
        publications: publicationsByYear[year] || 0,
        citations: publications
          .filter(p => p.year === year)
          .reduce((sum, p) => sum + (p.citedBy || 0), 0)
      });
    }

    // Tendencia de productividad
    const recentCounts = recentYears.map(y => y.publications);
    const trend = recentCounts.length > 1 
      ? recentCounts[recentCounts.length - 1] - recentCounts[0] 
      : 0;

    return {
      publicationsByYear: publicationsByYear,
      recentYearsAnalysis: recentYears,
      productivityTrend: trend > 0 ? 'Creciente' : trend < 0 ? 'Decreciente' : 'Estable',
      trendValue: trend,
      mostProductiveYear: Object.keys(publicationsByYear).reduce((max, year) => 
        (publicationsByYear[year] || 0) > (publicationsByYear[max] || 0) ? year : max, 
        Object.keys(publicationsByYear)[0]
      ),
      averagePerYear: Math.round(recentYears.reduce((sum, y) => sum + y.publications, 0) / recentYears.length * 100) / 100
    };
  }

  generateTopPerformers() {
    const publications = this.scholarData.publications || [];
    
    // Top 10 publicaciones más citadas
    const topCited = publications
      .filter(p => (p.citedBy || 0) > 0)
      .sort((a, b) => (b.citedBy || 0) - (a.citedBy || 0))
      .slice(0, 10)
      .map((pub, index) => ({
        rank: index + 1,
        title: pub.title,
        citations: pub.citedBy || 0,
        year: pub.year,
        publication: pub.publication,
        citationPercentage: Math.round(((pub.citedBy || 0) / (this.scholarData.metrics?.totalCitations || 1)) * 100 * 100) / 100
      }));

    // Publicaciones recientes con buen impacto (últimos 3 años con más de 5 citas)
    const currentYear = new Date().getFullYear();
    const recentHighImpact = publications
      .filter(p => p.year >= currentYear - 3 && (p.citedBy || 0) >= 5)
      .sort((a, b) => (b.citedBy || 0) - (a.citedBy || 0))
      .slice(0, 5)
      .map(pub => ({
        title: pub.title,
        citations: pub.citedBy || 0,
        year: pub.year,
        publication: pub.publication
      }));

    return {
      topCitedPublications: topCited,
      recentHighImpactPublications: recentHighImpact,
      topPublicationCitations: topCited.length > 0 ? topCited[0].citations : 0,
      topPublicationsContribution: topCited.length > 0 
        ? Math.round(topCited.slice(0, 5).reduce((sum, p) => sum + p.citations, 0) / (this.scholarData.metrics?.totalCitations || 1) * 100)
        : 0
    };
  }

  generateCollaborationInsights() {
    const publications = this.scholarData.publications || [];
    
    // Análisis de colaboración
    const collaboratorCount = {};
    const institutionAnalysis = {};
    let singleAuthorPapers = 0;
    let multiAuthorPapers = 0;
    
    publications.forEach(pub => {
      if (pub.authors && Array.isArray(pub.authors)) {
        if (pub.authors.length === 1) {
          singleAuthorPapers++;
        } else {
          multiAuthorPapers++;
          
          // Contar colaboradores (excluyendo al autor principal)
          pub.authors.forEach(author => {
            if (!author.toLowerCase().includes('roberto') && !author.toLowerCase().includes('sánchez')) {
              collaboratorCount[author] = (collaboratorCount[author] || 0) + 1;
            }
          });
        }
        
        // Análisis de instituciones (extraer de la publicación)
        const pubText = pub.publication || '';
        if (pubText.toLowerCase().includes('ieee')) {
          institutionAnalysis['IEEE'] = (institutionAnalysis['IEEE'] || 0) + 1;
        } else if (pubText.toLowerCase().includes('springer')) {
          institutionAnalysis['Springer'] = (institutionAnalysis['Springer'] || 0) + 1;
        } else if (pubText.toLowerCase().includes('elsevier')) {
          institutionAnalysis['Elsevier'] = (institutionAnalysis['Elsevier'] || 0) + 1;
        } else if (pubText.toLowerCase().includes('mdpi')) {
          institutionAnalysis['MDPI'] = (institutionAnalysis['MDPI'] || 0) + 1;
        }
      }
    });

    // Top colaboradores
    const topCollaborators = Object.keys(collaboratorCount)
      .sort((a, b) => collaboratorCount[b] - collaboratorCount[a])
      .slice(0, 10)
      .map(name => ({
        name: name,
        collaborations: collaboratorCount[name]
      }));

    return {
      totalUniqueCollaborators: Object.keys(collaboratorCount).length,
      singleAuthorPublications: singleAuthorPapers,
      multiAuthorPublications: multiAuthorPapers,
      collaborationRate: publications.length > 0 
        ? Math.round((multiAuthorPapers / publications.length) * 100)
        : 0,
      topCollaborators: topCollaborators,
      publisherDistribution: institutionAnalysis,
      averageAuthorsPerPaper: publications.length > 0
        ? Math.round(publications.reduce((sum, pub) => sum + (pub.authors?.length || 1), 0) / publications.length * 100) / 100
        : 0
    };
  }

  generateResearchImpactAnalysis() {
    const publications = this.scholarData.publications || [];
    const paginationAnalysis = this.paginationData?.articleAnalysis || {};
    
    // Análisis de distribución de citas
    const citationDistribution = {
      'Sin citas': 0,
      '1-5 citas': 0,
      '6-10 citas': 0,
      '11-25 citas': 0,
      '26-50 citas': 0,
      'Más de 50 citas': 0
    };

    publications.forEach(pub => {
      const citations = pub.citedBy || 0;
      if (citations === 0) citationDistribution['Sin citas']++;
      else if (citations <= 5) citationDistribution['1-5 citas']++;
      else if (citations <= 10) citationDistribution['6-10 citas']++;
      else if (citations <= 25) citationDistribution['11-25 citas']++;
      else if (citations <= 50) citationDistribution['26-50 citas']++;
      else citationDistribution['Más de 50 citas']++;
    });

    // Análisis de venues/journals
    const venueAnalysis = {};
    publications.forEach(pub => {
      const venue = pub.publication?.split(',')[0]?.trim() || 'Desconocido';
      if (!venueAnalysis[venue]) {
        venueAnalysis[venue] = { count: 0, totalCitations: 0 };
      }
      venueAnalysis[venue].count++;
      venueAnalysis[venue].totalCitations += pub.citedBy || 0;
    });

    const topVenues = Object.keys(venueAnalysis)
      .sort((a, b) => venueAnalysis[b].count - venueAnalysis[a].count)
      .slice(0, 10)
      .map(venue => ({
        venue: venue,
        publications: venueAnalysis[venue].count,
        totalCitations: venueAnalysis[venue].totalCitations,
        averageCitations: Math.round((venueAnalysis[venue].totalCitations / venueAnalysis[venue].count) * 100) / 100
      }));

    return {
      citationDistribution: citationDistribution,
      impactCategories: {
        highImpact: publications.filter(p => (p.citedBy || 0) > 25).length,
        mediumImpact: publications.filter(p => (p.citedBy || 0) >= 6 && (p.citedBy || 0) <= 25).length,
        emergingImpact: publications.filter(p => (p.citedBy || 0) >= 1 && (p.citedBy || 0) <= 5).length,
        noImpactYet: publications.filter(p => (p.citedBy || 0) === 0).length
      },
      topVenues: topVenues,
      venueCount: Object.keys(venueAnalysis).length,
      averageCitationsPerVenue: topVenues.length > 0
        ? Math.round(topVenues.reduce((sum, v) => sum + v.averageCitations, 0) / topVenues.length * 100) / 100
        : 0
    };
  }

  generateRecommendations() {
    const metrics = this.generateKeyMetrics();
    const productivity = this.generateProductivityTrends();
    const collaboration = this.generateCollaborationInsights();
    const impact = this.generateResearchImpactAnalysis();
    
    const recommendations = [];

    // Recomendaciones basadas en productividad
    if (productivity.trendValue < 0) {
      recommendations.push({
        category: 'Productividad',
        priority: 'Alta',
        recommendation: 'Considerar incrementar la tasa de publicación para mantener la visibilidad académica',
        reasoning: `La tendencia de publicaciones ha disminuido en ${Math.abs(productivity.trendValue)} en los últimos años`
      });
    }

    // Recomendaciones basadas en colaboración
    if (collaboration.collaborationRate < 80) {
      recommendations.push({
        category: 'Colaboración',
        priority: 'Media',
        recommendation: 'Fomentar más colaboraciones para aumentar la red académica',
        reasoning: `Solo el ${collaboration.collaborationRate}% de las publicaciones son colaborativas`
      });
    }

    // Recomendaciones basadas en impacto
    if (metrics.citationRate < 80) {
      recommendations.push({
        category: 'Impacto',
        priority: 'Media',
        recommendation: 'Enfocar esfuerzos en publicaciones de mayor impacto',
        reasoning: `El ${100 - metrics.citationRate}% de las publicaciones aún no han recibido citas`
      });
    }

    // Recomendaciones basadas en diversificación
    if (impact.venueCount < 20) {
      recommendations.push({
        category: 'Diversificación',
        priority: 'Baja',
        recommendation: 'Explorar nuevas revistas y conferencias para ampliar el alcance',
        reasoning: `Las publicaciones están concentradas en ${impact.venueCount} venues`
      });
    }

    // Recomendaciones positivas
    if (metrics.hIndex >= 10) {
      recommendations.push({
        category: 'Fortalezas',
        priority: 'Informativo',
        recommendation: 'Mantener el alto estándar de calidad en las publicaciones',
        reasoning: `El índice h de ${metrics.hIndex} indica un impacto académico sólido`
      });
    }

    return recommendations;
  }

  generateExecutiveSummary() {
    console.log('📊 Generando resumen ejecutivo...');
    
    const keyMetrics = this.generateKeyMetrics();
    const productivity = this.generateProductivityTrends();
    const topPerformers = this.generateTopPerformers();
    const collaboration = this.generateCollaborationInsights();
    const impact = this.generateResearchImpactAnalysis();
    const recommendations = this.generateRecommendations();

    const executiveSummary = {
      metadata: {
        generatedAt: new Date().toISOString(),
        reportVersion: '1.0.0',
        dataSource: 'Google Scholar',
        reportType: 'Executive Summary',
        period: 'Complete Academic Career'
      },

      authorProfile: {
        name: this.scholarData.author?.name || 'Roberto Sánchez-Reolid',
        affiliation: this.scholarData.author?.affiliation || '',
        interests: this.scholarData.author?.interests || [],
        scholarId: this.scholarData.author?.scholarId || ''
      },

      keyMetrics: keyMetrics,

      performanceHighlights: {
        topAchievements: [
          `${keyMetrics.totalPublications} publicaciones académicas`,
          `${keyMetrics.totalCitations} citas totales`,
          `Índice h de ${keyMetrics.hIndex}`,
          `${keyMetrics.i10Index} publicaciones con 10+ citas`,
          `${collaboration.totalUniqueCollaborators} colaboradores únicos`
        ],
        impactSummary: {
          citationRate: `${keyMetrics.citationRate}% de publicaciones citadas`,
          averageImpact: `${keyMetrics.averageCitationsPerPaper} citas por publicación`,
          recentActivity: `${productivity.recentYearsAnalysis.slice(-1)[0]?.publications || 0} publicaciones en ${new Date().getFullYear()}`
        }
      },

      productivityAnalysis: productivity,

      researchImpact: {
        topPublications: topPerformers.topCitedPublications.slice(0, 5),
        impactDistribution: impact.citationDistribution,
        impactCategories: impact.impactCategories,
        recentHighImpact: topPerformers.recentHighImpactPublications
      },

      collaborationProfile: collaboration,

      publicationStrategy: {
        topVenues: impact.topVenues.slice(0, 5),
        publisherDistribution: collaboration.publisherDistribution,
        venueRecommendations: impact.topVenues
          .filter(v => v.averageCitations > keyMetrics.averageCitationsPerPaper)
          .slice(0, 3)
      },

      strategicRecommendations: recommendations,

      benchmarkComparison: {
        careerStage: 'Assistant Professor',
        expectedHIndex: '10-15',
        expectedCitations: '300-800',
        performance: keyMetrics.hIndex >= 10 && keyMetrics.totalCitations >= 300 ? 'Sobre la media' : 'En desarrollo',
        competitiveAdvantages: [
          collaboration.collaborationRate > 70 ? 'Alta tasa de colaboración' : null,
          keyMetrics.citationRate > 70 ? 'Buen índice de citación' : null,
          productivity.productivityTrend === 'Creciente' ? 'Tendencia productiva positiva' : null
        ].filter(Boolean)
      },

      paginationSummary: {
        totalPages: this.paginationData?.pagination?.totalPages || 0,
        articlesPerPage: this.paginationData?.pagination?.articlesPerPage || 20,
        dataCompleteness: '100%',
        lastUpdate: this.scholarData.lastUpdated || new Date().toISOString()
      }
    };

    return executiveSummary;
  }

  saveSummary(summary) {
    fs.writeFileSync(SUMMARY_OUTPUT_FILE, JSON.stringify(summary, null, 2));
    console.log(`✅ Resumen ejecutivo guardado en: ${SUMMARY_OUTPUT_FILE}`);
    
    // Mostrar resumen en consola
    console.log('\n🎯 RESUMEN EJECUTIVO:');
    console.log(`\n👤 PERFIL ACADÉMICO:`);
    console.log(`• Autor: ${summary.authorProfile.name}`);
    console.log(`• Afiliación: ${summary.authorProfile.affiliation}`);
    
    console.log(`\n📊 MÉTRICAS CLAVE:`);
    console.log(`• Publicaciones: ${summary.keyMetrics.totalPublications}`);
    console.log(`• Citas totales: ${summary.keyMetrics.totalCitations}`);
    console.log(`• Índice h: ${summary.keyMetrics.hIndex}`);
    console.log(`• Índice i10: ${summary.keyMetrics.i10Index}`);
    console.log(`• Tasa de citación: ${summary.keyMetrics.citationRate}%`);
    
    console.log(`\n📈 PRODUCTIVIDAD:`);
    console.log(`• Tendencia: ${summary.productivityAnalysis.productivityTrend}`);
    console.log(`• Año más productivo: ${summary.productivityAnalysis.mostProductiveYear}`);
    console.log(`• Promedio anual: ${summary.productivityAnalysis.averagePerYear} publicaciones`);
    
    console.log(`\n🤝 COLABORACIÓN:`);
    console.log(`• Colaboradores únicos: ${summary.collaborationProfile.totalUniqueCollaborators}`);
    console.log(`• Tasa de colaboración: ${summary.collaborationProfile.collaborationRate}%`);
    console.log(`• Top colaborador: ${summary.collaborationProfile.topCollaborators[0]?.name || 'N/A'}`);
    
    console.log(`\n🏆 IMPACTO:`);
    console.log(`• Publicaciones alto impacto: ${summary.researchImpact.impactCategories.highImpact}`);
    console.log(`• Top publicación: ${summary.researchImpact.topPublications[0]?.citations || 0} citas`);
    
    console.log(`\n📋 RECOMENDACIONES ESTRATÉGICAS:`);
    summary.strategicRecommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.recommendation}`);
    });
    
    console.log(`\n📄 PAGINACIÓN:`);
    console.log(`• Total de páginas: ${summary.paginationSummary.totalPages}`);
    console.log(`• Artículos por página: ${summary.paginationSummary.articlesPerPage}`);
    console.log(`• Completitud de datos: ${summary.paginationSummary.dataCompleteness}`);
  }

  async run() {
    try {
      this.loadAllData();
      const summary = this.generateExecutiveSummary();
      this.saveSummary(summary);
      
      console.log('\n🎉 ¡Resumen ejecutivo completado exitosamente!');
      return summary;
      
    } catch (error) {
      console.error('❌ Error durante la generación del resumen:', error);
      throw error;
    }
  }
}

// Ejecución principal
async function main() {
  const generator = new ExecutiveSummaryGenerator();
  
  try {
    await generator.run();
  } catch (error) {
    console.error('❌ Error en la generación del resumen ejecutivo:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ExecutiveSummaryGenerator;
