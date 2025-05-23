// Archivo de configuración para diferentes entornos

// Definición de entornos disponibles
const ENV = {
  development: 'development',
  staging: 'staging',
  production: 'production',
};

// Determinar el entorno actual
const getEnvironment = () => {
  // En GitHub Actions, usamos una variable de entorno para determinar el entorno
  if (process.env.GITHUB_ACTIONS) {
    if (process.env.GITHUB_REF === 'refs/heads/main') {
      return ENV.production;
    }
    return ENV.staging;
  }
  
  // En local, depende de cómo hayamos ejecutado el script
  return process.env.NODE_ENV === 'production' ? ENV.production : ENV.development;
};

// Configuración según el entorno
const config = {
  // Valores por defecto (development)
  baseUrl: 'http://localhost:4321',
  siteTitle: 'Robert Marchanero - Desarrollador Web',
  apiTimeout: 5000,
  
  // Valores para staging
  [ENV.staging]: {
    baseUrl: 'https://staging-robert-marchanero.netlify.app',
    siteTitle: '[Staging] Robert Marchanero - Desarrollador Web',
    apiTimeout: 10000,
  },
  
  // Valores para producción
  [ENV.production]: {
    baseUrl: 'https://robert-marchanero.netlify.app',
    siteTitle: 'Robert Marchanero - Desarrollador Web',
    apiTimeout: 10000,
  },
};

// El entorno actual
const currentEnv = getEnvironment();

// Exportar la configuración combinada
export default {
  ...config,
  ...config[currentEnv],
  currentEnv,
  isDev: currentEnv === ENV.development,
  isProd: currentEnv === ENV.production,
  isStaging: currentEnv === ENV.staging,
};
