import { useP2pOrderConfirm } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderConfirm from '../useOrderConfirm';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pOrderConfirm: jest.fn(() => ({
        data: undefined,
    })),
}));

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

const mockUseP2pOrderConfirm = useP2pOrderConfirm as jest.Mock;

describe('useOrderConfirm', () => {
    it('should return data as undefined if data from useP2pOrderConfirm is undefined', () => {
        const { result } = renderHook(() => useOrderConfirm());

        expect(result.current.data).toEqual(undefined);
    });

    it('should call invalidate when onSuccess is triggered and return the data', () => {
        mockUseP2pOrderConfirm.mockReturnValue({
            data: { dry_run: 1, id: '1234', status: 'confirmed' },
        });

        const { result } = renderHook(() => useOrderConfirm());

        const onSuccess = mockUseP2pOrderConfirm.mock.calls[0][0].onSuccess;

        onSuccess();

        expect(mockInvalidate).toHaveBeenCalledWith('p2p_order_info');
        expect(result.current.data).toEqual({ dry_run: 1, id: '1234', isDryRunSuccessful: true, status: 'confirmed' });
    });
});
