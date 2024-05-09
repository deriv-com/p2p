import { render, screen } from '@testing-library/react';
import AppFooter from '../AppFooter';

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(() => ({ currentLang: 'EN' })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('<AppFooter/>', () => {
    it('should render the footer', () => {
        render(<AppFooter />);
        expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    });
});
