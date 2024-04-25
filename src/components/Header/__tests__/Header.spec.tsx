import { ReactNode } from 'react';
import { useAuthData } from '@deriv-com/api-hooks';
import { URLUtils } from '@deriv-com/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

const mockUseAuthData = useAuthData as jest.Mock;
jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn(() => ({ activeLoginid: null, logout: jest.fn() })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Button: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

describe('<Header/>', () => {
    it('should render the header', () => {
        render(<Header />);
        expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', URLUtils.getOauthURL());
    });
    it('should handle the logout functionality if there is an active login id', async () => {
        mockUseAuthData.mockReturnValue({ activeLoginid: '12345', logout: jest.fn() });
        render(<Header />);

        const logoutButton = screen.getByRole('button', { name: 'Logout' });
        const { logout } = mockUseAuthData();
        expect(logoutButton).toBeInTheDocument();

        await userEvent.click(logoutButton);
        expect(logout).toHaveBeenCalled();
    });
});
