import { act, renderHook, waitFor } from '@testing-library/react';
import useCopyToClipboard from '../useCopyToClipboard';

const mockCopyFunction = async (text: string) => {
    return text === 'error' ? Promise.reject() : Promise.resolve();
};

const mockCopyToClipboardData = [
    '',
    async (text: string) => {
        return mockCopyFunction(text);
    },
];

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(() => mockCopyToClipboardData),
}));

describe('useCopyToClipboard', () => {
    it('should return default values', () => {
        const { result } = renderHook(() => useCopyToClipboard());
        expect(result.current).toEqual([false, expect.any(Function), expect.any(Function)]);
    });

    it('should set isCopied to true on successful copy', async () => {
        const { result } = renderHook(() => useCopyToClipboard());
        const [, copyToClipboard] = result.current;

        act(() => {
            copyToClipboard('Test text').catch(() => {});
        });

        await waitFor(() => {
            expect(result.current[0]).toBe(true);
        });
    });

    it('should set isCopied to false on failed copy', async () => {
        const { result } = renderHook(() => useCopyToClipboard());
        const [, copyToClipboard] = result.current;

        act(() => {
            copyToClipboard('error');
        });

        await waitFor(() => {
            expect(result.current[0]).toBe(false);
        });
    });
});
