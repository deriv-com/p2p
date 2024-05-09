import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SellAdPaymentSelection from '../SellAdPaymentSelection';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/hooks', () => ({
    api: {
        advertiserPaymentMethods: {
            useGet: () => ({
                data: [
                    {
                        display_name: 'Bank Transfer',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: 'Account Number',
                            },
                            bank_name: { display_name: 'Bank Transfer', required: 1, type: 'text', value: 'Bank Name' },
                        },
                        id: '1',
                        is_enabled: 0,
                        method: '',
                        type: 'bank',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                ],
                get: jest.fn(),
            }),
        },
    },
}));

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useIsAdvertiser: jest.fn(() => true),
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/components/PaymentMethodForm', () => ({
    PaymentMethodForm: () => <div>PaymentMethodForm</div>,
}));

const mockProps = {
    onSelectPaymentMethod: jest.fn(),
    selectedPaymentMethodIds: [],
};

describe('SellAdPaymentSelection', () => {
    it('should render the sell ad payment selection component', () => {
        render(<SellAdPaymentSelection {...mockProps} />);
        expect(screen.getByText('Payment method')).toBeInTheDocument();
    });
    it('should render the payment method cards if user already has payment methods', () => {
        render(<SellAdPaymentSelection {...mockProps} />);
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Account Number')).toBeInTheDocument();
        expect(screen.getByText('Bank Name')).toBeInTheDocument();
    });
    it('should handle payment method selection', async () => {
        render(<SellAdPaymentSelection {...mockProps} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(mockProps.onSelectPaymentMethod).toHaveBeenCalledWith(1);
    });
});
