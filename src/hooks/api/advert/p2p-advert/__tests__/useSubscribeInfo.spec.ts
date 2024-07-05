import { mockAdvertValues } from '@/__mocks__/mock-data';
import { useSubscribe } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useSubscribeInfo from '../useSubscribeInfo';

jest.mock('@deriv-com/api-hooks', () => ({
    useSubscribe: jest.fn(() => undefined),
}));

const mockUseSubscribe = useSubscribe as jest.Mock;

describe('useSubscribe', () => {
    it('should return data as undefined if p2p_advert_info returned from useSubscribe is undefined', () => {
        mockUseSubscribe.mockReturnValue({
            data: {
                p2p_advert_info: undefined,
            },
            error: undefined,
            subscribe: jest.fn(),
        });
        const { result } = renderHook(() => useSubscribeInfo());
        expect(result.current.data).toBeUndefined();
    });

    it('should return the data if p2p_advert_info returned from useSubscribe is defined', () => {
        mockUseSubscribe.mockReturnValue({ data: { p2p_advert_info: mockAdvertValues } });

        const { result } = renderHook(() => useSubscribeInfo());

        expect(result.current.data).toEqual(mockAdvertValues);
    });
});
