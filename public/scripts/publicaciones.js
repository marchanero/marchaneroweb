document.addEventListener('DOMContentLoaded', function () {
	const yearFilter = document.getElementById('yearFilter');
	const sortOrder = document.getElementById('sortOrder');
	const publicationsList = document.getElementById('publicationsList');
	const publicationItems = document.querySelectorAll('.publication-item');

	function filterPublications() {
		if (!yearFilter) return;
		const selectedYear = yearFilter.value;

		publicationItems.forEach((item) => {
			const match = !selectedYear || item.dataset.year === selectedYear;
			item.classList.toggle('hidden', !match);
		});
	}

	function sortPublications() {
		if (!sortOrder || !publicationsList) return;

		const items = Array.from(publicationItems);
		if (sortOrder.value === 'citations-desc') {
			items.sort((a, b) => parseInt(b.dataset.citations || '0') - parseInt(a.dataset.citations || '0'));
		} else {
			// Orden original del JSON (Scholar: fecha de publicación descendente)
			items.sort((a, b) => parseInt(b.dataset.year || '0') - parseInt(a.dataset.year || '0'));
		}

		items.forEach((item) => publicationsList.appendChild(item));
	}

	yearFilter?.addEventListener('change', filterPublications);
	sortOrder?.addEventListener('change', sortPublications);

	// Orden inicial: más citadas, todos los años
	sortPublications();
});
