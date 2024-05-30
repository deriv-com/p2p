import { useFullScreen } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullScreen from '../FullScreen';

jest.mock('@/hooks', () => ({
    useFullScreen: jest.fn(),
}));

describe('FullScreen component', () => {
    const toggleFullScreenMode = jest.fn();

    beforeEach(() => {
        (useFullScreen as jest.Mock).mockReturnValue({
            toggleFullScreenMode,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the full screen button with icon and tooltip', () => {
        render(<FullScreen />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('calls toggleFullScreenMode when the button is clicked', async () => {
        render(<FullScreen />);
        await userEvent.click(screen.getByRole('button'));
        expect(toggleFullScreenMode).toHaveBeenCalledTimes(1);
    });
});
