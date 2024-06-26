import { mockAdvertiserCreateValues } from '@/__mocks__/mock-data';
import { useP2pAdvertiserUpdate } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserUpdate from '../useAdvertiserUpdate';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pAdvertiserUpdate: jest.fn().mockReturnValue({
        data: undefined,
        mutate: jest.fn(),
    }),
}));

const mockUseInvalidateQuery = jest.fn();
jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2pAdvertiserUpdate = useP2pAdvertiserUpdate as jest.MockedFunction<typeof useP2pAdvertiserUpdate>;

describe('useAdvertiserUpdate', () => {
    it('should return undefined if the data is not ready', () => {
        const { result } = renderHook(() => useAdvertiserUpdate());

        expect(result.current.data).toBeUndefined();
    });

    it('should call mutate of useP2pAdvertiserUpdate when the hook mutate is called', () => {
        const mockMutate = jest.fn();

        // @ts-expect-error not all values are defined
        mockUseP2pAdvertiserUpdate.mockReturnValueOnce({
            data: undefined,
            mutate: mockMutate,
        });
        const { result } = renderHook(() => useAdvertiserUpdate());

        result.current.mutate({ is_listed: 1 });

        expect(mockMutate).toHaveBeenCalledWith({ is_listed: 1 });
    });

    it('should return modified data if the data is ready', () => {
        // @ts-expect-error not all values are defined
        mockUseP2pAdvertiserUpdate.mockReturnValueOnce({
            data: {
                ...mockAdvertiserCreateValues,
            },
            mutate: jest.fn(),
        });

        const { result } = renderHook(() => useAdvertiserUpdate());

        expect(result.current.data).toEqual({
            ...mockAdvertiserCreateValues,
            is_approved: true,
            is_basic_verified: true,
            is_fully_verified: true,
            is_listed: true,
            is_online: true,
            should_show_name: false,
        });
    });

    it('should call invalidate when onSuccess is triggered', () => {
        renderHook(() => useAdvertiserUpdate());

        // @ts-expect-error onSuccess prop not defined
        const { onSuccess } = mockUseP2pAdvertiserUpdate.mock.calls[0][0];
        onSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_info');
    });
});
