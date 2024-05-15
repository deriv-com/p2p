const Localize = ({ i18n_default_text, values }) => {
    // Replace placeholders in the default text with actual values
    const localizedText = i18n_default_text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);

    return localizedText || null;
};

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: jest.fn(text => text),
});

export { Localize, useTranslations };
