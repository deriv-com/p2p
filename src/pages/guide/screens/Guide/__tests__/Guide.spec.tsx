import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Guide from '../Guide';

const mockHistory = {
    push: jest.fn(),
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockHistory,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('Guide', () => {
    it('should render the Guide component', () => {
        render(<Guide />);
        expect(screen.getByText('Get started with P2P')).toBeInTheDocument();
    });
    it('should navigate back to Buy/Sell page on click of return', async () => {
        render(<Guide />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);

        expect(mockHistory.push).toHaveBeenCalledWith('/buy-sell');
    });
});
