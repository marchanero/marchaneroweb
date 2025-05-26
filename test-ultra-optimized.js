#!/usr/bin/env node

import { config } from 'dotenv';
import { getJson } from 'serpapi';

// Cargar variables de entorno
config();

const API_KEY = process.env.SERPAPI_API_KEY;
const AUTHOR_ID = 'PCALePwAAAAJ'; // Roberto Sánchez-Reolid

console.log('🧪 TEST SIMPLIFICADO DEL SCRIPT ULTRA-OPTIMIZADO');
console.log('API Key:', API_KEY ? API_KEY.slice(0, 10) + '...' + API_KEY.slice(-4) : 'NO ENCONTRADA');
console.log('Author ID:', AUTHOR_ID);

async function testAPICall() {
    try {
        console.log('\n📡 Haciendo llamada de prueba...');
        
        const result = await getJson({
            engine: "google_scholar_author",
            author_id: AUTHOR_ID,
            api_key: API_KEY,
            num: 100,
            sort: "pubdate"
        });

        console.log('\n✅ Respuesta exitosa!');
        console.log('- Tiene autor:', !!result.author);
        console.log('- Nombre del autor:', result.author?.name);
        console.log('- Tiene artículos:', !!result.articles);
        console.log('- Número de artículos:', result.articles?.length || 0);
        console.log('- Tiene cited_by:', !!result.cited_by);
        console.log('- Error en respuesta:', result.error);
        console.log('- Claves principales:', Object.keys(result));

        return result;

    } catch (error) {
        console.error('\n❌ Error en la llamada:');
        console.error('- Mensaje:', error.message);
        console.error('- Stack:', error.stack);
        console.error('- Error completo:', JSON.stringify(error, null, 2));
        throw error;
    }
}

testAPICall()
    .then(result => {
        console.log('\n🎉 Test completado exitosamente!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 Test falló');
        process.exit(1);
    });
