document.addEventListener('DOMContentLoaded', () => {
	// Toggle de tema — puede haber varios botones .theme-toggle en la página
	// (nav de escritorio y menú móvil). La lectura inicial y aplicación del
	// tema ya la hace theme-init.js antes del primer render.
	const html = document.documentElement;

	document.querySelectorAll('.theme-toggle').forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const next = html.classList.contains('dark') ? 'light' : 'dark';
			html.classList.toggle('dark');
			localStorage.setItem('theme', next);
		});
	});

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			html.classList.toggle('dark', e.matches);
		}
	});

	// Botón "volver arriba"
	const backToTop = document.getElementById('back-to-top');
	if (backToTop) {
		const toggleBackToTop = () => {
			const show = window.scrollY > 400;
			backToTop.classList.toggle('!opacity-100', show);
			backToTop.classList.toggle('!translate-y-0', show);
			backToTop.classList.toggle('!pointer-events-auto', show);
			// Evita que el botón reciba foco por teclado mientras está oculto
			// (opacity-0 no lo saca del orden de tabulación por sí solo).
			backToTop.tabIndex = show ? 0 : -1;
		};
		window.addEventListener('scroll', toggleBackToTop, { passive: true });
		backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
	}

	// Menú móvil (hamburguesa)
	const mobileMenuButton = document.getElementById('mobile-menu-button');
	const mobileMenu = document.getElementById('mobile-menu');

	if (mobileMenuButton && mobileMenu) {
		let isOpen = false;

		const setOpen = (open, restoreFocus = false) => {
			isOpen = open;
			mobileMenu.classList.toggle('hidden', !open);
			mobileMenuButton.setAttribute('aria-expanded', String(open));

			if (open) {
				mobileMenu.querySelector('a')?.focus();
			} else if (restoreFocus) {
				mobileMenuButton.focus();
			}
		};

		mobileMenuButton.addEventListener('click', () => setOpen(!isOpen));

		mobileMenu.querySelectorAll('a').forEach((link) => {
			link.addEventListener('click', () => setOpen(false));
		});

		mobileMenu.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') setOpen(false, true);
		});

		window.addEventListener('resize', () => {
			if (window.innerWidth >= 768 && isOpen) setOpen(false);
		});
	}

	// Estilos dinámicos por dato (evita style="" inline, incompatible con
	// CSP style-src sin 'unsafe-inline'): punto animado de SignalTrace y
	// barras de ScholarMetrics, calculados en el servidor y pasados por
	// data-* attributes.
	document.querySelectorAll('.signal-dot[data-offset-path]').forEach((dot) => {
		dot.style.offsetPath = `path('${dot.dataset.offsetPath}')`;
		if (dot.dataset.dotDuration) dot.style.animationDuration = `${dot.dataset.dotDuration}s`;
	});

	document.querySelectorAll('[data-bar-height]').forEach((bar) => {
		bar.style.height = `${bar.dataset.barHeight}%`;
	});

	// Revelado suave al entrar en viewport (elementos .reveal y trazas .signal-trace)
	// threshold: 0 — revela en cuanto entre cualquier parte del elemento.
	// Un threshold > 0 impide revelar secciones más altas que el viewport
	// (p. ej. la lista completa de publicaciones, de ~10.000 px).
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const path = entry.target.querySelector('.signal-trace-path');
					if (path) path.classList.add('is-visible');
					const dot = entry.target.querySelector('.signal-dot');
					if (dot) dot.classList.add('is-visible');
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0, rootMargin: '0px 0px -10% 0px' }
	);

	document.querySelectorAll('.reveal, .signal-trace').forEach((el) => observer.observe(el));

	// Al imprimir/exportar a PDF, forzar modo claro (independientemente del tema
	// activo en pantalla) para que el documento impreso sea siempre legible.
	let wasDark = false;
	window.addEventListener('beforeprint', () => {
		wasDark = document.documentElement.classList.contains('dark');
		document.documentElement.classList.remove('dark');
	});
	window.addEventListener('afterprint', () => {
		if (wasDark) document.documentElement.classList.add('dark');
	});
});
