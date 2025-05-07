import { render, screen } from '@testing-library/react';
import AccountLimits from '../AccountLimits';

const mockUseShouldRedirectToLowCodeHub = 'https://app.deriv.com/account/account-limits?platform=p2p-v2';

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useShouldRedirectToLowCodeHub: jest.fn(() => mockUseShouldRedirectToLowCodeHub),
}));

describe('AccountLimits component', () => {
    it('renders correctly', () => {
        render(<AccountLimits />);

        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', 'https://app.deriv.com/account/account-limits?platform=p2p-v2');

        const iconElement = screen.getByRole('img');
        expect(iconElement).toBeInTheDocument();
    });
});
