export interface HomeData {
	introTitulo: string;
	introTexto: string;
	researchLines: string[];
}

export interface EducacionItem {
	titulo: string;
	institucion: string;
	periodo: string;
	descripcion?: string;
}

export interface ExperienciaProfesionalItem {
	puesto: string;
	entidad: string;
	periodo: string;
	descripcion?: string;
}

export interface ExperienciaDocenteItem {
	puesto: string;
	departamento: string;
	universidad: string;
	periodo: string;
	asignaturas: string[];
}

export interface ExperienciaInvestigadoraItem {
	puesto: string;
	proyecto: string;
	entidad: string;
	periodo: string;
	codigo?: string;
	descripcion?: string;
}

export interface EstanciaItem {
	centro: string;
	departamento?: string;
	pais: string;
	periodo: string;
	duracion?: string;
	descripcion?: string;
}

export interface GestionAcademicaItem {
	cargo: string;
	institucion: string;
	periodo: string;
	descripcion?: string;
}

export interface ReconocimientoItem {
	titulo: string;
	entidad: string;
	anio: number;
}

export interface CvData {
	educacion: EducacionItem[];
	experienciaProfesional: ExperienciaProfesionalItem[];
	experienciaDocente: ExperienciaDocenteItem[];
	experienciaInvestigadora: ExperienciaInvestigadoraItem[];
	estancias: EstanciaItem[];
	gestionAcademica: GestionAcademicaItem[];
	reconocimientos: ReconocimientoItem[];
}

export interface CuartilItem {
	titulo: string;
	cuartil: string;
	categoria?: string;
	posicion?: string;
	impactFactor?: string;
}

export interface CuartilesData {
	cuartiles: CuartilItem[];
}
