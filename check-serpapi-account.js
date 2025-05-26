#!/usr/bin/env node

/**
 * Script para verificar el estado de la cuenta de SerpAPI
 * Muestra información sobre límites y cuándo se renuevan
 */

import { config } from 'dotenv';
import { getJson } from 'serpapi';

// Cargar variables de entorno
config();

const API_KEY = process.env.SERPAPI_API_KEY;

if (!API_KEY) {
    console.error('❌ Error: SERPAPI_API_KEY no encontrada en variables de entorno');
    process.exit(1);
}

console.log('🔍 VERIFICACIÓN DE CUENTA SERPAPI');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`🔑 API Key (primeros 10 chars): ${API_KEY.substring(0, 10)}...`);
console.log('');

async function checkAccountStatus() {
    try {
        // Hacer una consulta simple para ver el estado de la cuenta
        console.log('📡 Verificando estado de la cuenta...');
        
        const result = await getJson({
            engine: "google_scholar_profiles",
            mauthors: "Roberto Sánchez-Reolid",
            api_key: API_KEY
        });

        console.log('✅ Cuenta activa y funcional');
        console.log('📊 Información de la consulta:');
        console.log(`• Perfiles encontrados: ${result.profiles?.length || 0}`);
        
        return true;
        
    } catch (error) {
        console.log('❌ Error al verificar cuenta:', error.message);
        
        if (error.message.includes('run out of searches')) {
            console.log('');
            console.log('💡 DIAGNÓSTICO:');
            console.log('• La cuenta ha agotado el límite mensual de 100 búsquedas');
            console.log('• Esto confirma por qué necesitamos el script ultra-optimizado');
            console.log('• El límite se renueva mensualmente en la fecha de suscripción');
            console.log('');
            console.log('📅 SOLUCIONES:');
            console.log('1. Esperar a que se renueve el límite mensual');
            console.log('2. Cuando se renueve, usar el script ultra-optimizado');
            console.log('3. El nuevo script usa solo 1-2 requests vs 58 del anterior');
            console.log('4. Esto permitirá ~50 ejecuciones mensuales vs 1-2 actuales');
            console.log('');
            console.log('🎯 BENEFICIO DEL SCRIPT OPTIMIZADO:');
            console.log(`• Método anterior: ~58 requests por ejecución`);
            console.log(`• Método optimizado: ~2 requests por ejecución`);
            console.log(`• Mejora: 96% de reducción en uso de API`);
            console.log(`• Capacidad mensual: De 1-2 ejecuciones a ~50 ejecuciones`);
        }
        
        return false;
    }
}

// Función para estimar cuándo se renueva el límite
function estimateRenewalDate() {
    console.log('');
    console.log('📅 INFORMACIÓN SOBRE RENOVACIÓN:');
    console.log('• Los límites de SerpAPI se renuevan mensualmente');
    console.log('• La fecha exacta depende de cuándo se creó/renovó la suscripción');
    console.log('• Para verificar la fecha exacta, revisar el dashboard de SerpAPI');
    console.log('• URL: https://serpapi.com/dashboard');
    console.log('');
    console.log('🔄 RECOMENDACIONES:');
    console.log('1. Verificar fecha de renovación en el dashboard de SerpAPI');
    console.log('2. Configurar el script optimizado para ejecutarse después de la renovación');
    console.log('3. Considerar ejecución semanal en lugar de diaria para mayor eficiencia');
    console.log('4. Monitorear uso mensual para evitar agotar límites');
}

async function main() {
    const isWorking = await checkAccountStatus();
    estimateRenewalDate();
    
    if (!isWorking) {
        console.log('');
        console.log('🚀 PRÓXIMOS PASOS:');
        console.log('1. ✅ Script ultra-optimizado ya está listo');
        console.log('2. ⏳ Esperar renovación del límite mensual');
        console.log('3. 🧪 Probar script optimizado cuando se renueve');
        console.log('4. 📅 Configurar ejecución programada más eficiente');
        console.log('5. 🔄 Actualizar workflow de GitHub Actions');
    }
}

main().catch(console.error);
