import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Proyectos de investigación: un archivo .md por proyecto en content/proyectos/
// Editables manualmente o desde el CMS (/admin)
const proyectos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/proyectos' }),
	schema: z.object({
		titulo: z.string(),
		// Etiqueta corta para la tarjeta de la home (p. ej. "IA · EDUCACIÓN")
		tag: z.string().default(''),
		etiquetas: z.array(z.string()).default([]),
		descripcion: z.string(),
		fechaInicio: z.string(),
		fechaFin: z.string(),
		estado: z.enum(['En curso', 'Finalizado']),
		financiacion: z.string().default(''),
		presupuesto: z.string().default(''),
		url: z.string().default(''),
		github: z.string().default(''),
		// Aparece en la sección "Proyectos destacados" de /proyectos
		destacado: z.boolean().default(false),
		// Aparece en "Investigaciones destacadas" de la home
		destacadoHome: z.boolean().default(false),
		progreso: z.number().min(0).max(100).default(0),
		resultados: z.array(z.string()).default([]),
	}),
});

// Asignaturas: un archivo .md por asignatura en content/asignaturas/
const asignaturas = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/asignaturas' }),
	schema: z.object({
		codigo: z.string(),
		titulo: z.string(),
		grado: z.string(),
		nivel: z.enum(['grado', 'master', 'doctorado']).default('grado'),
		curso: z.string(),
		cuatrimestre: z.string(),
		creditos: z.number(),
		// Lista de cursos académicos en los que se ha impartido (más reciente
		// primero) — la misma asignatura puede repetirse varios años.
		academicYear: z.array(z.string()),
		descripcion: z.string(),
		temario: z.array(z.string()).default([]),
		horario: z.string().default('Por definir'),
		enlaceMateriales: z.string().default(''),
		destacada: z.boolean().default(false),
	}),
});

export const collections = { proyectos, asignaturas };
