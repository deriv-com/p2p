import { mockAdvertiserCreateValues } from '@/__mocks__/mock-data';
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

const mockUseP2PAdvertiserCreate = useP2PAdvertiserCreate as jest.MockedFunction<typeof useP2PAdvertiserCreate>;

describe('useAdvertiserCreate', () => {
    it('should return undefined if the data is not ready', () => {
        const { result } = renderHook(() => useAdvertiserCreate());

        expect(result.current.data).toBeUndefined();
    });

    it('should call mutate of useP2PAdvertiserCreate when the hook mutate is called', () => {
        const mockMutate = jest.fn();

        // @ts-expect-error not all values are defined
        mockUseP2PAdvertiserCreate.mockReturnValueOnce({
            data: undefined,
            mutate: mockMutate,
        });
        const { result } = renderHook(() => useAdvertiserCreate());

        result.current.mutate({ name: 'John Doe' });

        expect(mockMutate).toHaveBeenCalledWith({ name: 'John Doe' });
    });

    it('should return modified data if the data is ready', () => {
        // @ts-expect-error not all values are defined
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

        // @ts-expect-error onSuccess prop not defined
        const { onSuccess } = mockUseP2PAdvertiserCreate.mock.calls[0][0];
        onSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_info');
    });
});
