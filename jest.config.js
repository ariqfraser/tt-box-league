module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    testEnvironment: 'jsdom',
    coveragePathIgnorePatterns: ['/node_modules/'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/main.ts',
        '!src/index.html',
        '!src/**/*.{config,routes}.ts',
    ],
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@env/(.*)': '<rootDir>/src/environments/$1',
        '@public/(.*)': '<rootDir>/public/$1',
        '@shared/(.*)': '<rootDir>/src/app/shared/$1',
        '@core/(.*)': '<rootDir>/src/app/core/$1',
        '@features/(.*)': '<rootDir>/src/app/features/$1',
    },
};
