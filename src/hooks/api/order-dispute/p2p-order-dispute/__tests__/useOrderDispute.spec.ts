import { useP2pOrderDispute } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderDispute from '../useOrderDispute';

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
    useP2pOrderDispute: jest.fn().mockReturnValue({
        data: {},
        mutate: jest.fn(),
    }),
}));

const mockUseP2pOrderDispute = useP2pOrderDispute as jest.MockedFunction<typeof useP2pOrderDispute>;

const mockFn = jest.fn();
jest.mock('../../../useInvalidateQuery', () => ({
    __esModule: true,
    default: jest.fn(() => mockFn),
}));

describe('useOrderDispute', () => {
    it('should return undefined if data is not available', () => {
        // @ts-expect-error - useQuery return values not specified
        mockUseP2pOrderDispute.mockReturnValue({
            data: undefined,
            mutate: jest.fn(),
        });

        const { result } = renderHook(() => useOrderDispute());

        expect(result.current.data).toBeUndefined();
    });

    it('should call invalidate when onSuccess is triggered', async () => {
        const { result } = renderHook(() => useOrderDispute());

        await result.current.mutate({ dispute_reason: 'seller_not_released', id: '1234' });

        // @ts-expect-error - onSuccess prop not defined
        const { onSuccess } = mockUseP2pOrderDispute.mock.calls[0][0];
        onSuccess();
        expect(mockFn).toHaveBeenCalledWith('p2p_order_info');
    });

    it('should return the correct data', () => {
        // @ts-expect-error - useQuery return values not specified
        mockUseP2pOrderDispute.mockReturnValue({
            data: {
                account_currency: 'USD',
                advert_details: {
                    block_trade: 0,
                    description: 'description',
                    id: 'id',
                    payment_method: 'payment_method',
                    type: 'buy',
                },
                advertiser_details: {
                    completed_orders_count: 1,
                    first_name: 'first_name',
                    id: 'id',
                    is_online: 1,
                    last_name: 'last_name',
                    last_online_time: 123455,
                    loginid: 'loginid',
                    name: 'name',
                    rating_average: 1,
                    rating_count: 1,
                    recommended_average: 1,
                    recommended_count: 1,
                    total_completion_rate: 1,
                },
                amount: 1,
                amount_display: '1',
                chat_channel_url: 'chat_channel_url',
                client_details: {
                    id: 'id1',
                    is_online: 1,
                    loginid: 'loginid1',
                    name: 'name1',
                },
                contact_info: 'contact_info',
                created_time: 123456,
                dispute_details: {
                    dispute_reason: 'dispute_reason',
                    disputer_loginid: 'disputer_loginid',
                },
                expiry_time: 123456,
                id: '123',
                is_incoming: 1,
                is_reviewable: 1,
                is_seen: 1,
                local_currency: 'IDR',
                payment_info: 'payment_info',
                price: 1,
                price_display: '1',
                rate: 1,
                rate_display: '1',
                status: 'pending',
                type: 'buy',
            },
            mutate: jest.fn(),
        });
        const { result } = renderHook(() => useOrderDispute());

        expect(result.current.data).toEqual({
            account_currency: 'USD',
            advert_details: {
                block_trade: 0,
                description: 'description',
                id: 'id',
                payment_method: 'payment_method',
                type: 'buy',
            },
            advertiser_details: {
                completed_orders_count: 1,
                first_name: 'first_name',
                id: 'id',
                is_online: 1,
                last_name: 'last_name',
                last_online_time: 123455,
                loginid: 'loginid',
                name: 'name',
                rating_average: 1,
                rating_count: 1,
                recommended_average: 1,
                recommended_count: 1,
                total_completion_rate: 1,
            },
            amount: 1,
            amount_display: '1',
            chat_channel_url: 'chat_channel_url',
            client_details: {
                id: 'id1',
                is_online: 1,
                loginid: 'loginid1',
                name: 'name1',
            },
            contact_info: 'contact_info',
            created_time: 123456,
            dispute_details: {
                dispute_reason: 'dispute_reason',
                disputer_loginid: 'disputer_loginid',
            },
            expiry_time: 123456,
            id: '123',
            is_incoming: 1,
            is_reviewable: 1,
            is_seen: 1,
            local_currency: 'IDR',
            payment_info: 'payment_info',
            price: 1,
            price_display: '1',
            rate: 1,
            rate_display: '1',
            status: 'pending',
            type: 'buy',
        });
    });
});
