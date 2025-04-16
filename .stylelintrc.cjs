module.exports = {
    plugins: ['stylelint-no-unsupported-browser-features'],
    rules: {
        'color-named': 'never',
        'color-no-invalid-hex': true,
        'shorthand-property-no-redundant-values': true,
        'scss/at-rule-no-unknown': null,
        'scss/dollar-variable-pattern': null,
        'selector-class-pattern': null,
        'scss/double-slash-comment-whitespace-inside': null,
        'scss/at-mixin-pattern': null,
        'no-descending-specificity': null,
    },
    extends: [
        // other configs ...
        'stylelint-config-standard-scss',
    ],
    ignoreFiles: ['packages/*/dist/**/*.css'],
};
