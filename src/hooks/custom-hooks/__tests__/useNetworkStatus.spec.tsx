import { renderHook } from '@testing-library/react';
import useNavigatorOnline from '../useNavigatorOnline';
import useNetworkStatus from '../useNetworkStatus';

jest.mock('../useNavigatorOnline');

describe('useNetworkStatus', () => {
    it('initializes as online', () => {
        (useNavigatorOnline as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe('online');
    });

    it('changes status to offline when network is down', () => {
        (useNavigatorOnline as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe('offline');
    });

    it('reacts to changes in network status', () => {
        (useNavigatorOnline as jest.Mock).mockReturnValue(true);
        const { rerender, result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe('online');

        // Simulating network going offline
        (useNavigatorOnline as jest.Mock).mockReturnValue(false);
        rerender();
        expect(result.current).toBe('offline');

        // Simulating network coming back online
        (useNavigatorOnline as jest.Mock).mockReturnValue(true);
        rerender();
        expect(result.current).toBe('online');
    });
});
