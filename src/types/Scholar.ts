// Definición de tipos para datos de Scholar

export interface ScholarAuthor {
  name: string;
  affiliation: string;
  email: string;
  interests: string[];
  homepage?: string;
}

export interface ScholarMetrics {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  citationsRecent: number;
  hIndexRecent: number;
  i10IndexRecent: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  year: number | null;
  citedBy: number;
  link?: string;
  citedByLink?: string;
  type: 'journal' | 'conference' | 'book' | 'thesis' | 'article';
  isFirstAuthor: boolean;
  isCorrespondingAuthor: boolean;
}

export interface ScholarData {
  lastUpdated: string;
  author: ScholarAuthor;
  metrics: ScholarMetrics;
  publications: Publication[];
}
