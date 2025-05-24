// Definiciones de tipo para variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * El entorno actual (development, staging, production)
     * @default "development"
     */
    NODE_ENV: 'development' | 'production' | 'staging';
    
    /**
     * Flag que indica si estamos en GitHub Actions
     */
    GITHUB_ACTIONS?: string;
    
    /**
     * Referencia git actual, usado en GitHub Actions
     */
    GITHUB_REF?: string;
    
    /**
     * Token de autenticación de Netlify
     */
    NETLIFY_AUTH_TOKEN?: string;
    
    /**
     * ID del sitio en Netlify
     */
    NETLIFY_SITE_ID?: string;
  }
}
