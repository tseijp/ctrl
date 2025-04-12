/**
 * Jest configuration for @tsei/ctrl
 */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
        testEnvironment: 'jsdom',
        transform: {
                '^.+\\.tsx?$': ['ts-jest', {}],
        },
        moduleNameMapper: {
                // Handle CSS imports (with CSS modules)
                '\\.css$': 'identity-obj-proxy',
        },
        setupFilesAfterEnv: ['<rootDir>/packages/core/test/utils/setup.ts'],
        collectCoverage: true,
        collectCoverageFrom: [
                'packages/core/src/**/*.{ts,tsx}',
                '!packages/core/src/**/*.d.ts',
                '!**/node_modules/**',
        ],
        coverageThreshold: {
                global: {
                        branches: 80,
                        functions: 80,
                        lines: 80,
                        statements: 80,
                },
        },
        testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
