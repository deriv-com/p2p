import { useTranslations } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSettings from '../LanguageSettings';

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(),
}));

describe('LanguageSettings component', () => {
    const openLanguageSettingModal = jest.fn();
    const currentLang = 'EN';

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang,
            localize: jest.fn().mockReturnValue('Language'),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the language settings button with icon, tooltip, and current language', () => {
        render(<LanguageSettings openLanguageSettingModal={openLanguageSettingModal} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText(currentLang)).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('calls openLanguageSettingModal when the button is clicked', async () => {
        render(<LanguageSettings openLanguageSettingModal={openLanguageSettingModal} />);
        await userEvent.click(screen.getByRole('button'));
        expect(openLanguageSettingModal).toHaveBeenCalledTimes(1);
    });
});
