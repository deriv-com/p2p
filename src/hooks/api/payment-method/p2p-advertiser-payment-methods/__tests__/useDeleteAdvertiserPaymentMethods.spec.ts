import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useDeleteAdvertiserPaymentMethods from '../useDeleteAdvertiserPaymentMethods';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserPaymentMethods: jest.fn().mockReturnValue({ data: undefined }),
}));

const mockUseInvalidateQuery = jest.fn();
jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2PAdvertiserPaymentMethods = useP2PAdvertiserPaymentMethods as jest.Mock;

describe('useDeleteAdvertiserPaymentMethods', () => {
    it('should call the mutate of useP2PAdvertiserPaymentMethods when delete function is called', () => {
        const mockMutate = jest.fn();

        mockUseP2PAdvertiserPaymentMethods.mockReturnValueOnce({
            data: {},
            mutate: mockMutate,
        });

        const { result } = renderHook(() => useDeleteAdvertiserPaymentMethods());

        result.current.delete(123);

        expect(mockMutate).toHaveBeenCalledWith({ delete: [123] });
    });

    it('should call invalidate on success response', () => {
        renderHook(() => useDeleteAdvertiserPaymentMethods());

        const mockOnSuccess = mockUseP2PAdvertiserPaymentMethods.mock.calls[0][0].onSuccess;

        mockOnSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_payment_methods');
    });
});
