import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockUserCountModal from '../BlockUserCountModal';

const mockProps = {
    isModalOpen: true,
    message: 'test',
    onRequestClose: jest.fn(),
};

describe('BlockUserCountModal', () => {
    it('should render the modal component as expected', () => {
        render(<BlockUserCountModal {...mockProps} />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });
    it('should handle the onclick event for the ok button', async () => {
        render(<BlockUserCountModal {...mockProps} />);
        await userEvent.click(screen.getByText('Ok'));
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
});
