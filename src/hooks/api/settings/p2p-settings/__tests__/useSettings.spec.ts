import { useSubscribe } from '@deriv-com/api-hooks';
import { renderHook } from '@testing-library/react';
import useSettings from '../useSettings';

jest.mock('@deriv-com/api-hooks', () => ({
    useSubscribe: jest.fn(() => ({ data: undefined })),
}));

const mockUseSubscribe = useSubscribe as jest.Mock;

const mockData = {
    data: {
        p2p_settings: {
            cross_border_ads_enabled: 1,
            disabled: 0,
            fixed_rate_adverts_end_date: '2021-12-31',
            float_rate_adverts: 'enabled',
            float_rate_offset_limit: 1,
            local_currencies: [
                {
                    display_name: 'Indonesian Rupiah',
                    has_adverts: 1,
                    is_default: 1,
                    symbol: 'IDR',
                },
                {
                    display_name: 'Indian Rupee',
                    symbol: 'INR',
                },
            ],
            payment_methods_enabled: 1,
        },
    },
};

describe('useSettings', () => {
    it('should return an empty object if data returned from useSubscribe is undefined', () => {
        const { result } = renderHook(() => useSettings());
        expect(result.current.data).toEqual({});
    });

    it('should return an empty object if data.p2p_settings is undefined', async () => {
        mockUseSubscribe.mockReturnValue({
            data: {
                p2p_settings: undefined,
            },
        });

        const { result } = renderHook(() => useSettings());
        expect(result.current.data).toEqual({});
    });

    it('should return the correct data when data is returned from useSubscribe', () => {
        mockUseSubscribe.mockReturnValue(mockData);

        const { result } = renderHook(() => useSettings());
        expect(result.current.data).toEqual({
            ...mockData.data.p2p_settings,
            currencyList: [
                {
                    display_name: 'Indonesian Rupiah',
                    has_adverts: 1,
                    is_default: 1,
                    text: 'IDR',
                    value: 'IDR',
                },
            ],
            floatRateOffsetLimitString: '1.00',
            isCrossBorderAdsEnabled: true,
            isDisabled: false,
            isPaymentMethodsEnabled: true,
            localCurrency: 'IDR',
            rateType: 'float',
            reachedTargetDate: true,
        });
    });

    it('should return reachedTargetDate as false if fixed_rate_adverts_end_date is undefined', () => {
        mockUseSubscribe.mockReturnValue({
            data: {
                p2p_settings: {
                    ...mockData.data.p2p_settings,
                    fixed_rate_adverts_end_date: undefined,
                },
            },
        });

        const { result } = renderHook(() => useSettings());
        expect(result?.current?.data?.reachedTargetDate).toBeFalsy();
    });

    it('should round float_rate_offset_limit to 2 decimal places if float_rate_offset_limit decimal places are more than 2', () => {
        mockUseSubscribe.mockReturnValue({
            data: {
                p2p_settings: {
                    ...mockData.data.p2p_settings,
                    float_rate_offset_limit: 1.2345,
                },
            },
        });

        const { result } = renderHook(() => useSettings());
        expect(result?.current?.data?.floatRateOffsetLimitString).toBe('1.23');
    });

    it('should return rateType as fixed if float_rate_adverts is disabled', () => {
        mockUseSubscribe.mockReturnValue({
            data: {
                p2p_settings: {
                    ...mockData.data.p2p_settings,
                    float_rate_adverts: 'disabled',
                },
            },
        });

        const { result } = renderHook(() => useSettings());
        expect(result?.current?.data?.rateType).toBe('fixed');
    });
});
