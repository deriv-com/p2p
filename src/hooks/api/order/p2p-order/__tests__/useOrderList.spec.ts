import { useP2POrderList } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderList from '../useOrderList';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2POrderList: jest.fn(() => ({ data: undefined })),
}));

const mockUseP2POrderList = useP2POrderList as jest.Mock;

describe('useOrderList', () => {
    it('should return data as undefined when data is undefined', () => {
        const { result } = renderHook(() => useOrderList({ limit: 10, offset: 0 }));
        expect(result.current.data).toBeUndefined();
    });

    it('should return modified data when data is defined', () => {
        mockUseP2POrderList.mockReturnValue({
            data: [
                {
                    advert_details: {
                        block_trade: 0,
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
                        recommended: null,
                    },
                    verification_pending: 0,
                },
            ],
        });

        const { result } = renderHook(() => useOrderList({ limit: 10, offset: 0 }));
        expect(result.current.data).toEqual([
            {
                advert_details: {
                    block_trade: 0,
                    is_block_trade: false,
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
                is_verification_pending: false,
                review_details: {
                    has_not_been_recommended: true,
                    is_recommended: false,
                    recommended: null,
                },
                verification_pending: 0,
            },
        ]);
    });
});
