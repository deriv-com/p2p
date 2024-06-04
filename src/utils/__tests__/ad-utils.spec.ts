import { TCurrency, TPaymentFieldType, TWalletType } from 'types';
import { getEligibilityErrorMessage, getFilteredCountryList } from '../ad-utils';

type TNumber = 0 | 1;
type TStatus = 'disabled' | 'enabled';

describe('ad-utils', () => {
    describe('getFilteredCountryList', () => {
        it('should return an empty object with empty country list', () => {
            const countryList = {};
            const result = getFilteredCountryList(countryList);
            expect(result).toEqual({});
        });
        it('should return the filtered country list based on the payment methods availability', () => {
            const mockCountryList = {
                countryA: {
                    country_name: 'countryA',
                    cross_border_ads_enabled: 1 as TNumber,
                    fixed_rate_adverts: 'enabled' as TStatus,
                    float_rate_adverts: 'disabled' as TStatus,
                    float_rate_offset_limit: 10,
                    local_currency: 'CA' as TCurrency,
                    payment_methods: {
                        alipay: {
                            display_name: 'Alipay',
                            fields: {
                                account: {
                                    display_name: 'Alipay ID',
                                    required: 1,
                                    type: 'text' as TPaymentFieldType,
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo' as TPaymentFieldType,
                                },
                            },
                            id: '3',
                            type: 'ewallet' as TWalletType,
                        },
                    },
                },
                countryB: {
                    country_name: 'countryB',
                    cross_border_ads_enabled: 1 as TNumber,
                    fixed_rate_adverts: 'enabled' as TStatus,
                    float_rate_adverts: 'disabled' as TStatus,
                    float_rate_offset_limit: 10,
                    local_currency: 'CB' as TCurrency,
                    payment_methods: {
                        bank_transfer: {
                            display_name: 'Bank Transfer',
                            fields: {
                                account: {
                                    display_name: 'Bank Account',
                                    required: 1,
                                    type: 'text' as TPaymentFieldType,
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo' as TPaymentFieldType,
                                },
                            },
                            id: '2',
                            type: 'other' as TWalletType,
                        },
                    },
                },
            };

            const expectedResult = {
                countryB: { ...mockCountryList.countryB },
            };

            const result = getFilteredCountryList(mockCountryList, ['bank_transfer']);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('getEligibilityErrorMessage', () => {
        it('should return the corresponding error message based on the error code', () => {
            const result = getEligibilityErrorMessage(['join_date']);
            expect(result).toEqual("You've not used Deriv P2P long enough for this ad.");
        });
        it('should return the default error message when the error code is not found', () => {
            const result = getEligibilityErrorMessage(['unknown_error']);
            expect(result).toEqual("The advertiser has set conditions for this ad that you don't meet.");
        });
    });
});
