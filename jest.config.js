/**
 * cmd by: `npx ts-jest config:init`
 */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
        testEnvironment: 'node',
        transform: {
                '^.+.tsx?$': ['ts-jest', {}],
        },
}
