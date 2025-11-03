export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '\\.glsl$': '<rootDir>/test/glsl-transformer.cjs',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^shared/(.*)$': '<rootDir>/../shared/$1',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom', 'jest-canvas-mock'],
    modulePathIgnorePatterns: ['<rootDir>/tests/playwright'],
};
