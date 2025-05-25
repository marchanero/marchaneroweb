export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Para archivos JS/JSX
    '^.+\\.ts?$': 'ts-jest', // Para archivos TypeScript
    '^.+\\.astro$': 'jest-transform-stub', // Usar jest-transform-stub para Astro
    '^.+\\.mjs$': 'babel-jest', // Añadir transformación para .mjs
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node', 'astro', 'mjs'], // Añadir mjs
  moduleNameMapper: {
    // Asegúrate de que los alias de importación coincidan con tu tsconfig.json o jsconfig.json
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@config$': '<rootDir>/src/config.js',
    // Mock para archivos estáticos si es necesario (ej. imágenes, css)
    '\\.(jpg|jpeg|png|gif|webp|svg|css|scss|sass|less)$' : '<rootDir>/test/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup para polyfills
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};