import { getJson } from 'serpapi';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;
const SCHOLAR_ID = 'PCALePwAAAAJ';

console.log('🔍 Probando conectividad con SerpAPI...');
console.log(`API Key: ${SERPAPI_KEY ? SERPAPI_KEY.slice(0, 10) + '...' : 'NO CONFIGURADA'}`);

async function testConnection() {
  try {
    const result = await getJson({
      engine: 'google_scholar_author',
      author_id: SCHOLAR_ID,
      api_key: SERPAPI_KEY,
      num: 10
    });
    
    console.log('✅ Conexión exitosa!');
    console.log(`👤 Autor: ${result.author?.name || 'No encontrado'}`);
    console.log(`📚 Publicaciones: ${result.articles?.length || 0}`);
    console.log(`📊 Citas: ${result.author?.cited_by?.total || 0}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    throw error;
  }
}

testConnection();
