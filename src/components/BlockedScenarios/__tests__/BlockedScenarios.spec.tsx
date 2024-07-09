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
        expect(screen.getByText('You are using a demo account')).toBeVisible();
        const button = screen.getByRole('button', { name: 'Switch to real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });

    it('should render the correct message for non-USD account', async () => {
        render(<BlockedScenarios type='nonUSD' />);
        expect(screen.getByText('You have no Real USD account')).toBeVisible();
        const button = screen.getByRole('button', { name: 'Create real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });

    it('should render the correct message for crypto account', async () => {
        render(<BlockedScenarios type='crypto' />);
        expect(screen.getByText('Crypto is not supported for Deriv P2P!')).toBeVisible();
        const button = screen.getByRole('button', { name: 'Switch to real USD account' });
        await userEvent.click(button);
        expect(window.open).toHaveBeenCalledWith('https://app.deriv.com', '_blank');
    });
});
