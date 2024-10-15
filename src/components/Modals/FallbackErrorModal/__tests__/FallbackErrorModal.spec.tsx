import { fireEvent, render, screen } from '@testing-library/react';
import FallbackErrorModal from '../FallbackErrorModal';

describe('<FallbackErrorModal />', () => {
    it('should render the fallback error modal', () => {
        render(<FallbackErrorModal />);
        expect(screen.getByText('Sorry for the interruption')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong. Please refresh the page.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should render the fallback error modal with custom error message', () => {
        render(<FallbackErrorModal errorMessage='Custom error message' />);
        expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should call window.location.reload when the refresh button is clicked', () => {
        const mockReload = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: mockReload },
            writable: true,
        });
        render(<FallbackErrorModal />);
        const refreshButton = screen.getByRole('button', { name: 'Refresh' });
        fireEvent.click(refreshButton);
        expect(mockReload).toHaveBeenCalled();
    });
});
