// Jest Configuration - AI Data Explainer+

module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'services/**/*.js',
        'utils/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true,
    testTimeout: 10000
};
