// Configuración y utilidades para conectar con Strapi Cloud
import axios from 'axios';

// URL base de tu instancia de Strapi Cloud (reemplaza con tu URL real)
const STRAPI_URL = process.env.PUBLIC_STRAPI_URL || import.meta.env.PUBLIC_STRAPI_URL || 'https://creative-happiness-dc6aff0a15.strapiapp.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || import.meta.env.STRAPI_API_TOKEN || '3b9de32bc6bd6e6116e175729a37851e4dff8cdcea4239dcc3cca1f0e33132a4e20cdb4c655968c5d29894d45656f8ddbb412f5b4f87c8225d33925a9e965b4baaf0a5538ed03a46e6918791877b38442719e5bc34a66a08c8aacd2012a3c63e68b2bf2225b24eeb3c556d774d8f3ca0e35b3f6cbffc1223e2db4e6f6d256d60';

// Cliente de Axios configurado para Strapi
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Funciones para obtener contenido de Strapi
export const strapiAPI = {
  // Obtener artículos/publicaciones
  async getArticles(params = {}) {
    try {
      const response = await strapiClient.get('/articles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles from Strapi:', error);
      return { data: [], meta: {} };
    }
  },

  // Obtener proyectos
  async getProjects(params = {}) {
    try {
      const response = await strapiClient.get('/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects from Strapi:', error);
      return { data: [], meta: {} };
    }
  },

  // Obtener un artículo específico por slug
  async getArticleBySlug(slug) {
    try {
      const response = await strapiClient.get(`/articles?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  },

  // Obtener un proyecto específico por slug
  async getProjectBySlug(slug) {
    try {
      const response = await strapiClient.get(`/projects?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      return null;
    }
  },

  // Obtener información general del sitio
  async getSiteInfo() {
    try {
      const response = await strapiClient.get('/site-info?populate=*');
      return response.data?.data || {};
    } catch (error) {
      console.error('Error fetching site info:', error);
      return {};
    }
  },

  // Obtener métricas académicas
  async getAcademicMetrics() {
    try {
      const response = await strapiClient.get('/academic-metrics?populate=*');
      return response.data?.data || {};
    } catch (error) {
      console.error('Error fetching academic metrics:', error);
      return {};
    }
  }
};

// Función helper para formatear URLs de imágenes de Strapi
export function getStrapiImageURL(imageData) {
  if (!imageData) return null;
  
  const { url, alternativeText, caption, width, height } = imageData.attributes || imageData;
  
  // Si la URL ya es completa, devolverla tal como está
  if (url?.startsWith('http')) return url;
  
  // Si es una URL relativa, añadir la base URL de Strapi
  return `${STRAPI_URL}${url}`;
}

// Función helper para formatear fechas
export function formatStrapiDate(dateString, locale = 'es-ES') {
  if (!dateString) return '';
  
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función helper para obtener texto plano de rich text
export function getStrapiPlainText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  
  return richTextArray
    .map(block => {
      if (block.type === 'paragraph') {
        return block.children?.map(child => child.text).join('') || '';
      }
      return '';
    })
    .join(' ');
}

export default strapiAPI;
