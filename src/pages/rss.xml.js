import rss from '@astrojs/rss';
import scholarData from '../data/scholar.json';

// customData se inserta como XML crudo (astrojs/rss lo parsea con fast-xml-parser),
// así que cualquier '&', '<' o '>' sin escapar en los datos de Scholar rompe el feed.
function escapeXml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

export async function GET(context) {
	const site = context?.site ?? 'https://robertosanchezreolid.netlify.app';
	const publications = (scholarData.publications ?? [])
		.filter((p) => p.year && p.title)
		.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
		.slice(0, 30);

	return rss({
		xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
		title: 'Publicaciones - Dr. Roberto Sánchez Reolid',
		description:
			'Investigación en Inteligencia Artificial, Machine Learning y procesamiento de señales fisiológicas. Universidad de Castilla-La Mancha.',
		site,
		items: publications.map((pub) => {
			const authorsArray = Array.isArray(pub.authors) ? pub.authors : (pub.authors || '').split(',').map((s) => s.trim());
			const authorList = authorsArray.join(', ');

			return {
				title: pub.title,
				description: `${authorList} — ${pub.publication || 'Sin revista especificada'} (${pub.year}). Citas: ${pub.citedBy ?? 0}.`,
				link: pub.link || new URL('/publicaciones', site).href,
				pubDate: new Date(`${pub.year}-01-01`).toUTCString(),
				customData: `<dc:creator>${escapeXml(authorList)}</dc:creator>`,
			};
		}),
		customData: `<language>es</language>
	<lastBuildDate>${new Date(scholarData.lastUpdated).toUTCString()}</lastBuildDate>`,
	});
}
