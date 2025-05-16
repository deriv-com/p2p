import { useActiveAccount } from '@/hooks/api/account';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockedScenarios from '../BlockedScenarios';

jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn(() => ({ activeLoginid: null })),
}));
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isDesktop: true }),
}));
const mockUseActiveAccountValues = {
    data: undefined,
} as ReturnType<typeof useActiveAccount>;

const mockUseShouldRedirectToLowCodeHub = 'https://app.deriv.com';
jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useShouldRedirectToLowCodeHub: jest.fn(() => mockUseShouldRedirectToLowCodeHub),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                ...mockUseActiveAccountValues,
            })),
        },
    },
}));

Object.defineProperty(window, 'open', {
    value: jest.fn(),
});

describe('BlockedScenarios', () => {
    it('should render the correct message for demo account', async () => {
        render(<BlockedScenarios type='demo' />);
        expect(screen.getByText('You are using a demo account')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Switch to real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith(mockUseShouldRedirectToLowCodeHub);
    });

    it('should render the correct message for non-USD account', async () => {
        render(<BlockedScenarios type='nonUSD' />);
        expect(screen.getByText('You have no Real USD account')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Live chat' })).toBeInTheDocument();
    });

    it('should render the correct message for crypto account', async () => {
        render(<BlockedScenarios type='crypto' />);
        expect(screen.getByText('Cryptocurrencies not supported')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Add real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith(mockUseShouldRedirectToLowCodeHub);
    });

    it('should show the correct message for p2p is blocked for user', () => {
        render(<BlockedScenarios type='p2pBlocked' />);
        expect(screen.getByText('Your Deriv P2P cashier is blocked')).toBeInTheDocument();
        expect(
            screen.getByText('Please use live chat to contact our Customer Support team for help.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Live chat' })).toBeInTheDocument();
    });

    it('should show the correct message when cashier is under maintenance', () => {
        render(<BlockedScenarios type='systemMaintenance' />);
        expect(screen.getByText('Cashier is currently down for maintenance')).toBeInTheDocument();
        expect(screen.getByText('Please check back in a few minutes.')).toBeInTheDocument();
        expect(screen.getByText('Thank you for your patience.')).toBeInTheDocument();
    });

    it('should show the correct message when user logs in from restricted country', () => {
        render(<BlockedScenarios type='RestrictedCountry' />);
        expect(screen.getByText('Deriv P2P unavailable')).toBeInTheDocument();
        expect(screen.getByText('This service is currently not offered in your country.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Go to Trader's Hub" })).toBeInTheDocument();
    });

    it('should show the correct message when user has p2p blocked for pa', () => {
        render(<BlockedScenarios type='p2pBlockedForPa' />);
        expect(screen.getByText('Your Deriv P2P cashier is blocked')).toBeInTheDocument();
        expect(
            screen.getByText('P2P transactions are locked. This feature is not available for payment agents.')
        ).toBeInTheDocument();
    });
});
