import { TAdvertType } from 'types';
import { floatingPointValidator } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellForm from '../BuySellForm';

const mockMutateFn = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    p2p: {
        order: {
            useCreate: jest.fn(() => ({
                mutate: mockMutateFn,
            })),
        },
    },
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
    }),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    floatingPointValidator: jest.fn(() => false),
}));
const mockFloatingPointValidator = floatingPointValidator as jest.Mock;

type TNumber = 0 | 1;

const mockAdvertValues = {
    account_currency: 'USD',
    advertiser_details: {
        completed_orders_count: 0,
        id: '96',
        is_blocked: 0 as TNumber,
        is_favourite: 0 as TNumber,
        is_online: 1 as TNumber,
        is_recommended: 0 as TNumber,
        last_online_time: 1714031576,
        loginid: 'CR90000533',
        name: 'client CR90000533',
        rating_average: null,
        rating_count: 0,
        recommended_average: null,
        recommended_count: null,
        total_completion_rate: null,
        has_not_been_recommended: true,
    },
    block_trade: 0 as TNumber,
    counterparty_type: 'buy' as 'buy' | 'sell',
    country: 'id',
    created_time: 1714017654,
    description: 'Created by script. Please call me 02203400',
    effective_rate: 16183.8,
    effective_rate_display: '16183.80',
    eligibility_status: ['join_date' as 'join_date' | 'country' | 'completion_rate' | 'rating_average'],
    eligible_countries: ['af', 'al'],
    id: '236',
    is_active: true,
    is_buy: true,
    is_sell: false,
    is_block_trade: false,
    is_deleted: false,
    active_orders: 2,
    amount: 10,
    amount_display: '10',
    contact_info: '02203400',
    days_until_archive: 4,
    is_eligible: 0 as TNumber,
    is_visible: true,
    local_currency: 'IDR',
    max_order_amount_limit: 50,
    max_order_amount_limit_display: '50.00',
    min_join_days: 15,
    min_order_amount_limit: 1,
    min_order_amount_limit_display: '1.00',
    order_expiry_period: 3600,
    payment_method: '',
    payment_method_names: ['Alipay'],
    price: 16183.8,
    price_display: '16183.80',
    rate: -0.1,
    rate_display: '-0.10',
    rate_type: 'float' as 'float' | 'fixed',
    type: 'sell' as 'sell' | 'buy',
    is_floating: true,
    deleted: 1 as const,
    max_order_amount: 50,
    max_order_amount_display: '50.00',
    min_completion_rate: 0,
    min_order_amount: 5,
    min_order_amount_display: '5.00',
    min_rating: 0,
    payment_info: 'Your bank details',
    payment_method_details: {
        '1': {
            display_name: 'Alipay',
            fields: {
                account: {
                    display_name: 'Alipay ID',
                    required: 1,
                    type: 'text' as 'text' | 'memo',
                    value: '12345',
                },
                instructions: {
                    display_name: 'Instructions',
                    required: 0,
                    type: 'memo' as 'text' | 'memo',
                    value: 'Alipay instructions',
                },
            },
            is_enabled: 1 as TNumber,
            method: 'alipay',
            type: 'ewallet' as 'ewallet' | 'other' | 'bank',
            used_by_adverts: ['1'],
            used_by_orders: ['1'],
        },
    },
    remaining_amount: 10,
    remaining_amount_display: '10',
    visibility_status: ['advertiser_temp_ban'] as TAdvertType['visibility_status'],
};

const mockProps = {
    advert: mockAdvertValues,
    advertiserBuyLimit: 1000,
    advertiserPaymentMethods: [
        {
            display_name: 'alipay',
            id: '1',
            fields: {
                account: {
                    display_name: 'Alipay ID',
                    required: 1,
                    type: 'text' as 'text' | 'memo',
                    value: '12345',
                },
                instructions: {
                    display_name: 'Instructions',
                    required: 0,
                    type: 'memo' as 'text' | 'memo',
                    value: 'Alipay instructions',
                },
            },
            is_enabled: 1 as TNumber,
            method: 'alipay',
            type: 'ewallet' as 'ewallet' | 'other' | 'bank',
            used_by_adverts: ['1'],
            used_by_orders: ['1'],
        },
    ],
    advertiserSellLimit: 1000,
    balanceAvailable: 10,
    displayEffectiveRate: '1',
    effectiveRate: 1,
    isModalOpen: true,
    onRequestClose: jest.fn(),
    paymentMethods: [
        {
            display_name: 'alipay',
            id: '1',
            fields: {
                account: {
                    display_name: 'Alipay ID',
                    required: 1,
                    type: 'text' as 'text' | 'memo',
                    value: '12345',
                },
                instructions: {
                    display_name: 'Instructions',
                    required: 0,
                    type: 'memo' as 'text' | 'memo',
                    value: 'Alipay instructions',
                },
            },
            type: 'ewallet' as 'ewallet' | 'other' | 'bank',
        },
    ],
};

describe('BuySellForm', () => {
    it('should render the form as expected', () => {
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it('should render the inline message when rate type is float', () => {
        render(<BuySellForm {...mockProps} advert={{ ...mockAdvertValues, rate_type: 'float' }} />);
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
        render(<BuySellForm {...mockProps} balanceAvailable={0} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        expect(inputField).toBeDisabled();
    });
    it('should check if the floating point validator is called on changing value in input field', async () => {
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        await userEvent.type(inputField, '1');
        expect(mockFloatingPointValidator).toHaveBeenCalled();
    });
    it('should render the advertiserSellLimit as max limit if buy limit < max order amount limit', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, max_order_amount_limit_display: '10', type: 'buy' }}
                advertiserBuyLimit={5}
            />
        );
        expect(screen.getByText('Limit: 1-5.00USD')).toBeInTheDocument();
    });
    it('should return the advertiserBuyLimit as max limit if sell limit < max order amount limit and sell order', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, max_order_amount_limit_display: '10', type: 'sell' }}
                advertiserSellLimit={5}
            />
        );
        expect(screen.getByText('Limit: 1-5.00USD')).toBeInTheDocument();
    });
    it('should call onchange when input field value is changed', async () => {
        mockFloatingPointValidator.mockReturnValue(true);
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        await userEvent.type(inputField, '1');
        expect(mockOnChange).toHaveBeenCalled();
    });
    it('should render the bank details text area when sell order and no payment methods are there', () => {
        render(<BuySellForm {...mockProps} advert={{ ...mockAdvertValues, payment_method_names: [], type: 'buy' }} />);
        expect(screen.getByText('Your bank details')).toBeInTheDocument();
    });
    it('should render the contact details text area when sell order and payment methods are there', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, payment_method_names: ['alipay'], type: 'buy' }}
            />
        );
        expect(screen.getByText('Your contact details')).toBeInTheDocument();
    });
    it('should send the payment_method_ids when payment methods are selected and sell order', async () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, payment_method_names: ['alipay'], type: 'buy' }}
            />
        );
        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);
        expect(mockMutateFn).toHaveBeenCalledWith(expect.objectContaining({ payment_method_ids: [1] }));
    });
});
