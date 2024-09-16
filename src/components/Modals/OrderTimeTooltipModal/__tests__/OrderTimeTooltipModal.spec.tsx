import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTimeTooltipModal from '../OrderTimeTooltipModal';

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('<RatingModal />', () => {
    it('should render just the star rating initially', () => {
        render(<OrderTimeTooltipModal {...mockProps} />);
        expect(screen.getByText('Orders will expire if they aren’t completed within this time.')).toBeInTheDocument();
    });
    it('should handle the onclick for ok button', async () => {
        render(<OrderTimeTooltipModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: 'OK' });
        await userEvent.click(okButton);
        expect(mockProps.onRequestClose).toBeCalledTimes(1);
    });
});
