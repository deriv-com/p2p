import { useSubscribe } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderInfo from '../useOrderInfo';

jest.mock('@deriv-com/api-hooks', () => ({
    useSubscribe: jest.fn(() => ({
        data: undefined,
    })),
}));

const mockUseSubscribe = useSubscribe as jest.Mock;

describe('useOrderInfo', () => {
    it('should return undefined if data is undefined', () => {
        const { result } = renderHook(() => useOrderInfo());

        expect(result.current.data).toBeUndefined();
    });

    it('should return modified data if data is defined', () => {
        mockUseSubscribe.mockImplementation(() => ({
            data: {
                p2p_order_info: {
                    advert_details: {
                        block_trade: 1,
                    },
                    advertiser_details: {
                        is_online: 1,
                        is_recommended: null,
                    },
                    client_details: {
                        is_online: 1,
                        is_recommended: null,
                    },
                    is_incoming: 1,
                    is_reviewable: 1,
                    is_seen: 1,
                    review_details: {
                        is_recommended: null,
                    },
                    verification_pending: 1,
                },
            },
        }));

        const { result } = renderHook(() => useOrderInfo());

        expect(result.current.data).toEqual({
            advert_details: {
                block_trade: 1,
                is_block_trade: true,
            },
            advertiser_details: {
                has_not_been_recommended: true,
                is_online: true,
                is_recommended: false,
            },
            client_details: {
                has_not_been_recommended: true,
                is_online: true,
                is_recommended: false,
            },
            is_incoming: true,
            is_reviewable: true,
            is_seen: true,
            is_verification_pending: true,
            review_details: {
                has_not_been_recommended: false,
                is_recommended: false,
            },
            verification_pending: 1,
        });
    });

    it('should return review_details as undefined if review_details is undefined', () => {
        mockUseSubscribe.mockImplementation(() => ({
            data: {
                p2p_order_info: {
                    advert_details: {
                        block_trade: 1,
                    },
                    advertiser_details: {
                        is_online: 1,
                        is_recommended: null,
                    },
                    client_details: {
                        is_online: 1,
                        is_recommended: null,
                    },
                    is_incoming: 1,
                    is_reviewable: 1,
                    is_seen: 1,
                    review_details: undefined,
                    verification_pending: 1,
                },
            },
        }));

        const { result } = renderHook(() => useOrderInfo());

        expect(result.current.data?.review_details).toEqual(undefined);
    });
});
