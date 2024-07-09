module.exports = {
    extends: ['@deriv-com/eslint-config-deriv', 'eslint:recommended', 'plugin:react/recommended'],
    plugins: ['simple-import-sort', 'sort-destructure-keys', 'typescript-sort-keys'],
    rules: {
        'global-require': 'off',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/sort-type-constituents': 'error',
        camelcase: 'error',
        'import/newline-after-import': 'error',
        'react/jsx-sort-props': 'error',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    [
                        'public-path',
                        // `react` first, then packages starting with a character
                        '^react$',
                        '^[a-z]',
                        // Packages starting with `@`
                        '^@',
                        // Imports starting with `../`
                        '^\\.\\.(?!/?$)',
                        '^\\.\\./?$',
                        // Imports starting with `./`
                        '^\\./(?=.*/)(?!/?$)',
                        '^\\.(?!/?$)',
                        '^\\./?$',
                        // Style imports
                        '^.+\\.s?css$',
                        // Side effect imports
                        '^\\u0000',
                        // Delete the empty line copied as the next line of the last import
                        '\\s*',
                    ],
                ],
            },
        ],
        'sort-destructure-keys/sort-destructure-keys': 'error',
        'sort-keys': 'error',
        'typescript-sort-keys/interface': 'error',
        'typescript-sort-keys/string-enum': 'error',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react/prop-types': 'off',
                'react/react-in-jsx-scope': 'off',
                'react/jsx-uses-react': 'off',
            },
        },
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            excludedFiles: '**/integration-tests/**/*.[jt]s?(x)',
            extends: ['plugin:testing-library/react'],
        },
        {
            files: ['*.{ts,tsx}'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: [
                'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
                'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'plugin:react/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
                'plugin:react/jsx-runtime',
            ],
            parserOptions: {
                ecmaversion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-export-namespace-from',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                    ],
                },
            },
        },
        {
            files: ['**/hooks/api/**/*.{js,jsx,ts,tsx}'],
            rules: {
                camelcase: 'off', // Disable camelcase rule for files under 'hooks/api' folder
            },
        },
    ],
};
