import { config } from 'dotenv';
config();

console.log('🔍 Variables de entorno cargadas:');
console.log('API Key:', process.env.SERPAPI_API_KEY?.slice(0, 10) + '...' + process.env.SERPAPI_API_KEY?.slice(-4));
console.log('API Key completa:', process.env.SERPAPI_API_KEY);
