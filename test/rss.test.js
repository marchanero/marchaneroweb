/**
 * @jest-environment node
 *
 * Este endpoint usa Response/Headers, que jsdom (el entorno por defecto del
 * proyecto) no implementa; Node sí las trae de forma nativa.
 */
describe('rss.xml.js', () => {
  it('genera un feed RSS bien formado, con namespace dc y sin ampersands sin escapar', async () => {
    const { GET } = await import('../src/pages/rss.xml.js');
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<rss');
    expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    expect(xml).toContain('<dc:creator>');

    // Cualquier '&' en el XML debe pertenecer a una entidad válida
    // (evita que un autor/título con '&' sin escapar rompa el feed).
    const bareAmpersands = xml.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g);
    expect(bareAmpersands).toBeNull();
  });

  it('declara el content-type como XML', async () => {
    const { GET } = await import('../src/pages/rss.xml.js');
    const response = await GET();

    expect(response.headers.get('content-type')).toContain('xml');
  });
});
