import { mockAdvertValues } from '@/__mocks__/mock-data';
import { api } from '@/hooks';
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
    error: undefined as { code: string; message: string } | undefined,
    isError: false,
    isSuccess: false,
    mutate: jest.fn(),
    reset: jest.fn(),
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

const mockAdvertInfo = {
    data: mockAdvertValues,
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
};

const mockInvalidate = jest.fn();

jest.mock('@/hooks/api/useInvalidateQuery', () => () => mockInvalidate);

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advert: {
            useSubscribe: jest.fn(() => mockAdvertInfo),
        },
        advertiser: {
            useGetInfo: jest.fn(() => mockUseGetInfo),
        },
        advertiserPaymentMethods: {
            useGet: jest.fn(() => mockAdvertiserPaymentMethods),
        },
        exchangeRates: {
            useGet: jest.fn(() => ({
                exchangeRate: 1,
            })),
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
}));

const mockUseExchangeRates = api.exchangeRates.useGet as jest.Mock;

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiser: jest.fn(() => true),
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
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
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render the form as expected', () => {
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it('should render the form as expected in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
        });
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it("should handle onsubmit when form is submitted and it's valid", async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
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
    it('should show error modal when counterparty changes the rate', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');
        const { rerender } = render(<BuySellForm {...mockProps} />);
        mockAdvertInfo.data.rate = 0.1;

        rerender(<BuySellForm {...mockProps} />);

        expect(screen.getByText('The advertiser changed the rate before you confirmed the order.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });
    it('should hide the error modal when user clicks Try again', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');
        const { rerender } = render(<BuySellForm {...mockProps} />);
        mockAdvertInfo.data.rate = 0.2;
        rerender(<BuySellForm {...mockProps} />);

        const tryAgainButton = screen.getByRole('button', { name: 'Try again' });
        await userEvent.click(tryAgainButton);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(
            screen.queryByText('The advertiser changed the rate before you confirmed the order.')
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    });
    it('should call showModal when exchange rate changes and user clicks Confirm', async () => {
        mockAdvertValues.type = 'sell';
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'TestModal');
        const { rerender } = render(<BuySellForm {...mockProps} />);
        mockUseExchangeRates.mockReturnValue({
            exchangeRate: 0.1,
        });
        rerender(<BuySellForm {...mockProps} />);

        const confirmButton = screen.queryAllByRole('button', { name: 'Confirm' })[0];
        await userEvent.click(confirmButton);

        expect(mockModalManager.showModal).toHaveBeenCalledWith('RateFluctuationModal', { shouldStackModals: false });
    });
    it('should show RateFluctuationModal when exchange rate changes and user clicks Confirm', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'RateFluctuationModal');
        const { rerender } = render(<BuySellForm {...mockProps} />);
        mockUseExchangeRates.mockReturnValue({
            exchangeRate: 0.2,
        });
        rerender(<BuySellForm {...mockProps} />);

        expect(screen.getByText('Attention: Rate fluctuation')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue with order' })).toBeInTheDocument();
    });
    it('should call hideModal when the user clicks on Cancel in RateFluctuationModal', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'RateFluctuationModal');
        render(<BuySellForm {...mockProps} />);

        const cancelButton = screen.queryAllByRole('button', { name: 'Cancel' })[1];
        await userEvent.click(cancelButton);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
    });
    it('should show slippage rate error if code returned from p2p_order_create is OrderCreateFailRateSlippage', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');
        mockUseCreate.error = { code: 'OrderCreateFailRateSlippage', message: 'Order slippage error' };
        mockUseCreate.isError = true;
        render(<BuySellForm {...mockProps} />);

        expect(screen.getByText('Order slippage error')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create new order' })).toBeInTheDocument();
    });
    it('should call hideModal and reset when user clicks on Create new order button in ErrorModal', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');
        mockUseCreate.error = { code: 'OrderCreateFailRateSlippage', message: 'Order slippage error' };
        mockUseCreate.isError = true;
        render(<BuySellForm {...mockProps} />);

        const createNewOrderButton = screen.getByRole('button', { name: 'Create new order' });
        await userEvent.click(createNewOrderButton);

        expect(mockModalManager.hideModal).toHaveBeenCalledWith({ shouldHidePreviousModals: true });
        expect(mockUseCreate.reset).toHaveBeenCalled();
    });
    it('should call hideModal if error is returned from p2p_order_create that isn’t slippage rate error and RateFluctuationModal is open', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'RateFluctuationModal');
        mockUseCreate.error = { code: 'OrderAlreadyExists', message: 'order already exists' };
        render(<BuySellForm {...mockProps} />);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
    });
});
