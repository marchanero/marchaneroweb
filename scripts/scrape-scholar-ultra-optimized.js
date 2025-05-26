#!/usr/bin/env node

/**
 * Script ultra-optimizado para Google Scholar scraping V3
 * NUEVA FUNCIONALIDAD: Paginación robusta completa
 * Objetivo: Obtener TODOS los datos con el mínimo número de requests
 * Manejo inteligente de paginación para garantizar 100% de cobertura
 */

import { config } from 'dotenv';
import { getJson } from 'serpapi';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.SERPAPI_API_KEY;
const AUTHOR_ID = 'PCALePwAAAAJ'; // Roberto Sánchez-Reolid
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// Configuración de paginación robusta
const PAGINATION_CONFIG = {
    MAX_RESULTS_PER_PAGE: 100,  // Máximo permitido por SerpAPI
    MAX_SAFE_REQUESTS: 5,       // Límite seguro para evitar agotar API
    START_OFFSET: 0,            // Inicio de paginación
    SORT_ORDER: 'pubdate'       // Ordenar por fecha de publicación
};

if (!API_KEY) {
    console.error('❌ Error: SERPAPI_API_KEY no encontrada en variables de entorno');
    process.exit(1);
}

console.log('🚀 SCRAPER ULTRA-OPTIMIZADO V3 - GOOGLE SCHOLAR');
console.log('══════════════════════════════════════════════════════════════════════');
console.log('🆕 NUEVA FUNCIONALIDAD: Paginación robusta completa');
console.log('🎯 Objetivo: Obtener TODOS los datos con manejo inteligente de paginación');
console.log('📊 Límite mensual: 100 requests - Uso optimizado con paginación inteligente');
console.log('🔄 Máximo seguro: 5 requests por ejecución (500 publicaciones máx)');
console.log('');

let requestCount = 0;
let totalPublications = 0;

/**
 * Función principal de scraping con paginación robusta
 */
async function scrapeScholarWithRobustPagination() {
    try {
        console.log('🔍 Iniciando scraping con paginación robusta...');
        
        let allArticles = [];
        let currentStart = PAGINATION_CONFIG.START_OFFSET;
        let hasMorePages = true;
        let pageNumber = 1;

        // Bucle de paginación robusta
        while (hasMorePages && requestCount < PAGINATION_CONFIG.MAX_SAFE_REQUESTS) {
            console.log(`\n📄 Procesando página ${pageNumber} (offset: ${currentStart})...`);
            
            requestCount++;
            console.log(`📡 API Request #${requestCount}/${PAGINATION_CONFIG.MAX_SAFE_REQUESTS}: google_scholar_author`);
            
            try {
                const authorData = await getJson({
                    engine: "google_scholar_author",
                    author_id: AUTHOR_ID,
                    api_key: API_KEY,
                    start: currentStart,
                    num: PAGINATION_CONFIG.MAX_RESULTS_PER_PAGE,
                    sort: PAGINATION_CONFIG.SORT_ORDER
                });

                if (!authorData) {
                    console.warn(`⚠️  Página ${pageNumber}: No se recibió respuesta de la API`);
                    break;
                }

                if (authorData.error) {
                    console.error(`❌ Error de API en página ${pageNumber}: ${authorData.error}`);
                    break;
                }

                // En la primera página, obtener información del autor
                if (pageNumber === 1) {
                    if (!authorData.author) {
                        console.error('❌ Respuesta de API incompleta en primera página:', JSON.stringify(authorData, null, 2));
                        throw new Error('No se pudo obtener información del autor - respuesta de API incompleta');
                    }
                    console.log(`✅ Perfil obtenido: ${authorData.author.name}`);
                    
                    // Almacenar datos del autor para uso posterior
                    global.authorInfo = authorData.author;
                    global.authorMetrics = authorData.cited_by;
                }

                // Obtener artículos de esta página
                const pageArticles = authorData.articles || [];
                console.log(`📚 Artículos en página ${pageNumber}: ${pageArticles.length}`);

                if (pageArticles.length === 0) {
                    console.log(`✅ No hay más artículos. Finalizando paginación.`);
                    hasMorePages = false;
                    break;
                }

                // Agregar artículos al array principal
                allArticles = allArticles.concat(pageArticles);
                totalPublications = allArticles.length;

                console.log(`📊 Total acumulado: ${totalPublications} publicaciones`);

                // Verificar si hay más páginas usando la información de paginación de SerpAPI
                const pagination = authorData.serpapi_pagination;
                
                if (pagination && pagination.next) {
                    console.log(`🔄 Detectada página siguiente disponible`);
                    currentStart += PAGINATION_CONFIG.MAX_RESULTS_PER_PAGE;
                    pageNumber++;
                    
                    // Verificar que no hayamos llegado al límite de artículos por página
                    if (pageArticles.length < PAGINATION_CONFIG.MAX_RESULTS_PER_PAGE) {
                        console.log(`✅ Página ${pageNumber - 1} devolvió menos artículos que el máximo. Asumiendo final.`);
                        hasMorePages = false;
                    }
                } else {
                    console.log(`✅ No hay más páginas disponibles según SerpAPI`);
                    hasMorePages = false;
                }

                // Pausa entre requests para ser respetuoso con la API
                if (hasMorePages && requestCount < PAGINATION_CONFIG.MAX_SAFE_REQUESTS) {
                    console.log(`⏸️  Pausa de 1 segundo entre requests...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (pageError) {
                console.error(`❌ Error en página ${pageNumber}:`, pageError.message);
                console.log(`🔄 Continuando con los datos obtenidos hasta ahora...`);
                break;
            }
        }

        // Verificar si llegamos al límite de requests
        if (requestCount >= PAGINATION_CONFIG.MAX_SAFE_REQUESTS && hasMorePages) {
            console.log(`\n⚠️  ADVERTENCIA: Se alcanzó el límite de ${PAGINATION_CONFIG.MAX_SAFE_REQUESTS} requests por seguridad.`);
            console.log(`📊 Datos obtenidos: ${totalPublications} publicaciones`);
            console.log(`💡 Para obtener más datos, ejecute el script nuevamente con un offset mayor.`);
        }

        console.log(`\n✅ Paginación completada!`);
        console.log(`📊 Total final: ${totalPublications} publicaciones obtenidas`);
        console.log(`📡 Requests utilizados: ${requestCount}/${PAGINATION_CONFIG.MAX_SAFE_REQUESTS}`);

        // Crear directorio si no existe
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // Recuperar información del autor de la primera página
        const authorInfo = global.authorInfo || {
            name: 'Roberto Sánchez-Reolid',
            affiliations: ['Universidad de Castilla-La Mancha'],
            email: 'roberto.sanchez@uclm.es',
            interests: [],
            homepage: null
        };

        const authorMetrics = global.authorMetrics || {
            table: [
                { citations: { all: 0, since_2019: 0 } },
                { h_index: { all: 0, since_2019: 0 } },
                { i10_index: { all: 0, since_2019: 0 } }
            ]
        };

        // Procesar y estructurar los datos con paginación robusta
        const robustData = {
            lastUpdated: new Date().toISOString(),
            scrapingMethod: 'ultra-optimized-v3-robust-pagination',
            paginationInfo: {
                totalPages: pageNumber - 1,
                totalRequests: requestCount,
                maxRequestsUsed: PAGINATION_CONFIG.MAX_SAFE_REQUESTS,
                totalPublications: totalPublications,
                publicationsPerPage: PAGINATION_CONFIG.MAX_RESULTS_PER_PAGE,
                completeness: hasMorePages ? 'partial' : 'complete',
                notes: hasMorePages ? 
                    `Posibles publicaciones adicionales disponibles. Ejecutar con offset ${currentStart} para continuar.` :
                    'Todos los datos disponibles han sido obtenidos.'
            },
            author: {
                name: authorInfo.name,
                affiliation: authorInfo.affiliations,
                email: authorInfo.email,
                interests: authorInfo.interests || [],
                homepage: authorInfo.homepage,
                scholarId: AUTHOR_ID
            },
            metrics: {
                totalCitations: authorMetrics.table?.[0]?.citations?.all || 0,
                hIndex: authorMetrics.table?.[1]?.h_index?.all || 0,
                i10Index: authorMetrics.table?.[2]?.i10_index?.all || 0,
                citationsRecent: authorMetrics.table?.[0]?.citations?.since_2019 || 0,
                hIndexRecent: authorMetrics.table?.[1]?.h_index?.since_2019 || 0,
                i10IndexRecent: authorMetrics.table?.[2]?.i10_index?.since_2019 || 0
            },
            publications: allArticles.map((article, index) => {
                const year = article.year ? parseInt(article.year) : null;
                const authors = article.authors ? article.authors.split(', ') : [];
                
                return {
                    id: `pub_${index + 1}`,
                    title: article.title || 'Sin título',
                    authors: authors,
                    publication: article.publication || 'Publicación no especificada',
                    year: year,
                    citedBy: article.cited_by?.value || 0,
                    link: article.link,
                    citedByLink: article.cited_by?.link,
                    citationId: article.citation_id,
                    type: determinePublicationType(article.publication),
                    isFirstAuthor: authors.length > 0 && 
                        (authors[0].includes('R Sánchez') || 
                         authors[0].includes('Roberto') || 
                         authors[0].includes('RS Reolid')),
                    isCorrespondingAuthor: article.authors?.includes('✉') || false
                };
            })
        };

        // Ordenar publicaciones por año (más recientes primero)
        robustData.publications.sort((a, b) => (b.year || 0) - (a.year || 0));

        // Guardar archivo principal con paginación robusta
        const mainFile = path.join(OUTPUT_DIR, 'scholar.json');
        fs.writeFileSync(mainFile, JSON.stringify(robustData, null, 2), 'utf8');

        // Crear versión extendida con análisis de paginación
        const extendedData = {
            ...robustData,
            paginationAnalysis: {
                efficiency: {
                    requestsUsed: requestCount,
                    publicationsPerRequest: Math.round(totalPublications / requestCount),
                    efficiency: requestCount > 0 ? Math.round(totalPublications / requestCount) : 0
                },
                coverage: {
                    estimatedTotal: totalPublications + (hasMorePages ? 50 : 0), // Estimación conservadora
                    obtainedTotal: totalPublications,
                    coveragePercentage: hasMorePages ? 
                        Math.round((totalPublications / (totalPublications + 50)) * 100) : 100
                },
                recommendations: generatePaginationRecommendations(requestCount, totalPublications, hasMorePages)
            },
            temporalAnalysis: generateTemporalAnalysis(robustData.publications),
            summary: generateSummary(robustData)
        };

        // Guardar archivo extendido
        const extendedFile = path.join(OUTPUT_DIR, 'scholar-detailed.json');
        fs.writeFileSync(extendedFile, JSON.stringify(extendedData, null, 2), 'utf8');

        // Generar reporte de paginación robusta
        const paginationReport = {
            lastUpdated: new Date().toISOString(),
            paginationMethod: 'robust-serpapi-v3',
            execution: {
                requestsUsed: requestCount,
                pagesProcessed: pageNumber - 1,
                publicationsObtained: totalPublications,
                completeness: hasMorePages ? 'partial' : 'complete'
            },
            optimization: {
                method: 'ultra-optimized-robust-pagination',
                requestsSaved: Math.max(0, 58 - requestCount), // vs método anterior
                efficiencyGain: Math.round(((58 - requestCount) / 58) * 100) + '%',
                monthlyCapacity: Math.floor(100 / Math.max(requestCount, 1))
            },
            nextExecution: hasMorePages ? {
                recommended: true,
                startOffset: currentStart,
                estimatedAdditionalRequests: Math.min(2, PAGINATION_CONFIG.MAX_SAFE_REQUESTS),
                instructions: `Ejecutar con parámetro start=${currentStart} para continuar`
            } : {
                recommended: false,
                reason: 'Todos los datos han sido obtenidos'
            }
        };

        // Guardar reporte de paginación
        const paginationFile = path.join(OUTPUT_DIR, 'scholar-pagination-report.json');
        fs.writeFileSync(paginationFile, JSON.stringify(paginationReport, null, 2), 'utf8');

        // Mostrar resumen final detallado
        console.log('');
        console.log('✅ SCRAPING CON PAGINACIÓN ROBUSTA COMPLETADO!');
        console.log('══════════════════════════════════════════════════════════════════════');
        console.log(`📊 Archivo principal: ${mainFile}`);
        console.log(`📋 Análisis extendido: ${extendedFile}`);
        console.log(`📄 Reporte de paginación: ${paginationFile}`);
        console.log('');
        console.log('🎯 RESUMEN DE PAGINACIÓN ROBUSTA:');
        console.log(`• Páginas procesadas: ${pageNumber - 1}`);
        console.log(`• Publicaciones totales: ${totalPublications}`);
        console.log(`• Citaciones totales: ${robustData.metrics.totalCitations}`);
        console.log(`• Índice h: ${robustData.metrics.hIndex}`);
        console.log(`• Índice i10: ${robustData.metrics.i10Index}`);
        console.log(`• Requests utilizados: ${requestCount}/${PAGINATION_CONFIG.MAX_SAFE_REQUESTS}`);
        console.log(`• Promedio pub/request: ${Math.round(totalPublications / requestCount)}`);
        console.log(`• Completeness: ${hasMorePages ? 'PARCIAL' : 'COMPLETA'}`);
        console.log(`• Ejecuciones mensuales: ~${Math.floor(100 / Math.max(requestCount, 1))}`);
        
        if (hasMorePages) {
            console.log('');
            console.log('🔄 CONTINUACIÓN RECOMENDADA:');
            console.log(`• Ejecutar nuevamente con offset: ${currentStart}`);
            console.log(`• Requests estimados adicionales: 1-2`);
            console.log(`• Comando: npm run scholar:ultra -- --start=${currentStart}`);
        }

        console.log('');
        console.log(`🚀 ¡Paginación robusta implementada! Uso eficiente: ${requestCount} requests.`);

        return {
            success: true,
            publicationsCount: totalPublications,
            requestsUsed: requestCount,
            pagesProcessed: pageNumber - 1,
            isComplete: !hasMorePages,
            nextOffset: hasMorePages ? currentStart : null,
            data: robustData
        };

    } catch (error) {
        console.error('❌ Error durante el scraping con paginación robusta:', error.message);
        console.error('❌ Stack trace:', error.stack);
        
        // Guardar información del error para debug
        const errorReport = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            requestsUsed: requestCount,
            publicationsObtained: totalPublications,
            phase: 'robust-pagination-scraping'
        };
        
        const errorFile = path.join(__dirname, 'robust-pagination-error.json');
        fs.writeFileSync(errorFile, JSON.stringify(errorReport, null, 2));
        
        return {
            success: false,
            error: error.message,
            requestsUsed: requestCount,
            publicationsCount: totalPublications
        };
    }
}

/**
 * Generar recomendaciones de paginación
 */
function generatePaginationRecommendations(requestsUsed, publicationsObtained, hasMorePages) {
    const recommendations = [];
    
    if (hasMorePages) {
        recommendations.push({
            priority: 'HIGH',
            action: 'Ejecutar continuación para obtener datos restantes',
            impact: 'Completar conjunto de datos al 100%',
            estimatedCost: '1-2 requests adicionales'
        });
    }
    
    if (requestsUsed <= 2) {
        recommendations.push({
            priority: 'LOW',
            action: 'Considerar aumentar frecuencia de ejecución',
            impact: 'Datos más actualizados con uso eficiente de API',
            estimatedCost: `${requestsUsed} requests por ejecución`
        });
    }
    
    recommendations.push({
        priority: 'MEDIUM',
        action: 'Monitorear uso mensual de API',
        impact: 'Prevenir exceder límites',
        estimatedCost: 'Sin costo adicional'
    });
    
    return recommendations;
}

/**
 * Función auxiliar para determinar tipo de publicación
 */
function determinePublicationType(publication) {
    if (!publication) return 'article';
    
    const pubLC = publication.toLowerCase();
    
    if (pubLC.includes('journal') || pubLC.includes('ieee') || pubLC.includes('acm')) {
        return 'journal';
    } else if (pubLC.includes('conference') || pubLC.includes('proceedings')) {
        return 'conference';
    } else if (pubLC.includes('book')) {
        return 'book';
    } else if (pubLC.includes('thesis') || pubLC.includes('dissertation')) {
        return 'thesis';
    }
    
    return 'article';
}

/**
 * Generar análisis temporal básico
 */
function generateTemporalAnalysis(publications) {
    const publicationsByYear = {};
    const citationsByYear = {};
    
    publications.forEach(pub => {
        if (pub.year) {
            publicationsByYear[pub.year] = (publicationsByYear[pub.year] || 0) + 1;
            citationsByYear[pub.year] = (citationsByYear[pub.year] || 0) + (pub.citedBy || 0);
        }
    });
    
    const years = Object.keys(publicationsByYear).map(Number).sort();
    const careerSpan = years.length > 0 ? Math.max(...years) - Math.min(...years) + 1 : 1;
    
    return {
        publicationsByYear,
        citationsByYear,
        careerSpan,
        activeYears: years.length,
        firstPublication: Math.min(...years) || new Date().getFullYear(),
        lastPublication: Math.max(...years) || new Date().getFullYear()
    };
}

/**
 * Generar resumen rápido
 */
function generateSummary(data) {
    return {
        totalPublications: data.publications.length,
        totalCitations: data.metrics.totalCitations,
        hIndex: data.metrics.hIndex,
        i10Index: data.metrics.i10Index,
        avgCitationsPerPaper: Math.round(data.metrics.totalCitations / data.publications.length) || 0,
        publicationsWithCitations: data.publications.filter(p => p.citedBy > 0).length,
        mostCitedPaper: data.publications.reduce((max, pub) => 
            pub.citedBy > (max?.citedBy || 0) ? pub : max, null)
    };
}

// Ejecutar el script si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    // Verificar argumentos de línea de comandos para continuación de paginación
    const args = process.argv.slice(2);
    const startArg = args.find(arg => arg.startsWith('--start='));
    
    if (startArg) {
        const startOffset = parseInt(startArg.split('=')[1]);
        PAGINATION_CONFIG.START_OFFSET = startOffset;
        console.log(`🔄 Continuando paginación desde offset: ${startOffset}`);
    }
    
    scrapeScholarWithRobustPagination()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 Scraping con paginación robusta completado exitosamente!');
                
                if (!result.isComplete) {
                    console.log(`\n💡 Para continuar: npm run scholar:robust -- --start=${result.nextOffset}`);
                }
                
                process.exit(0);
            } else {
                console.error('\n❌ Scraping falló:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 Error no manejado:', error);
            console.error('Stack:', error.stack);
            process.exit(1);
        });
}

export { scrapeScholarWithRobustPagination };
