import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useUpdateAdvertiserPaymentMethods from '../useUpdateAdvertiserPaymentMethods';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserPaymentMethods: jest.fn().mockReturnValue({ data: undefined }),
}));

const mockUseInvalidateQuery = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2PAdvertiserPaymentMethods = useP2PAdvertiserPaymentMethods as jest.Mock;

describe('useUpdateAdvertiserPaymentMethods', () => {
    it('should call the mutate of useP2PAdvertiserPaymentMethods when update function is called', () => {
        const mockMutate = jest.fn();

        mockUseP2PAdvertiserPaymentMethods.mockReturnValueOnce({
            data: {},
            mutate: mockMutate,
        });

        const { result } = renderHook(() => useUpdateAdvertiserPaymentMethods());

        result.current.update('123', { method: 'transfer' });

        expect(mockMutate).toHaveBeenCalledWith({ update: { 123: { method: 'transfer' } } });
    });

    it('should call invalidate on success response', () => {
        renderHook(() => useUpdateAdvertiserPaymentMethods());

        const mockOnSuccess = mockUseP2PAdvertiserPaymentMethods.mock.calls[0][0].onSuccess;

        mockOnSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_payment_methods');
    });
});
