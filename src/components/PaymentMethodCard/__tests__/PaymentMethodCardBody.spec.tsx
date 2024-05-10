import { render, screen } from '@testing-library/react';
import { PaymentMethodCardBody } from '../PaymentMethodCardBody';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodCardBody', () => {
    it('should render the component correctly', () => {
        render(
            <PaymentMethodCardBody
                paymentMethod={{
                    display_name: 'Bank Transfer',
                    fields: {
                        account: { display_name: 'Account Number', required: 1, type: 'text', value: 'Account Number' },
                        bank_name: { display_name: 'Bank Transfer', required: 1, type: 'text', value: 'Bank Name' },
                    },
                    id: 'test',
                    is_enabled: 0,
                    method: '',
                    type: 'bank',
                    used_by_adverts: null,
                    used_by_orders: null,
                }}
                shouldShowPaymentMethodDisplayName={false}
            />
        );
        expect(screen.getByText('Account Number')).toBeInTheDocument();
        expect(screen.getByText('Bank Name')).toBeInTheDocument();
    });
});
