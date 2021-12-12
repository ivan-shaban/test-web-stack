const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'dotenv/config'],
    testEnvironment: 'jsdom',
    bail: true,
    clearMocks: true,
    
    moduleNameMapper: {
        // Handle module aliases (this will be automatically configured for you soon)
        '^@/components/(.*)$': '<rootDir>/components/$1',
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async (params) => {
    const config = await createJestConfig(customJestConfig)(params);
    // little hack for nextjs to hoist jest `mock`s
    config.transform['^.+\\.(js|jsx|ts|tsx)$'] = ['babel-jest', { configFile: './jest.babel.config.js' }];

    return config;
};
