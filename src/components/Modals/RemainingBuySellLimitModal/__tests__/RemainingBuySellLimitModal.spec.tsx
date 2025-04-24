import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemainingBuySellLimitModal from '../RemainingBuySellLimitModal';

describe('RemainingBuySellLimitModal', () => {
    it('should render the component', () => {
        render(<RemainingBuySellLimitModal isModalOpen={true} onRequestClose={jest.fn()} />);
        expect(screen.getByTestId('dt_remaining_buy_sell_limit_modal')).toBeInTheDocument();
    });
    it('should close the modal on click of OK button', async () => {
        const onRequestClose = jest.fn();

        render(<RemainingBuySellLimitModal isModalOpen={true} onRequestClose={onRequestClose} />);
        const okBtn = screen.getByRole('button', {
            name: 'OK',
        });
        await userEvent.click(okBtn);
        expect(onRequestClose).toBeCalled();
    });
});
