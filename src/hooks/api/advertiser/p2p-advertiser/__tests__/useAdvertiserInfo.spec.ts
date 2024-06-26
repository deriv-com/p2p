import { useSubscribe } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useAdvertiserInfo from '../useAdvertiserInfo';

jest.mock('@deriv-com/api-hooks', () => ({
    useSubscribe: jest.fn(() => undefined),
}));

const mockUseSubscribe = useSubscribe as jest.Mock;

describe('useAdvertiserInfo', () => {
    it('should return an empty data object if useSubscribe returns undefined', () => {
        const { result } = renderHook(() => useAdvertiserInfo());
        expect(result.current.data).toEqual({});
    });

    it('should return an empty data object if data from useSubscribe is undefined', () => {
        mockUseSubscribe.mockReturnValue({
            data: undefined,
            error: undefined,
            subscribe: jest.fn(),
        });
        const { result } = renderHook(() => useAdvertiserInfo());
        expect(result.current.data).toEqual({});
    });

    it('should return an empty data object if data.p2p_advertiser_info from useSubscribe is undefined', () => {
        mockUseSubscribe.mockReturnValue({
            data: {},
            error: undefined,
            subscribe: jest.fn(),
        });
        const { result } = renderHook(() => useAdvertiserInfo());
        expect(result.current.data).toEqual({});
    });

    it('should return data from useSubscribe if it is defined', () => {
        const data = {
            p2p_advertiser_info: {
                basic_verification: 1,
                full_verification: 1,
                is_approved: 1,
                is_blocked: 0,
                is_favourite: 0,
                is_listed: 1,
                is_online: 1,
                show_name: 1,
            },
        };
        mockUseSubscribe.mockReturnValue({
            data,
            error: undefined,
            subscribe: jest.fn(),
        });
        const { result } = renderHook(() => useAdvertiserInfo());
        expect(result.current.data).toEqual({
            ...data.p2p_advertiser_info,
            hasBasicVerification: true,
            hasFullVerification: true,
            isApprovedBoolean: true,
            isBlockedBoolean: false,
            isFavouriteBoolean: false,
            isListedBoolean: true,
            isOnlineBoolean: true,
            shouldShowName: true,
        });
    });

    it('should return an empty data object if error from useSubscribe is defined', () => {
        mockUseSubscribe.mockReturnValue({
            data: undefined,
            error: 'error',
            subscribe: jest.fn(),
        });
        const { result } = renderHook(() => useAdvertiserInfo());
        expect(result.current.data).toEqual({});
    });
});
