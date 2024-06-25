import { useP2POrderReview } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderReview from '../useOrderReview';

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
    useP2POrderReview: jest.fn().mockReturnValue({
        data: {},
        mutate: jest.fn(),
    }),
}));

const mockUseP2POrderReview = useP2POrderReview as jest.MockedFunction<typeof useP2POrderReview>;

const mockFn = jest.fn();
jest.mock('../../../useInvalidateQuery', () => ({
    __esModule: true,
    default: jest.fn(() => mockFn),
}));

describe('useOrderReview', () => {
    it('should return undefined if data is not available', () => {
        // @ts-expect-error - useQuery return values not specified
        mockUseP2POrderReview.mockReturnValue({
            data: undefined,
            mutate: jest.fn(),
        });

        const { result } = renderHook(() => useOrderReview());

        expect(result.current.data).toBeUndefined();
    });

    it('should call invalidate when onSuccess is triggered', async () => {
        const { result } = renderHook(() => useOrderReview());

        await result.current.mutate({ order_id: '1234', rating: 4, recommended: 1 });

        // @ts-expect-error - onSuccess prop not defined
        const { onSuccess } = mockUseP2POrderReview.mock.calls[0][0];
        onSuccess();
        expect(mockFn).toHaveBeenCalledWith('p2p_order_list');
    });

    it('should return the correct data when data is available', () => {
        const mockData = {
            advertiser_id: 'CR1234',
            created_time: 123456,
            order_id: '1234',
            rating: 4,
            recommended: 1 as 0 | 1,
        };

        // @ts-expect-error - useQuery return values not specified
        mockUseP2POrderReview.mockReturnValue({
            data: mockData,
            mutate: jest.fn(),
        });
        const { result } = renderHook(() => useOrderReview());

        expect(result.current.data).toEqual(mockData);
    });
});
