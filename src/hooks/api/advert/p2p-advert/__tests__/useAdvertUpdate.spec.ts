import { mockAdvertValues } from '@/__mocks__/mock-data';
import { useP2pAdvertUpdate } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertUpdate from '../useAdvertUpdate';

jest.mock('@deriv-com/api-hooks', () => ({
    useP2pAdvertUpdate: jest.fn().mockReturnValue({
        data: undefined,
        mutate: jest.fn(),
    }),
}));

const mockUseP2pAdvertUpdate = useP2pAdvertUpdate as jest.Mock;

const mockInvalidate = jest.fn();

jest.mock('../../../useInvalidateQuery', () => () => mockInvalidate);

describe('useAdvertUpdate', () => {
    it('should return undefined if data is not present', () => {
        const { result } = renderHook(() => useAdvertUpdate());

        expect(result.current.data).toEqual(undefined);
    });

    it('should call invalidate when onSuccess is triggered', async () => {
        const { result } = renderHook(() => useAdvertUpdate());

        await result.current.mutate({
            id: '1234',
            is_active: 0,
        });

        const { onSuccess } = mockUseP2pAdvertUpdate.mock.calls[0][0];
        onSuccess();
        expect(mockInvalidate).toHaveBeenCalledWith('p2p_advert_list');
    });

    it('should return correct data if present', () => {
        mockUseP2pAdvertUpdate.mockReturnValueOnce({
            data: mockAdvertValues,
        });

        const { result } = renderHook(() => useAdvertUpdate());
        expect(result.current.data).toEqual(mockAdvertValues);
    });
});
