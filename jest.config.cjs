module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.svg$': '<rootDir>/__mocks__/svgReactTransformer.cjs',
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@/assets/(.*)\\.svg\\?react$': '<rootDir>/__mocks__/svgReactTransformer.cjs',
        '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '@deriv-com/ui': '<rootDir>/__mocks__/fileMock.js',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui|@sendbird/chat)).+\\.js$'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
