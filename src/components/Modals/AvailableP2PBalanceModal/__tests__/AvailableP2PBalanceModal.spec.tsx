import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AvailableP2PBalanceModal from '../AvailableP2PBalanceModal';

const mockOnRequestClose = jest.fn();

const MockApp = () => {
    return (
        <>
            <AvailableP2PBalanceModal isModalOpen={true} onRequestClose={mockOnRequestClose} />
        </>
    );
};

describe('AvailableP2PBalanceModal', () => {
    it('should render with correct message', () => {
        render(<MockApp />);
        expect(screen.getByTestId('dt_available_p2p_balance_modal')).toBeInTheDocument();
    });
    it('should perform callback to onRequestClose when OK button is clicked', async () => {
        render(<MockApp />);
        const okBtn = screen.getByRole('button', {
            name: 'OK',
        });
        await userEvent.click(okBtn);
        expect(mockOnRequestClose).toBeCalled();
    });
});
