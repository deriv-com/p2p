import { useP2PAdvertiserPaymentMethods } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useCreateAdvertiserPaymentMethods from '../useCreateAdvertiserPaymentMethods';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2PAdvertiserPaymentMethods: jest.fn().mockReturnValue({ data: undefined }),
}));

const mockUseInvalidateQuery = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockUseInvalidateQuery);

const mockUseP2PAdvertiserPaymentMethods = useP2PAdvertiserPaymentMethods as jest.Mock;

describe('useCreateAdvertiserPaymentMethods', () => {
    it('should call the mutate of useP2PAdvertiserPaymentMethods when create function is called', () => {
        const mockMutate = jest.fn();

        mockUseP2PAdvertiserPaymentMethods.mockReturnValueOnce({
            data: {},
            mutate: mockMutate,
        });

        const { result } = renderHook(() => useCreateAdvertiserPaymentMethods());

        result.current.create({ method: 'transfer' });

        expect(mockMutate).toHaveBeenCalledWith({ create: [{ method: 'transfer' }] });
    });

    it('should call invalidate on success response', () => {
        renderHook(() => useCreateAdvertiserPaymentMethods());

        const mockOnSuccess = mockUseP2PAdvertiserPaymentMethods.mock.calls[0][0].onSuccess;

        mockOnSuccess();

        expect(mockUseInvalidateQuery).toHaveBeenCalledWith('p2p_advertiser_payment_methods');
    });
});
