// Archivo de configuración global para Jest
// Aquí puedes añadir configuraciones globales para las pruebas

// Tiempo de espera global para las pruebas
jest.setTimeout(30000); // 30 segundos

// Solo configurar window.matchMedia si estamos en un entorno con window (jsdom)
if (typeof window !== 'undefined') {
  // Mock global para el objeto window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
