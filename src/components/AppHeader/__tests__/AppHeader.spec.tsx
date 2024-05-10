import { ReactNode } from 'react';
import { useAuthData } from '@deriv-com/api-hooks';
import { URLUtils } from '@deriv-com/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from '../AppHeader';

const mockUseAuthData = useAuthData as jest.Mock;
jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn(() => ({ activeLoginid: null, logout: jest.fn() })),
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
    it('should render the header', async () => {
        render(<AppHeader />);
        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(window.open).toHaveBeenCalledWith(URLUtils.getOauthURL(), '_self');
    });
    it('should handle the logout functionality if there is an active login id', async () => {
        mockUseAuthData.mockReturnValue({ activeLoginid: '12345', logout: jest.fn() });
        render(<AppHeader />);

        const logoutButton = screen.getByRole('button', { name: 'Logout' });
        const { logout } = mockUseAuthData();
        expect(logoutButton).toBeInTheDocument();

        await userEvent.click(logoutButton);
        expect(logout).toHaveBeenCalled();
    });
});
