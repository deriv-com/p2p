import { ACCOUNT_LIMITS } from '@/constants';
import { render, screen } from '@testing-library/react';
import AccountLimits from '../AccountLimits';

describe('AccountLimits component', () => {
    it('renders correctly', () => {
        render(<AccountLimits />);

        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', ACCOUNT_LIMITS);

        const iconElement = screen.getByRole('img');
        expect(iconElement).toBeInTheDocument();
    });
});
