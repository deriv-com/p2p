module.exports = {
    moduleNameMapper: {
        '@deriv-com/translations': '<rootDir>/__mocks__/LocalizeMock.js',
        // eslint-disable-next-line sort-keys
        '@deriv-com/(.*)': '<rootDir>/node_modules/@deriv-com/$1',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.png': '<rootDir>/__mocks__/fileMock.js',
        '\\.svg': '<rootDir>/__mocks__/svgMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['useModalManager.spec.tsx'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/translations|@deriv-com/ui|@sendbird/chat)).+\\.js$'],
};
