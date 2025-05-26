#!/usr/bin/env node

/**
 * Script de prueba para verificar conectividad con SerpAPI
 */

import { config } from 'dotenv';
import { getJson } from 'serpapi';

config();

const API_KEY = process.env.SERPAPI_API_KEY;

console.log('🔍 Verificando conectividad con SerpAPI...');
console.log(`🔑 API Key (primeros 10 chars): ${API_KEY?.substring(0, 10)}...`);

async function testConnection() {
    try {
        console.log('\n📡 Haciendo test básico de conectividad...');
        
        const result = await getJson({
            engine: "google_scholar_author",
            author_id: "IlqRrUIAAAAJ", // Roberto Sánchez-Reolid
            api_key: API_KEY,
            num: 1 // Solo 1 publicación para test
        });

        console.log('✅ Conexión exitosa!');
        console.log(`👤 Autor encontrado: ${result.author?.name || 'N/A'}`);
        console.log(`📚 Publicaciones detectadas: ${result.articles?.length || 0}`);
        console.log(`📊 Citas totales: ${result.cited_by?.table?.[0]?.citations?.all || 'N/A'}`);
        
        // Mostrar estructura del response para debug
        console.log('\n🔍 Estructura del response:');
        console.log('Keys principales:', Object.keys(result));
        
        if (result.author) {
            console.log('Author keys:', Object.keys(result.author));
        }
        
        if (result.cited_by) {
            console.log('Cited_by keys:', Object.keys(result.cited_by));
        }

        return true;
    } catch (error) {
        console.error('❌ Error de conectividad:', error);
        console.error('Detalles del error:', error.message);
        
        // Revisar si es problema de API key
        if (error.message?.includes('Invalid API key')) {
            console.error('🔑 Problema: API key inválida');
        } else if (error.message?.includes('rate limit')) {
            console.error('⏱️ Problema: Límite de rate excedido');
        } else if (error.message?.includes('quota')) {
            console.error('📊 Problema: Cuota mensual excedida');
        }
        
        return false;
    }
}

testConnection()
    .then(success => {
        if (success) {
            console.log('\n🎉 Test de conectividad completado exitosamente!');
            process.exit(0);
        } else {
            console.log('\n❌ Test de conectividad falló');
            process.exit(1);
        }
    });
