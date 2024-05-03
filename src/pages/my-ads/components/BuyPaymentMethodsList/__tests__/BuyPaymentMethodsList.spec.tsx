import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuyPaymentMethodsList from '../BuyPaymentMethodsList';

const mockProps = {
    list: [
        {
            text: 'Bank Transfer',
            value: 'bank_transfer',
        },
    ],
    onSelectPaymentMethod: jest.fn(),
};

describe('BuyPaymentMethodsList', () => {
    it('should render the buy payment methods list component', () => {
        render(<BuyPaymentMethodsList {...mockProps} />);
        expect(screen.getByTestId('dt_buy_payment_methods_list')).toBeInTheDocument();
    });
    it('should call onSelectPaymentMethod when clicking on the payment method', async () => {
        render(<BuyPaymentMethodsList {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_buy_payment_methods_list'));
        await userEvent.click(screen.getByText('Bank Transfer'));
        expect(mockProps.onSelectPaymentMethod).toHaveBeenCalledWith('bank_transfer');
    });
});
