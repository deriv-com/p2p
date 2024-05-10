import { TWalletType } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodCard from '../PaymentMethodCard';

const mockProps = {
    isEditable: false,
    medium: false,
    onClickAdd: jest.fn(),
    onDeletePaymentMethod: jest.fn(),
    onEditPaymentMethod: jest.fn(),
    onSelectPaymentMethodCard: jest.fn(),
    paymentMethod: {
        display_name: 'bank',
        fields: {},
        id: 'test',
        is_enabled: 0 as 0 | 1,
        method: '',
        type: 'other' as TWalletType,
        used_by_adverts: null,
        used_by_orders: null,
    },
    shouldShowPaymentMethodDisplayName: false,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodCard', () => {
    it('should render the component correctly', () => {
        render(<PaymentMethodCard {...mockProps} />);
        expect(screen.getByTestId('dt_payment_method_card_header')).toBeInTheDocument();
    });

    it('should handle the onClickAdd', async () => {
        const newProps = {
            ...mockProps,
            paymentMethod: {
                ...mockProps.paymentMethod,
                isAvailable: false,
            },
        };

        render(<PaymentMethodCard {...newProps} />);
        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(mockProps.onClickAdd).toHaveBeenCalled();
    });
    it('should handle the selection of checkbox', async () => {
        const newProps = {
            ...mockProps,
            paymentMethod: {
                ...mockProps.paymentMethod,
                isAvailable: true,
            },
        };
        render(<PaymentMethodCard {...newProps} />);
        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        expect(mockProps.onSelectPaymentMethodCard).toHaveBeenCalled();
    });
});
