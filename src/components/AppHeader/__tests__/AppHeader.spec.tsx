import { ReactNode } from 'react';
// import { useAuthData } from '@deriv-com/api-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from '../AppHeader';

// const mockUseAuthData = useAuthData as jest.Mock;
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
    useAuthData: jest.fn(() => ({ activeLoginid: null, logout: jest.fn() })),
    useBalance: jest.fn(() => ({
        data: {
            balance: {
                accounts: {
                    CR90000383: {
                        balance: 10302,
                        converted_amount: 10302,
                        currency: 'USD',
                        demo_account: 0,
                        status: 1,
                        type: 'deriv',
                    },
                    VRTC90000221: {
                        balance: 10000,
                        converted_amount: 10000,
                        currency: 'USD',
                        demo_account: 1,
                        status: 1,
                        type: 'deriv',
                    },
                },
                balance: 10302,
                currency: 'USD',
                loginid: 'CR90000383',
                total: {
                    deriv: {
                        amount: 10302,
                        currency: 'USD',
                    },
                    deriv_demo: {
                        amount: 10000,
                        currency: 'USD',
                    },
                    mt5: {
                        amount: 0,
                        currency: 'USD',
                    },
                    mt5_demo: {
                        amount: 0,
                        currency: 'USD',
                    },
                },
            },
        },
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Button: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('<AppHeader/>', () => {
    window.open = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header and handle login when there are no P2P accounts', async () => {
        render(<AppHeader />);
        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(window.open).toHaveBeenCalledWith(expect.any(String), '_self');
    });

    // it('should render the desktop header and manage account actions when logged in', async () => {
    //     mockUseAuthData.mockReturnValue({ activeLoginid: '12345', logout: jest.fn() });

    //     render(<AppHeader />);
    //     const logoutButton = screen.getByRole('button', { name: 'Logout' });
    //     const { logout } = mockUseAuthData();
    //     expect(logoutButton).toBeInTheDocument();

    //     await userEvent.click(logoutButton);
    //     expect(logout).toHaveBeenCalled();
    // });
});
