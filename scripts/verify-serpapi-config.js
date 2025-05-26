#!/usr/bin/env node

import { config } from 'dotenv';
import { getJson } from 'serpapi';
import fs from 'fs';

// Cargar variables de entorno
config();

console.log('🔍 VERIFICACIÓN COMPLETA DE CONFIGURACIÓN SERPAPI');
console.log('════════════════════════════════════════════════════════════════');

const API_KEY = process.env.SERPAPI_API_KEY;
const SCHOLAR_ID = 'PCALePwAAAAJ'; // Roberto Sánchez-Reolid

console.log(`📋 Configuración actual:`);
console.log(`   • API Key: ${API_KEY ? API_KEY.slice(0, 10) + '...' + API_KEY.slice(-4) : 'NO CONFIGURADA'}`);
console.log(`   • Scholar ID: ${SCHOLAR_ID}`);
console.log(`   • Archivo .env: ${fs.existsSync('.env') ? '✅ Existe' : '❌ No encontrado'}`);

if (!API_KEY) {
    console.error('❌ Error: SERPAPI_API_KEY no encontrada en variables de entorno');
    console.log('\n📝 Para configurar:');
    console.log('   1. Edita el archivo .env');
    console.log('   2. Añade: SERPAPI_API_KEY=tu_api_key_aqui');
    process.exit(1);
}

console.log('\n🧪 Probando conectividad básica...');

async function testBasicConnection() {
    try {
        const result = await getJson({
            engine: 'google_scholar_author',
            author_id: SCHOLAR_ID,
            api_key: API_KEY,
            num: 5 // Solo 5 publicaciones para test
        });
        
        if (result.error) {
            console.error('❌ Error de API:', result.error);
            return false;
        }
        
        console.log('✅ Conexión exitosa!');
        console.log(`📊 Datos obtenidos:`);
        console.log(`   • Autor: ${result.author?.name || 'No disponible'}`);
        console.log(`   • Afiliación: ${result.author?.affiliation || 'No disponible'}`);
        console.log(`   • Total citas: ${result.author?.cited_by?.table?.[0]?.citations?.all || 'No disponible'}`);
        console.log(`   • Índice h: ${result.author?.cited_by?.table?.[0]?.h_index?.all || 'No disponible'}`);
        console.log(`   • Publicaciones encontradas: ${result.articles?.length || 0}`);
        
        if (result.articles && result.articles.length > 0) {
            console.log(`   • Primera publicación: "${result.articles[0].title?.slice(0, 50)}..."`);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error de conexión:', error.message || error);
        console.error('❌ Detalles del error:', JSON.stringify(error, null, 2));
        
        const errorMessage = error.message || error.toString() || '';
        if (errorMessage.includes('run out of searches') || errorMessage.includes('limit')) {
            console.log('\n💡 El límite mensual de búsquedas se ha agotado.');
            console.log('   Opciones:');
            console.log('   1. Esperar a que se renueve el límite mensual');
            console.log('   2. Usar una cuenta SerpAPI diferente');
            console.log('   3. Usar el script ultra-optimizado (solo 1-2 requests)');
        }
        
        return false;
    }
}

console.log('\n🔧 Verificando scripts de scraping...');

const scripts = [
    'scripts/scrape-scholar.js',
    'scripts/scrape-scholar-advanced.js', 
    'scripts/scrape-scholar-optimized.js',
    'scripts/scrape-scholar-ultra-optimized.js'
];

scripts.forEach(script => {
    const exists = fs.existsSync(script);
    console.log(`   ${exists ? '✅' : '❌'} ${script}`);
});

async function main() {
    const connectionTest = await testBasicConnection();
    
    console.log('\n📋 RESUMEN:');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`🔑 API Key: ${API_KEY ? '✅ Configurada' : '❌ Faltante'}`);
    console.log(`🌐 Conectividad: ${connectionTest ? '✅ Exitosa' : '❌ Fallida'}`);
    console.log(`📁 Scripts: ${scripts.filter(s => fs.existsSync(s)).length}/${scripts.length} disponibles`);
    
    if (connectionTest) {
        console.log('\n🚀 RECOMENDACIÓN: Usar script ultra-optimizado');
        console.log('   npm run scholar:scrape-ultra');
        console.log('   (Solo usa 1-2 requests de API)');
    } else {
        console.log('\n⏳ Esperar renovación del límite o cambiar API key');
    }
}

main().catch(console.error);
