import { useP2PAdvertiserCreate } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserCreate from '../useAdvertiserCreate';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserCreate: jest.fn().mockReturnValue({
        data: undefined,
        mutate: jest.fn(),
    }),
}));

const mockUseInvalidateQuery = jest.fn();
jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2PAdvertiserCreate = useP2PAdvertiserCreate as jest.Mock;

const mockAdvertiserCreateValues = {
    advert_rates: null,
    balance_available: 10000,
    basic_verification: 1,
    blocked_by_count: 0,
    buy_completion_rate: null,
    buy_orders_amount: '0.00',
    buy_orders_count: 0,
    buy_time_avg: null,
    cancel_time_avg: null,
    cancels_remaining: 300,
    chat_token: 'a5236bda5f69b161b449e6aa61fafbb4bd0a6652',
    chat_user_id: 'p2puser_CR_102_1719403818',
    contact_info: '',
    created_time: 1719403819,
    daily_buy: '0.00',
    daily_buy_limit: '100.00',
    daily_sell: '0.00',
    daily_sell_limit: '100.00',
    default_advert_description: '',
    full_verification: 1,
    id: '102',
    is_approved: 1,
    is_listed: 1,
    is_online: 1,
    last_online_time: 1719403819,
    name: 'test',
    partner_count: 0,
    payment_info: '',
    rating_average: null,
    rating_count: 0,
    recommended_average: null,
    recommended_count: null,
    release_time_avg: null,
    sell_completion_rate: null,
    sell_orders_amount: '0.00',
    sell_orders_count: 0,
    show_name: 0,
    total_completion_rate: null,
    total_orders_count: 0,
    total_turnover: '0.00',
    withdrawal_limit: null,
};

describe('useAdvertiserCreate', () => {
    it('should return undefined if the data is not ready', () => {
        const { result } = renderHook(() => useAdvertiserCreate());

        expect(result.current.data).toBeUndefined();
    });

    it('should call mutate of useP2PAdvertiserCreate when the hook mutate is called', () => {
        const mockMutate = jest.fn();
        mockUseP2PAdvertiserCreate.mockReturnValueOnce({
            data: undefined,
            mutate: mockMutate,
        });
        const { result } = renderHook(() => useAdvertiserCreate());

        result.current.mutate({ name: 'John Doe' });

        expect(mockMutate).toHaveBeenCalledWith({ name: 'John Doe' });
    });

    it('should return modified data if the data is ready', () => {
        mockUseP2PAdvertiserCreate.mockReturnValueOnce({
            data: {
                ...mockAdvertiserCreateValues,
            },
            mutate: jest.fn(),
        });

        const { result } = renderHook(() => useAdvertiserCreate());

        expect(result.current.data).toEqual({
            ...mockAdvertiserCreateValues,
            has_basic_verification: true,
            has_full_verification: true,
            is_approved: true,
            is_listed: true,
            is_online: true,
            should_show_name: false,
        });
    });

    it('should call invalidate when onSuccess is triggered', () => {
        renderHook(() => useAdvertiserCreate());

        const { onSuccess } = mockUseP2PAdvertiserCreate.mock.calls[0][0];
        onSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_info');
    });
});
