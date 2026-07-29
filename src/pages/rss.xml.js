import rss from '@astrojs/rss';
import scholarData from '../data/scholar.json';

export async function GET() {
	const publications = (scholarData.publications ?? [])
		.filter((p) => p.year && p.title)
		.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
		.slice(0, 30);

	return rss({
		title: 'Publicaciones - Dr. Roberto Sánchez Reolid',
		description:
			'Investigación en Inteligencia Artificial, Machine Learning y procesamiento de señales fisiológicas. Universidad de Castilla-La Mancha.',
		site: 'https://marchanero.netlify.app',
		items: publications.map((pub) => {
			const authorsArray = Array.isArray(pub.authors) ? pub.authors : (pub.authors || '').split(',').map((s) => s.trim());
			const authorList = authorsArray.join(', ');

			return {
				title: pub.title,
				description: `${authorList} — ${pub.publication || 'Sin revista especificada'} (${pub.year}). Citas: ${pub.citedBy ?? 0}.`,
				link: pub.link || 'https://marchanero.netlify.app/publicaciones',
				pubDate: new Date(`${pub.year}-01-01`).toUTCString(),
				customData: `<dc:creator>${pub.authors}</dc:creator>`,
			};
		}),
		customData: `<language>es</language>
	<lastBuildDate>${new Date(scholarData.lastUpdated).toUTCString()}</lastBuildDate>`,
	});
}
