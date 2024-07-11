import { TWalletType } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellPaymentSection from '../BuySellPaymentSection';

type TType = 'memo' | 'text';

const mockProps = {
    availablePaymentMethods: [],
    onSelectPaymentMethodCard: jest.fn(),
    selectedPaymentMethodIds: [123],
};

const mockAvailablePaymentMethods = {
    display_name: 'Other',
    fields: {
        account: {
            display_name: 'Account ID / phone number / email',
            required: 0,
            type: 'text' as TType,
        },
        instructions: {
            display_name: 'Instructions',
            required: 0,
            type: 'memo' as TType,
        },
        name: {
            display_name: 'Payment method name',
            required: 1,
            type: 'text' as TType,
        },
    },
    id: '67',
    isAvailable: true,
    type: 'other' as TWalletType,
};
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/components/PaymentMethodForm', () => ({
    PaymentMethodForm: jest.fn(() => <div>PaymentMethodForm</div>),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useModalManager: jest.fn(() => mockUseModalManager),
}));

describe('<BuySellPaymentSection />', () => {
    it('should render the component as expected', () => {
        render(<BuySellPaymentSection {...mockProps} />);
        expect(screen.getByText('Receive payment to')).toBeInTheDocument();
    });
    it('should render the payment method cards when there are available payment methods', async () => {
        render(<BuySellPaymentSection {...mockProps} availablePaymentMethods={[mockAvailablePaymentMethods]} />);
        expect(screen.getByText('Receive payment to')).toBeInTheDocument();
        expect(screen.getByText('You may choose up to 3.')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();
        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        expect(mockProps.onSelectPaymentMethodCard).toHaveBeenCalledWith(67);
    });

    it('should render the PaymentMethodForm modal when the add button is clicked', async () => {
        mockAvailablePaymentMethods.isAvailable = false;
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'PaymentMethodForm');
        render(<BuySellPaymentSection {...mockProps} availablePaymentMethods={[mockAvailablePaymentMethods]} />);

        const addButton = screen.getByTestId('dt_payment_method_add_button');
        await userEvent.click(addButton);
        expect(mockUseModalManager.showModal).toHaveBeenCalledWith('PaymentMethodForm', { shouldStackModals: false });
        expect(screen.getByText('PaymentMethodForm')).toBeInTheDocument();
    });

    it('should hide the background modal when setishidden is passed', async () => {
        const setIsHidden = jest.fn();
        mockAvailablePaymentMethods.isAvailable = false;
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'PaymentMethodForm');
        render(
            <BuySellPaymentSection
                {...mockProps}
                availablePaymentMethods={[mockAvailablePaymentMethods]}
                setIsHidden={setIsHidden}
            />
        );

        const addButton = screen.getByTestId('dt_payment_method_add_button');
        await userEvent.click(addButton);
        expect(mockUseModalManager.showModal).toHaveBeenCalledWith('PaymentMethodForm', { shouldStackModals: false });
        expect(setIsHidden).toHaveBeenCalledWith(true);
    });
});
