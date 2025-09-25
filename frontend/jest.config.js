module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  'next/font/google$': '<rootDir>/src/__mocks__/next_font_google.js',
  'globals.css$': '<rootDir>/src/__mocks__/globals.css.js',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  '^axios$': require.resolve('axios'),
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
