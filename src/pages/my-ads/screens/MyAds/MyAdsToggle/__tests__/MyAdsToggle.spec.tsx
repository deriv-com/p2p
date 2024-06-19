import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsToggle from '../MyAdsToggle';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

const mockProps = {
    isPaused: false,
    onClickToggle: jest.fn(),
};

describe('MyAdsToggle', () => {
    it('should render the MyAdsToggle component', () => {
        render(<MyAdsToggle {...mockProps} />);
        expect(screen.getByText('Hide my ads')).toBeInTheDocument();
        const input: HTMLInputElement = screen.getByRole('checkbox');
        expect(input).not.toBeChecked();
    });
    it('should be on when isPaused is true', () => {
        const newProps = { ...mockProps, isPaused: true };
        render(<MyAdsToggle {...newProps} />);
        const input: HTMLInputElement = screen.getByRole('checkbox');
        expect(input).toBeChecked();
    });
    it('should handle onclick toggle', async () => {
        render(<MyAdsToggle {...mockProps} />);
        const input: HTMLInputElement = screen.getByRole('checkbox');
        await userEvent.click(input);
        expect(mockProps.onClickToggle).toHaveBeenCalled();
    });
});
