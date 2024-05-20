import { TLocalize } from 'types';

export const getCounterpartiesDropdownList = (localize: TLocalize) =>
    [
        { text: localize('All'), value: 'all' },
        { text: localize('Blocked'), value: 'blocked' },
    ] as const;

export const RATE_TYPE = {
    FIXED: 'fixed',
    FLOAT: 'float',
} as const;

export const AD_ACTION = {
    ACTIVATE: 'activate',
    COPY: 'copy',
    CREATE: 'create',
    DEACTIVATE: 'deactivate',
    DELETE: 'delete',
    EDIT: 'edit',
    SHARE: 'share',
} as const;

export const ADVERT_TYPE = Object.freeze({
    BUY: 'Buy',
    SELL: 'Sell',
});

export const getSortByList = (localize: TLocalize) =>
    [
        { text: localize('Exchange rate'), value: 'rate' },
        { text: localize('User rating'), value: 'rating' },
    ] as const;

export const AD_CONDITION_TYPES = {
    COMPLETION_RATE: 'completionRates',
    JOINING_DATE: 'joiningDate',
    PREFERRED_COUNTRIES: 'preferredCountries',
} as const;

export const getAdConditionContent = (
    localize: TLocalize
): Record<string, { description: string; options?: { label: string; value: number }[]; title: string }> => {
    return {
        completionRates: {
            description: localize(
                'We’ll only show your ad to people with a completion rate higher than your selection. \n\nThe completion rate is the percentage of successful orders.'
            ),
            options: [
                { label: '50%', value: 50 },
                { label: '70%', value: 70 },
                { label: '90%', value: 90 },
            ],
            title: localize('Completion rate of more than'),
        },
        joiningDate: {
            description: localize(
                'We’ll only show your ad to people who’ve been using Deriv P2P for longer than the time you choose.'
            ),
            options: [
                { label: localize('15 days'), value: 15 },
                { label: localize('30 days'), value: 30 },
                { label: localize('60 days'), value: 60 },
            ],
            title: localize('Joined more than'),
        },
        preferredCountries: {
            description: localize('We’ll only show your ad to people in the countries you choose.'),
            title: localize('Preferred countries'),
        },
    } as const;
};
