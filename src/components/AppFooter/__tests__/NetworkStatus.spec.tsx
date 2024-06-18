import { useNetworkStatus } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NetworkStatus from '../NetworkStatus';

jest.mock('@/hooks', () => ({
    useNetworkStatus: jest.fn(),
}));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(),
}));

describe('NetworkStatus component', () => {
    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            localize: jest.fn((_, { status }) => `Network status: ${status}`),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with online status', async () => {
        (useNetworkStatus as jest.Mock).mockReturnValue('online');

        render(<NetworkStatus />);
        await userEvent.hover(screen.getByTestId('dt_network_status'));

        expect(screen.getByText('Network status: Online')).toBeInTheDocument();
        expect(screen.getByTestId('dt_circle')).toHaveClass('app-footer__network-status-online');
    });

    it('renders with offline status', async () => {
        (useNetworkStatus as jest.Mock).mockReturnValue('offline');

        render(<NetworkStatus />);
        await userEvent.hover(screen.getByTestId('dt_network_status'));

        expect(screen.getByText('Network status: Offline')).toBeInTheDocument();
        expect(screen.getByTestId('dt_circle')).toHaveClass('app-footer__network-status-offline');
    });

    it('renders with blinking status', async () => {
        (useNetworkStatus as jest.Mock).mockReturnValue('blinking');

        render(<NetworkStatus />);
        await userEvent.hover(screen.getByTestId('dt_network_status'));

        expect(screen.getByText('Network status: Connecting to server')).toBeInTheDocument();
        expect(screen.getByTestId('dt_circle')).toHaveClass('app-footer__network-status-blinking');
        expect(screen.getByTestId('dt_circle')).toHaveClass('app-footer__network-status-online');
    });
});
