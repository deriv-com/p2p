const Localize = ({ i18n_default_text, values }) => {
    // Replace placeholders in the default text with actual values
    const localizedText = i18n_default_text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);

    return localizedText || null;
};

const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
});

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: mockFn,
});

const localize = mockFn;

export { Localize, localize, useTranslations };
