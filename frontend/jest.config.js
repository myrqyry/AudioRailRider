export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  globals: {
    'ts-jest': {
      // Must be set to `true` when using ES Modules
      useESM: true,
    },
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  setupFiles: ['jest-canvas-mock'],
  modulePathIgnorePatterns: ["<rootDir>/public/lygia"],
  testPathIgnorePatterns: [
    "<rootDir>/tests/playwright/",
    "<rootDir>/dist/"
  ],
};