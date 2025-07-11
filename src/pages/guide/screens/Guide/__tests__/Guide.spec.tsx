import { fireEvent, render, screen } from '@testing-library/react';
import Guide from '../Guide';

const mockHistory = {
    push: jest.fn(),
};

const mockLocation = {
    pathname: '/buy-sell',
};

const mockUseBalance = {
    data: { balance: 100 },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockHistory,
    useLocation: () => mockLocation,
}));

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAccountList: jest.fn(() => ({
        data: [
            {
                account_category: 'trading',
                account_type: 'binary',
                broker: 'CR',
                currency: 'USD',
                loginid: 'CR90000383',
            },
        ],
    })),
    useAuthData: jest.fn(() => ({ activeLoginid: null })),
    useBalance: jest.fn(() => mockUseBalance),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('Guide', () => {
    it('should render the Guide component', () => {
        render(<Guide />);
        expect(screen.getByText('Get started with P2P')).toBeInTheDocument();
    });
    it('should navigate back to Buy/Sell page on click of return', () => {
        render(<Guide />);

        const backButton = screen.getByTestId('dt_page_return_btn');
        fireEvent.click(backButton);

        expect(mockHistory.push).toHaveBeenCalled();
    });
});
