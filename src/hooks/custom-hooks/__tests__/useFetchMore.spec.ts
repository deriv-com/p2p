import debounce from 'lodash/debounce';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchMore from '../useFetchMore';

jest.mock('lodash/debounce');

describe('useFetchMore', () => {
    let mockLoadMore: jest.Mock,
        containerRef: {
            current: {
                addEventListener: jest.Mock;
                clientHeight: number;
                removeEventListener: jest.Mock;
                scrollHeight: number;
                scrollTop: number;
            };
        };

    beforeEach(() => {
        mockLoadMore = jest.fn();
        containerRef = {
            current: {
                addEventListener: jest.fn(),
                clientHeight: 0,
                removeEventListener: jest.fn(),
                scrollHeight: 0,
                scrollTop: 0,
            },
        };
        (debounce as jest.Mock).mockImplementation(fn => fn);
    });

    it('should add scroll event listener on mount', () => {
        // @ts-expect-error - we don't need to mock all properties
        renderHook(() => useFetchMore({ loadMore: mockLoadMore, ref: containerRef }));

        expect(containerRef.current.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should remove scroll event listener on unmount', () => {
        // @ts-expect-error - we don't need to mock all properties
        const { unmount } = renderHook(() => useFetchMore({ loadMore: mockLoadMore, ref: containerRef }));

        unmount();

        expect(containerRef.current.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should call loadMore when scrolled near the bottom', async () => {
        containerRef.current.scrollTop = 100;
        containerRef.current.clientHeight = 50;
        containerRef.current.scrollHeight = 300;

        // @ts-expect-error - we don't need to mock all properties
        renderHook(() => useFetchMore({ loadMore: mockLoadMore, ref: containerRef }));

        await waitFor(() => {
            containerRef.current.addEventListener.mock.calls[0][1](); // Simulate scroll event
        });

        expect(mockLoadMore).toHaveBeenCalled();
    });
});
