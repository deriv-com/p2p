module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/__mocks__/svgReactTransformer.cjs',
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '@deriv-com/(.*)': '<rootDir>/node_modules/@deriv-com/$1',
        '^@/assets/(.*)\\.svg\\?react$': '<rootDir>/__mocks__/svgReactTransformer.cjs',
        '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui|@sendbird/chat)).+\\.js$'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
