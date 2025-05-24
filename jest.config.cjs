module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|cjs)$': 'babel-jest',
  },
  moduleNameMapper: {
    // Maneja las importaciones de archivos de estilo
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Maneja las importaciones de archivos de imagen
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/__mocks__/fileMock.cjs'
  },
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|cjs)$',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
