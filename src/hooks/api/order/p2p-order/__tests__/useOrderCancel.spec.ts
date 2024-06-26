import { useP2pOrderCancel } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useOrderCancel from '../useOrderCancel';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pOrderCancel: jest.fn(() => ({
        data: undefined,
    })),
}));

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

const mockUseP2pOrderCancel = useP2pOrderCancel as jest.Mock;

describe('useOrderCancel', () => {
    it('should return data as undefined if data from useP2pOrderCancel is undefined', () => {
        const { result } = renderHook(() => useOrderCancel());

        expect(result.current.data).toEqual(undefined);
    });

    it('should call invalidate when onSuccess is triggered and return the data', () => {
        mockUseP2pOrderCancel.mockReturnValue({
            data: { id: '1234', status: 'cancelled' },
        });

        const { result } = renderHook(() => useOrderCancel());

        const onSuccess = mockUseP2pOrderCancel.mock.calls[0][0].onSuccess;

        onSuccess();

        expect(mockInvalidate).toHaveBeenCalledWith('p2p_order_info');
        expect(result.current.data).toEqual({ id: '1234', status: 'cancelled' });
    });
});
