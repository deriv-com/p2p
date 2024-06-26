import { mockAdvertValues } from '@/__mocks__/mock-data';
import { useP2pAdvertCreate } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertCreate from '../useAdvertCreate';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pAdvertCreate: jest.fn().mockReturnValue({
        data: undefined,
        mutate: jest.fn(),
    }),
}));

const mockUseP2pAdvertCreate = useP2pAdvertCreate as jest.Mock;

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

describe('useAdvertCreate', () => {
    it('should return undefined if data is not present', () => {
        const { result } = renderHook(() => useAdvertCreate());

        expect(result.current.data).toEqual(undefined);
    });

    it('should call invalidate when onSuccess is triggered', async () => {
        const { result } = renderHook(() => useAdvertCreate());

        await result.current.mutate({
            amount: 100,
            description: 'Please transfer to account number 1234',
            max_order_amount: 50,
            min_order_amount: 20,
            payment_method: 'bank_transfer',
            rate: 4.25,
            type: 'buy',
        });

        const { onSuccess } = mockUseP2pAdvertCreate.mock.calls[0][0];
        onSuccess();
        expect(mockInvalidate).toHaveBeenCalledWith('p2p_advert_list');
    });

    it('should return correct data if present', () => {
        mockUseP2pAdvertCreate.mockReturnValueOnce({
            data: mockAdvertValues,
        });

        const { result } = renderHook(() => useAdvertCreate());
        expect(result.current.data).toEqual(mockAdvertValues);
    });
});
