import { useP2POrderCreate } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderCreate from '../useOrderCreate';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2POrderCreate: jest.fn(() => ({
        data: undefined,
    })),
}));

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

const mocUseP2POrderCreate = useP2POrderCreate as jest.Mock;

describe('useOrderCreate', () => {
    it('should return data as undefined if data from useP2POrderCreate is undefined', () => {
        const { result } = renderHook(() => useOrderCreate());

        expect(result.current.data).toEqual(undefined);
    });

    it('should call invalidate when onSuccess is triggered and return the data', () => {
        mocUseP2POrderCreate.mockReturnValue({
            data: {
                advert_details: { block_trade: 1 },
                advertiser_details: { is_online: 1 },
                client_details: { is_online: 1 },
                is_incoming: 1,
                is_reviewable: 1,
                is_seen: 1,
            },
        });

        const { result } = renderHook(() => useOrderCreate());

        const onSuccess = mocUseP2POrderCreate.mock.calls[0][0].onSuccess;

        onSuccess();

        expect(mockInvalidate).toHaveBeenCalledWith('p2p_order_list');
        expect(result.current.data).toEqual({
            advert_details: { block_trade: 1, is_block_trade: true },
            advertiser_details: { is_online: true },
            client_details: { is_online: true },
            is_incoming: true,
            is_reviewable: true,
            is_seen: true,
        });
    });
});
