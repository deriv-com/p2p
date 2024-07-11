import { act, renderHook } from '@testing-library/react';
import useSyncedTime from '../useSyncedTime';

const initialTime = Math.floor(Date.now() / 1000);

jest.mock('@deriv-com/api-hooks', () => ({
    useTime: jest.fn(() => ({ data: initialTime })),
}));

describe('useSyncedTime', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    it('initializes with the current date', async () => {
        const { result } = renderHook(() => useSyncedTime());
        expect(result.current).toBe(initialTime);
    });

    it('updates server time every second', () => {
        const { result } = renderHook(() => useSyncedTime());

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(initialTime + 1);
    });

    it('stops updating after unmount', () => {
        const { result, unmount } = renderHook(() => useSyncedTime());

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(result.current).toBe(initialTime + 3);
        unmount();

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(initialTime + 3);
    });
});
