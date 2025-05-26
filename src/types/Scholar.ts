// Definición de tipos para datos de Scholar

export interface ScholarInterest {
  title: string;
  link: string;
  serpapi_link: string;
}

export interface ScholarAuthor {
  name: string;
  affiliation: string;
  email: string;
  interests: ScholarInterest[];
  statistics: {
    totalCitations: number;
    hIndex: number;
    i10Index: number;
  };
  citationChart: {
    year: number;
    citations: number;
  }[];
}

export interface Publication {
  title: string;
  link: string;
  citation_id: string;
  authors: string;
  publication: string;
  cited_by: {
    value: number;
    link: string;
    serpapi_link: string;
    cites_id: string;
  };
  year: string;
}

export interface ScholarData {
  lastUpdated: string;
  author: ScholarAuthor;
  publications: Publication[];
}
