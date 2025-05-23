module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // Maneja las importaciones de archivos de estilo
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Maneja las importaciones de archivos de imagen
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
