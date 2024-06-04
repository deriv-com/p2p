import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorModal from '../ErrorModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockProps = {
    isModalOpen: true,
    message: 'error message',
    onRequestClose: jest.fn(),
};

describe('ErrorModal', () => {
    it('should render the component as expected', () => {
        render(<ErrorModal {...mockProps} />);
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
    });
    it('should call onRequestClose when the close button is clicked', async () => {
        render(<ErrorModal {...mockProps} />);
        await userEvent.click(screen.getByRole('button', { name: 'OK' }));
        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
    });
    it('should not render the title when showTitle is false', () => {
        render(<ErrorModal {...mockProps} showTitle={false} title='test title' />);
        expect(screen.queryByText('test title')).not.toBeInTheDocument();
    });
});
