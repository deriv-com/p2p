import { useSyncedTime } from '@/hooks';
import { epochToLocal, epochToUTC } from '@/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServerTime from '../ServerTime';

jest.mock('@/hooks', () => ({
    useSyncedTime: jest.fn(),
}));

jest.mock('@/utils', () => ({
    epochToLocal: jest.fn(),
    epochToUTC: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(), // Deprecated
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(), // Deprecated
    })),
    writable: true,
});

describe('ServerTime component', () => {
    const mockTime = 1625074800; // Example epoch time
    const mockUTCFormat = '2021-06-30 14:00 GMT';
    const mockLocalFormat = '2021-06-30 16:00 +0200';

    beforeEach(() => {
        (useSyncedTime as jest.Mock).mockReturnValue(mockTime);
        (epochToUTC as jest.Mock).mockReturnValue(mockUTCFormat);
        (epochToLocal as jest.Mock).mockReturnValue(mockLocalFormat);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the server time with UTC and local formats', async () => {
        render(<ServerTime />);

        await userEvent.hover(screen.getByTestId('dt_server_time'));

        expect(screen.getByText(mockLocalFormat)).toBeInTheDocument();
        expect(screen.getByText(mockUTCFormat)).toBeInTheDocument();
    });
});
