import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page404 from '../Page404';

const mockFn = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        replace: mockFn,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

describe('Page404', () => {
    it('should render the component as expected', async () => {
        render(<Page404 />);
        const returnHomeButton = screen.getByRole('button', { name: 'Return to Home' });
        expect(returnHomeButton).toBeInTheDocument();
        expect(screen.getByText('We couldn’t find that page')).toBeInTheDocument();
        expect(
            screen.getByText('You may have followed a broken link, or the page has moved to a new address.')
        ).toBeInTheDocument();
    });

    it('should handle button click', async () => {
        render(<Page404 />);
        const returnHomeButton = screen.getByRole('button', { name: 'Return to Home' });
        await userEvent.click(returnHomeButton);
        expect(mockFn).toHaveBeenCalledWith({ pathname: '/buy-sell', search: '' });
    });
});
