import { api } from '@/hooks';
import { renderHook } from '@testing-library/react';
import { useIsAdvertiserBarred } from '..';

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({ data: {} }),
        },
    },
}));

const mockUseGetInfo = api.advertiser.useGetInfo as jest.Mock;

describe('useIsAdvertiserBarred', () => {
    it('should return false if the user is not barred', () => {
        const { result } = renderHook(() => useIsAdvertiserBarred());
        expect(result.current).toBe(false);
    });

    it('should return true if the user is barred', () => {
        mockUseGetInfo.mockReturnValue({ data: { blocked_until: 123456789 } });

        const { result } = renderHook(() => useIsAdvertiserBarred());
        expect(result.current).toBe(true);
    });
});
