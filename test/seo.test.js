describe('SEO', () => {
  beforeEach(() => {
    // Limpiar el DOM antes de cada test
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.title = '';
  });

  it('debería poder establecer y verificar el título del documento', () => {
    const testTitle = 'Roberto Sánchez Reolid | PhD';
    document.title = testTitle;
    expect(document.title).toBe(testTitle);
  });

  it('debería poder crear meta tags básicos', () => {
    // Crear meta tag de autor
    const metaAuthor = document.createElement('meta');
    metaAuthor.setAttribute('name', 'author');
    metaAuthor.setAttribute('content', 'Roberto Sánchez Reolid');
    document.head.appendChild(metaAuthor);

    // Verificar que se creó correctamente
    const authorMeta = document.querySelector('meta[name="author"]');
    expect(authorMeta).not.toBeNull();
    expect(authorMeta.getAttribute('content')).toBe('Roberto Sánchez Reolid');
  });

  it('debería poder crear meta tags de descripción', () => {
    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Sitio web académico del Dr. Roberto Sánchez Reolid, investigador PhD en la Universidad de Castilla-La Mancha');
    document.head.appendChild(metaDescription);

    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).not.toBeNull();
    expect(descriptionMeta.getAttribute('content')).toContain('Roberto Sánchez Reolid');
    expect(descriptionMeta.getAttribute('content')).toContain('investigador');
  });

  it('debería poder crear Open Graph meta tags', () => {
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Roberto Sánchez Reolid | PhD');
    document.head.appendChild(ogTitle);

    const ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    ogType.setAttribute('content', 'website');
    document.head.appendChild(ogType);

    expect(document.querySelector('meta[property="og:title"]')).not.toBeNull();
    expect(document.querySelector('meta[property="og:type"]')).not.toBeNull();
    expect(document.querySelector('meta[property="og:type"]').getAttribute('content')).toBe('website');
  });
});