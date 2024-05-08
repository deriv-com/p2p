import { render, screen } from '@testing-library/react';
import AppFooter from '../AppFooter';

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(() => ({ currentLang: 'EN' })),
}));

describe('<AppFooter/>', () => {
    it('should render the footer', () => {
        render(<AppFooter />);
        expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    });
});
