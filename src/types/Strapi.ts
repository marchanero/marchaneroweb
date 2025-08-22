// Tipos TypeScript para el contenido de Strapi Cloud

export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiRichText {
  type: string;
  children: Array<{
    type: 'text';
    text: string;
    bold?: boolean;
    italic?: boolean;
  }>;
}

// Tipo para artículos/publicaciones
export interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content?: StrapiRichText[];
    excerpt?: string;
    publishedAt: string;
    updatedAt: string;
    createdAt: string;
    authors?: string;
    publication?: string;
    year?: number;
    citedBy?: number;
    link?: string;
    tags?: string[];
    featured?: boolean;
    image?: {
      data: StrapiImage;
    };
  };
}

// Tipo para proyectos
export interface StrapiProject {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    fullDescription?: StrapiRichText[];
    startDate: string;
    endDate?: string;
    status: 'in_progress' | 'completed' | 'planned';
    budget?: number;
    funding?: string;
    progress?: number;
    featured?: boolean;
    technologies?: string[];
    results?: string[];
    publishedAt: string;
    updatedAt: string;
    createdAt: string;
    image?: {
      data: StrapiImage;
    };
    gallery?: {
      data: StrapiImage[];
    };
  };
}

// Tipo para información del sitio
export interface StrapiSiteInfo {
  id: number;
  attributes: {
    siteName: string;
    siteDescription: string;
    authorName: string;
    authorTitle: string;
    authorBio?: StrapiRichText[];
    email?: string;
    phone?: string;
    address?: string;
    socialLinks?: {
      platform: string;
      url: string;
    }[];
    seo?: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
    updatedAt: string;
  };
}

// Tipo para métricas académicas
export interface StrapiAcademicMetrics {
  id: number;
  attributes: {
    totalCitations: number;
    hIndex: number;
    i10Index: number;
    totalPublications: number;
    recentPublications: number;
    collaborations: number;
    lastUpdated: string;
    googleScholarId?: string;
    orcidId?: string;
    researchGateId?: string;
    updatedAt: string;
  };
}

// Tipos para respuestas de la API de Strapi
export interface StrapiAPIResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiAPICollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Tipos para parámetros de consulta
export interface StrapiQueryParams {
  populate?: string | string[];
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  locale?: string;
}

// Tipo de utilidad para extraer atributos de una entidad de Strapi
export type StrapiAttributes<T> = T extends { attributes: infer A } ? A : never;

export default {};
