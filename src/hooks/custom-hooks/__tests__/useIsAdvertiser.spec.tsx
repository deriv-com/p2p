import { api } from '@/hooks';
import { renderHook } from '@testing-library/react';
import useIsAdvertiser from '../useIsAdvertiser';

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({
                data: {
                    currency: 'USD',
                },
                isLoading: false,
                subscribe: jest.fn(),
                unsubscribe: jest.fn(),
            }),
        },
    },
}));

const mockUseGetInfo = api.advertiser.useGetInfo as jest.MockedFunction<typeof api.advertiser.useGetInfo>;

describe('useIsAdvertiser', () => {
    it('should return true if data is not empty and there is no error in the response', () => {
        const { result } = renderHook(() => useIsAdvertiser());
        expect(result.current).toBeTruthy();
    });

    it('should return false if error.code is AdvertiserNotFound, and data is empty', () => {
        (mockUseGetInfo as jest.Mock).mockReturnValueOnce({
            ...mockUseGetInfo,
            data: {},
            error: {
                code: 'AdvertiserNotFound',
            },
        });

        const { result } = renderHook(() => useIsAdvertiser());
        expect(result.current).toBeFalsy();
    });
});
