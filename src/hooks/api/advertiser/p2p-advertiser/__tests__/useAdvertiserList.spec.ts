import { mockAdvertiserCreateValues } from '@/__mocks__/mock-data';
import { useP2pAdvertiserList } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserList from '../useAdvertiserList';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pAdvertiserList: jest.fn().mockReturnValue({
        data: undefined,
        rest: {},
    }),
}));

const mockUseInvalidateQuery = jest.fn();
jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2pAdvertiserList = useP2pAdvertiserList as jest.MockedFunction<typeof useP2pAdvertiserList>;

describe('useAdvertiserList', () => {
    it('should return undefined if the data is not ready', () => {
        const { result } = renderHook(() => useAdvertiserList());

        expect(result.current.data).toBeUndefined();
    });

    it('should return modified data if the data is ready', () => {
        const mockData = { ...mockAdvertiserCreateValues, is_blocked: 0 as const };
        // @ts-expect-error not all properties are defined
        mockUseP2pAdvertiserList.mockReturnValueOnce({
            data: [
                {
                    ...mockData,
                },
            ],
        });

        const { result } = renderHook(() => useAdvertiserList());

        expect(result.current.data).toEqual([
            {
                ...mockData,
                is_approved: true,
                is_basic_verified: true,
                is_blocked: false,
                is_favourite: false,
                is_fully_verified: true,
                is_listed: true,
                is_online: true,
                is_recommended: false,
            },
        ]);
    });

    it('should call the query key with the correct payload', () => {
        const payload = { advertiser_name: 'test' };
        renderHook(() => useAdvertiserList(payload));

        expect(mockUseP2pAdvertiserList).toHaveBeenCalledWith({
            payload: { advertiser_name: 'test' },
            queryKey: ['p2p_advertiser_list', { advertiser_name: 'test' }],
            refetchOnWindowFocus: false,
        });
    });
});
