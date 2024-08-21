import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useDotButton from '../useDotButton';

const mockEmblaApi = {
    on: jest.fn().mockReturnThis(),
    scrollSnapList: jest.fn(() => [0, 1, 2]),
    scrollTo: jest.fn(),
    selectedScrollSnap: jest.fn(() => 0),
};

describe('useDotButton', () => {
    it('should return the correct values', () => {
        // @ts-expect-error - Embla API is mocked
        const { result } = renderHook(() => useDotButton(mockEmblaApi));
        expect(result.current.scrollSnaps).toEqual([0, 1, 2]);
        expect(result.current.selectedIndex).toBe(0);
    });

    it('should return an empty array if no Embla API is provided when calling onDotButtonClick', () => {
        const { result } = renderHook(() => useDotButton(undefined));
        act(() => {
            result.current.onDotButtonClick(1);
        });
        expect(result.current.scrollSnaps).toEqual([]);
    });

    it('should call scrollTo when calling onDotButtonClick', () => {
        // @ts-expect-error - Embla API is mocked
        const { result } = renderHook(() => useDotButton(mockEmblaApi));
        act(() => {
            result.current.onDotButtonClick(1);
        });
        expect(mockEmblaApi.scrollTo).toHaveBeenCalledWith(1);
    });
});
