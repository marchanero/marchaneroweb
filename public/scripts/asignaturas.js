document.addEventListener('DOMContentLoaded', () => {
	const selectNivel = document.getElementById('nivel');
	const selectAnio = document.getElementById('anioAcademico');
	const inputBusqueda = document.getElementById('busqueda');
	const cards = document.querySelectorAll('.subject-card');
	const noResults = document.getElementById('noResults');
	const resultCount = document.getElementById('resultCount');

	const sections = document.querySelectorAll('.subject-section');

	function applyFilters() {
		const nivel = selectNivel?.value || 'todos';
		const anio = selectAnio?.value || 'todos';
		const busqueda = (inputBusqueda?.value || '').toLowerCase().trim();

		let visible = 0;
		cards.forEach((card) => {
			const matchNivel = nivel === 'todos' || card.dataset.nivel === nivel;
			const matchAnio = anio === 'todos' || card.dataset.anio === anio;
			const matchBusqueda = !busqueda || (card.dataset.search || '').includes(busqueda);
			const show = matchNivel && matchAnio && matchBusqueda;
			card.classList.toggle('hidden', !show);
			if (show) visible++;
		});

		// Oculta también la cabecera de un curso si ningún resultado suyo pasa el filtro.
		sections.forEach((section) => {
			const hasVisible = !!section.querySelector('.subject-card:not(.hidden)');
			section.classList.toggle('hidden', !hasVisible);
		});

		if (resultCount) resultCount.textContent = `(${visible})`;
		noResults?.classList.toggle('hidden', visible !== 0);
	}

	selectNivel?.addEventListener('change', applyFilters);
	selectAnio?.addEventListener('change', applyFilters);
	inputBusqueda?.addEventListener('input', applyFilters);
});
