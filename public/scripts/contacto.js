document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contact-form');
	const submitButton = form?.querySelector('button[type="submit"]');
	const feedback = document.getElementById('form-feedback');
	const feedbackTitle = document.getElementById('form-feedback-title');
	const feedbackText = document.getElementById('form-feedback-text');

	if (form && submitButton && feedback && feedbackTitle && feedbackText) {
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			submitButton.disabled = true;
			submitButton.textContent = 'Enviando...';

			const formData = new FormData(form);

			fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString(),
			})
				.then(() => {
					form.classList.add('hidden');
					feedback.classList.remove('hidden');
					feedbackTitle.textContent = 'Mensaje enviado con exito';
					feedbackText.textContent = 'Gracias por contactar. Te respondere en 24-48 horas.';
				})
				.catch(() => {
					submitButton.disabled = false;
					submitButton.textContent = 'Enviar mensaje';
					feedback.classList.remove('hidden');
					feedbackTitle.textContent = 'Error al enviar';
					feedbackText.textContent = 'Intenta de nuevo o escribe a roberto.sanchez@uclm.es';
				});
		});
	}
});
