import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockedScenarios from '../BlockedScenarios';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isDesktop: true }),
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
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });

    it('should render the correct message for non-USD account', async () => {
        render(<BlockedScenarios type='nonUSD' />);
        expect(screen.getByText('You have no Real USD account')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Create real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });

    it('should render the correct message for crypto account', async () => {
        render(<BlockedScenarios type='crypto' />);
        expect(screen.getByText('Crypto is not supported for Deriv P2P!')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: 'Switch to real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });

    it('should show the correct message for p2p is blocked for user', () => {
        render(<BlockedScenarios type='p2pBlocked' />);
        expect(screen.getByText('Your Deriv P2P cashier is blocked')).toBeInTheDocument();
        expect(
            screen.getByText('Please use live chat to contact our Customer Support team for help.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Live chat' })).toBeInTheDocument();
    });

    it('should show the correct message for cashier locked account', () => {
        render(<BlockedScenarios type='cashierLocked' />);
        expect(screen.getByText('Cashier is locked')).toBeInTheDocument();
        expect(
            screen.getByText('Your cashier is currently locked. Please contact us via live chat to find out why.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Live chat' })).toBeInTheDocument();
    });

    it('should show the correct message when cashier is under maintenance', () => {
        render(<BlockedScenarios type='systemMaintenance' />);
        expect(screen.getByText('Cashier is currently down for maintenance')).toBeInTheDocument();
        expect(screen.getByText('Please check back in a few minutes.')).toBeInTheDocument();
        expect(screen.getByText('Thank you for your patience.')).toBeInTheDocument();
    });
});
