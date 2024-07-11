const Localize = ({ i18nDefaultText, values }) => {
    // Replace placeholders in the default text with actual values
    const localizedText = i18nDefaultText.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);

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
