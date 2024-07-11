import { useP2PAdvertiserAdverts } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserAdverts from '../useAdvertiserAdverts';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserAdverts: jest.fn().mockReturnValue({
        data: undefined,
        loadMoreAdverts: jest.fn(),
        rest: {},
    }),
}));

const mockAdvertiserAdvertValues = {
    account_currency: 'USD',
    active_orders: 1,
    advertiser_details: {
        completed_orders_count: 0,
        id: '79',
        is_online: 1,
        last_online_time: 1719396148,
        name: 'client CR90000555',
        rating_average: null,
        rating_count: 0,
        recommended_average: null,
        recommended_count: null,
        total_completion_rate: 0,
    },
    amount: 50,
    amount_display: '50.00',
    block_trade: 0,
    contact_info: 'Created by script. Please call me 02203400',
    counterparty_type: 'buy',
    country: 'id',
    created_time: 1719378318,
    description: 'Created by script. Please call me 02203400',
    effective_rate: 16397.586,
    effective_rate_display: '16397.586',
    id: '148',
    is_active: 1,
    is_visible: 1,
    local_currency: 'IDR',
    max_order_amount: 50,
    max_order_amount_display: '50.00',
    max_order_amount_limit: 48,
    max_order_amount_limit_display: '48.00',
    min_order_amount: 0.1,
    min_order_amount_display: '0.10',
    min_order_amount_limit: 0.1,
    min_order_amount_limit_display: '0.10',
    order_expiry_period: 3600,
    payment_info: 'Transfer to account 000-1111',
    payment_method: 'bank_transfer',
    price: 16397.586,
    price_display: '16397.59',
    rate: -0.1,
    rate_display: '-0.10',
    rate_type: 'float',
    remaining_amount: 48,
    remaining_amount_display: '48.00',
    type: 'sell',
};

const mockUseP2PAdvertiserAdverts = useP2PAdvertiserAdverts as jest.Mock;

describe('useAdvertiserAdverts', () => {
    it('should return undefined if not defined', () => {
        const { result } = renderHook(() => useAdvertiserAdverts());
        expect(result.current.data).toBeUndefined();
    });

    it('should return undefined if data length is 0', () => {
        mockUseP2PAdvertiserAdverts.mockReturnValueOnce({
            data: [],
            loadMoreAdverts: jest.fn(),
            rest: {},
        });
        const { result } = renderHook(() => useAdvertiserAdverts());
        expect(result.current.data).toBeUndefined();
    });

    it('should return the correct modified data if data length is greater than 0', () => {
        mockUseP2PAdvertiserAdverts.mockReturnValueOnce({
            data: [{ ...mockAdvertiserAdvertValues }],
            loadMoreAdverts: jest.fn(),
            rest: {},
        });

        const { result } = renderHook(() => useAdvertiserAdverts());
        expect(result.current.data).toEqual([
            {
                ...mockAdvertiserAdvertValues,
                advertiser_details: {
                    ...mockAdvertiserAdvertValues.advertiser_details,
                    has_not_been_recommended: false,
                    is_blocked: false,
                    is_favourite: false,
                    is_online: true,
                    is_recommended: false,
                },
                block_trade: false,
                created_time: new Date(1719378318),
                is_active: true,
                is_floating: true,
                is_visible: true,
            },
        ]);
    });

    it('should return created time as undefined if not defined', () => {
        mockUseP2PAdvertiserAdverts.mockReturnValueOnce({
            data: [{ ...mockAdvertiserAdvertValues, created_time: undefined }],
            loadMoreAdverts: jest.fn(),
            rest: {},
        });

        const { result } = renderHook(() => useAdvertiserAdverts());
        expect(result.current.data?.[0].created_time).toEqual(undefined);
    });
});
