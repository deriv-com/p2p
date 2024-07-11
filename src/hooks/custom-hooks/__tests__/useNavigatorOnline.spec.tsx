import { act, renderHook } from '@testing-library/react';
import useNavigatorOnline from '../useNavigatorOnline';

describe('useNavigatorOnline', () => {
    it('initializes as true when browser is online', () => {
        const { result } = renderHook(() => useNavigatorOnline());
        expect(result.current).toBe(true);
    });

    it('sets status to false when offline event is triggered', () => {
        const { result } = renderHook(() => useNavigatorOnline());

        act(() => {
            window.dispatchEvent(new Event('offline'));
        });

        expect(result.current).toBe(false);
    });

    it('sets status to true when online event is triggered', () => {
        Object.defineProperty(navigator, 'onLine', {
            value: false,
            writable: true,
        });

        const { result } = renderHook(() => useNavigatorOnline());

        act(() => {
            window.dispatchEvent(new Event('online'));
        });

        expect(result.current).toBe(true);
    });

    it('removes event listeners on unmount', () => {
        const addSpy = jest.spyOn(window, 'addEventListener');
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useNavigatorOnline());

        expect(addSpy).toHaveBeenCalledTimes(2);
        unmount();
        expect(removeSpy).toHaveBeenCalledTimes(2);
    });
});
