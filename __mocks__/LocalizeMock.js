const Localize = ({ i18n_default_text: i18Text, values }) => {
    // Replace placeholders in the default text with actual values
    const localizedText = i18Text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);

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
const getAllowedLanguages = jest.fn(() => ({ EN: 'English' }));

export { getAllowedLanguages, Localize, localize, useTranslations };
