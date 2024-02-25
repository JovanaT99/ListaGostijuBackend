/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transformIgnorePattern: ['<rootDir>/node_modules/(?!axios)/'],
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
    setupFilesAfterEnv: ['./tests/setup.ts'],
    testMatch: ['<rootDir>/tests/api/**/*.ts'],
    modulePathIgnorePatterns: ['<rootDir>/tests/data'],
}
