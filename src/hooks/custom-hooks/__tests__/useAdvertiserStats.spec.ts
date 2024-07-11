import { renderHook } from '@testing-library/react';
import useAdvertiserStats from '../useAdvertiserStats';

const mockUseGetInfo = {
    data: {},
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
};

const mockUseAuthentication = {
    data: {
        document: {
            status: 'none',
        },
        identity: {
            status: 'none',
        },
    },
    isSuccess: false,
};

const mockUseGetSettings = {
    data: {},
    isSuccess: false,
};

const mockUseAdvertiserInfoState = {
    error: undefined,
    isIdle: false,
    isLoading: false,
    isSubscribed: false,
};

jest.mock('@deriv-com/api-hooks', () => ({
    useGetSettings: jest.fn(() => mockUseGetSettings),
}));

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                data: { currency: 'USD' },
            })),
            useAuthentication: jest.fn(() => mockUseAuthentication),
        },
        advertiser: {
            useGetInfo: jest.fn(() => mockUseGetInfo),
        },
    },
}));

jest.mock('@/providers/AdvertiserInfoStateProvider', () => ({
    useAdvertiserInfoState: jest.fn(() => mockUseAdvertiserInfoState),
}));

describe('useAdvertiserStats', () => {
    it('should return undefined if the data is not ready', () => {
        const { result } = renderHook(() => useAdvertiserStats());
        expect(result.current.data).toBeUndefined();
    });

    it('should return default values if the data is not ready but isSubscribed and isSuccess are true', () => {
        mockUseGetInfo.data = {
            isApprovedBoolean: false,
        };
        mockUseAdvertiserInfoState.isSubscribed = true;
        mockUseGetSettings.isSuccess = true;
        mockUseAuthentication.isSuccess = true;

        const { result } = renderHook(() => useAdvertiserStats());
        expect(result.current.data).toEqual({
            averagePayTime: -1,
            averageReleaseTime: -1,
            buy_completion_rate: undefined,
            buy_orders_amount: undefined,
            buy_orders_count: undefined,
            buy_time_avg: undefined,
            buyCompletionRate: 0,
            buyOrdersCount: 0,
            created_time: undefined,
            daily_buy: undefined,
            daily_buy_limit: undefined,
            daily_sell: undefined,
            daily_sell_limit: undefined,
            dailyAvailableBuyLimit: 0,
            dailyAvailableSellLimit: 0,
            daysSinceJoined: 0,
            fullName: ' ',
            hasBasicVerification: undefined,
            hasFullVerification: undefined,
            isAddressVerified: false,
            isAdvertiser: false,
            isApprovedBoolean: false,
            isEligibleForLimitUpgrade: false,
            isIdentityVerified: false,
            partner_count: undefined,
            release_time_avg: undefined,
            sell_completion_rate: undefined,
            sell_orders_amount: undefined,
            sell_orders_count: undefined,
            sellCompletionRate: 0,
            sellOrdersCount: 0,
            total_orders_count: undefined,
            total_turnover: undefined,
            totalOrders: 0,
            totalOrdersLifetime: 0,
            tradePartners: 0,
            tradeVolume: 0,
            tradeVolumeLifetime: 0,
            upgradable_daily_limits: undefined,
        });
    });

    it('should return the transformed data if the data is ready', () => {
        mockUseGetInfo.data = {
            buy_completion_rate: 0.5,
            buy_orders_amount: 1000,
            buy_orders_count: 10,
            buy_time_avg: 120,
            created_time: Math.floor(Date.now() / 1000),
            daily_buy: 50,
            daily_buy_limit: 100,
            daily_sell: 50,
            daily_sell_limit: 100,
            hasBasicVerification: true,
            hasFullVerification: true,
            isApprovedBoolean: true,
            partner_count: 10,
            release_time_avg: 180,
            sell_completion_rate: 0.5,
            sell_orders_amount: 1000,
            sell_orders_count: 10,
            total_orders_count: 20,
            total_turnover: 2000,
            upgradable_daily_limits: {
                max_daily_buy: 1000,
                max_daily_sell: 1000,
            },
        };

        mockUseAdvertiserInfoState.isSubscribed = true;

        mockUseGetSettings.data = {
            first_name: 'John',
            last_name: 'Doe',
        };
        mockUseGetSettings.isSuccess = true;

        mockUseAuthentication.data = {
            document: {
                status: 'none',
            },
            identity: {
                status: 'none',
            },
        };
        mockUseAuthentication.isSuccess = true;

        const { result } = renderHook(() => useAdvertiserStats());
        expect(result.current.data).toEqual({
            averagePayTime: 2,
            averageReleaseTime: 3,
            buy_completion_rate: 0.5,
            buy_orders_amount: 1000,
            buy_orders_count: 10,
            buy_time_avg: 120,
            buyCompletionRate: 0.5,
            buyOrdersCount: 10,
            created_time: Math.floor(Date.now() / 1000),
            daily_buy: 50,
            daily_buy_limit: 100,
            daily_sell: 50,
            daily_sell_limit: 100,
            dailyAvailableBuyLimit: 50,
            dailyAvailableSellLimit: 50,
            daysSinceJoined: 0,
            fullName: 'John Doe',
            hasBasicVerification: true,
            hasFullVerification: true,
            isAddressVerified: true,
            isAdvertiser: true,
            isApprovedBoolean: true,
            isEligibleForLimitUpgrade: true,
            isIdentityVerified: true,
            partner_count: 10,
            release_time_avg: 180,
            sell_completion_rate: 0.5,
            sell_orders_amount: 1000,
            sell_orders_count: 10,
            sellCompletionRate: 0.5,
            sellOrdersCount: 10,
            total_orders_count: 20,
            total_turnover: 2000,
            totalOrders: 20,
            totalOrdersLifetime: 20,
            tradePartners: 10,
            tradeVolume: 2000,
            tradeVolumeLifetime: 2000,
            upgradable_daily_limits: {
                max_daily_buy: 1000,
                max_daily_sell: 1000,
            },
        });
    });

    it('should return 1 if buy_time_avg and release_time_avg are less than 60', () => {
        mockUseGetInfo.data = {
            buy_time_avg: 30,
            release_time_avg: 30,
        };

        const { result } = renderHook(() => useAdvertiserStats());

        expect(result?.current?.data?.averagePayTime).toEqual(1);
        expect(result?.current?.data?.averageReleaseTime).toEqual(1);
    });

    it('should call subscribe if advertiserId is passed', () => {
        renderHook(() => useAdvertiserStats('123'));
        expect(mockUseGetInfo.subscribe).toHaveBeenCalledTimes(1);
    });
});
