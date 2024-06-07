import { mockAdvertValues } from '@/__mocks__/mock-data';
import { floatingPointValidator } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellForm from '../BuySellForm';

type TNumber = 0 | 1;

const mockAdvertiserPaymentMethods = {
    data: [
        {
            display_name: 'alipay',
            fields: {
                account: {
                    display_name: 'Alipay ID',
                    required: 1,
                    type: 'text' as 'memo' | 'text',
                    value: '12345',
                },
                instructions: {
                    display_name: 'Instructions',
                    required: 0,
                    type: 'memo' as 'memo' | 'text',
                    value: 'Alipay instructions',
                },
            },
            id: '1',
            is_enabled: 1 as TNumber,
            method: 'alipay',
            type: 'ewallet' as 'bank' | 'ewallet' | 'other',
            used_by_adverts: ['1'],
            used_by_orders: ['1'],
        },
    ],
    get: jest.fn(),
};

const mockPaymentMethods = [
    {
        display_name: 'alipay',
        fields: {
            account: {
                display_name: 'Alipay ID',
                required: 1,
                type: 'text' as 'memo' | 'text',
                value: '12345',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo' as 'memo' | 'text',
                value: 'Alipay instructions',
            },
        },
        id: '1',
        type: 'ewallet' as 'bank' | 'ewallet' | 'other',
    },
];

const mockUseGetInfo = {
    data: {
        balance_available: 100,
        daily_buy: 0,
        daily_buy_limit: 0,
        daily_sell: 0,
        daily_sell_limit: 0,
    },
};

type TUseCreateData = {
    id?: string;
};

const mockUseCreate = {
    data: undefined as TUseCreateData | undefined,
    isSuccess: false,
    mutate: jest.fn(),
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks', () => ({
    api: {
        advert: {
            useGet: jest.fn(() => ({
                data: mockAdvertValues,
            })),
        },
        advertiser: {
            useGetInfo: jest.fn(() => mockUseGetInfo),
        },
        advertiserPaymentMethods: {
            useGet: jest.fn(() => mockAdvertiserPaymentMethods),
        },
        order: {
            useCreate: jest.fn(() => mockUseCreate),
        },
        paymentMethods: {
            useGet: jest.fn(() => ({
                data: mockPaymentMethods,
            })),
        },
    },
    useIsAdvertiser: jest.fn(() => true),
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiser: jest.fn(() => true),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useExchangeRates: jest.fn(() => ({
        subscribeRates: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;
const mockOnChange = jest.fn();
const mockHandleSubmit = jest.fn();

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({
        control,
        defaultValue,
        name,
        render,
    }: {
        control: string;
        defaultValue: object;
        name: string;
        render: (param: object) => void;
    }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: mockOnChange, value: defaultValue },
            fieldState: { error: null },
        }),
    useForm: () => ({
        control: 'mockedControl',
        formState: { isValid: true },
        getValues: jest.fn(() => ({
            amount: 1,
        })),
        handleSubmit: mockHandleSubmit,
        setValue: jest.fn(),
        trigger: jest.fn(),
    }),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockPush }),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    floatingPointValidator: jest.fn(() => false),
}));
const mockFloatingPointValidator = floatingPointValidator as jest.Mock;

const mockProps = {
    advertId: '236',
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('BuySellForm', () => {
    it('should render the form as expected', () => {
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it('should render the inline message when rate type is float', () => {
        render(<BuySellForm {...mockProps} />);
        expect(
            screen.getByText(
                'If the market rate changes from the rate shown here, we won’t be able to process your order.'
            )
        ).toBeInTheDocument();
    });
    it('should render the form as expected in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it("should handle onsubmit when form is submitted and it's valid", async () => {
        mockUseDevice.mockReturnValue({
            isMobile: false,
        });
        render(<BuySellForm {...mockProps} />);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });
    it('should disable the input field when balance is 0', () => {
        mockUseGetInfo.data.balance_available = 0;
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        expect(inputField).toBeDisabled();
    });
    it('should check if the floating point validator is called on changing value in input field', async () => {
        mockUseGetInfo.data.balance_available = 100;
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        await userEvent.type(inputField, '1');
        expect(mockFloatingPointValidator).toHaveBeenCalled();
    });
    it('should render the advertiserSellLimit as max limit if buy limit < max order amount limit', () => {
        mockAdvertValues.max_order_amount_limit_display = '10';
        mockAdvertValues.type = 'buy';
        mockUseGetInfo.data.daily_buy_limit = 5;
        mockUseGetInfo.data.daily_buy = 0;

        render(<BuySellForm {...mockProps} />);

        expect(screen.getByText('Limit: 1.00-5.00 USD')).toBeInTheDocument();
    });
    it('should return the advertiserBuyLimit as max limit if sell limit < max order amount limit and sell order', () => {
        mockAdvertValues.type = 'sell';
        mockUseGetInfo.data.daily_sell_limit = 5;
        mockUseGetInfo.data.daily_sell = 0;

        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Limit: 1.00-5.00 USD')).toBeInTheDocument();
    });
    it('should call onchange when input field value is changed', async () => {
        mockFloatingPointValidator.mockReturnValue(true);
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        await userEvent.type(inputField, '1');
        expect(mockOnChange).toHaveBeenCalled();
    });
    it('should render the bank details text area when sell order and no payment methods are there', () => {
        mockAdvertValues.payment_method_names = [];
        mockAdvertValues.type = 'buy';

        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Your bank details')).toBeInTheDocument();
    });
    it('should render the contact details text area when sell order and payment methods are there', () => {
        mockAdvertValues.payment_method_names = ['alipay'];

        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Your contact details')).toBeInTheDocument();
    });
    it('should send the payment_method_ids when payment methods are selected and sell order', async () => {
        render(<BuySellForm {...mockProps} />);
        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);
        expect(mockUseCreate.mutate).toHaveBeenCalledWith(expect.objectContaining({ payment_method_ids: [1] }));
    });

    it('should call history.push and onRequestClose if order has been created successfully', async () => {
        mockUseCreate.isSuccess = true;
        mockUseCreate.data = { id: '1' };

        render(<BuySellForm {...mockProps} />);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);

        expect(mockPush).toHaveBeenCalledWith('/orders/1', { from: 'BuySell' });
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
});
