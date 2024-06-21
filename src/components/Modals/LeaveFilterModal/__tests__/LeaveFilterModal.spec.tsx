import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeaveFilterModal from '../LeaveFilterModal';

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('LeaveFilterModal', () => {
    it('should render the modal as expected', () => {
        render(<LeaveFilterModal {...mockProps} />);
        expect(screen.getByText('Leave page?')).toBeInTheDocument();
    });

    it('should call onRequestClose with false when cancel button is clicked', async () => {
        render(<LeaveFilterModal {...mockProps} />);
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(mockProps.onRequestClose).toHaveBeenCalledWith(false);
    });

    it('should call onRequestClose with true when leave page button is clicked', async () => {
        render(<LeaveFilterModal {...mockProps} />);
        await userEvent.click(screen.getByRole('button', { name: 'Leave page' }));
        expect(mockProps.onRequestClose).toHaveBeenCalledWith(true);
    });
});
