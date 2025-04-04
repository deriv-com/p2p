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

export const getSortByList = (localize: TLocalize, isBuyTab: boolean) =>
    [
        {
            text: isBuyTab ? localize('Exchange rate (low-high)') : localize('Exchange rate (high-low)'),
            value: 'rate',
        },
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
    const completionRateStatement1 = localize(
        'We’ll only show your ad to people with a completion rate higher than your selection.'
    );
    const completionRateStatement2 = localize('The completion rate is the percentage of successful orders.');
    return {
        completionRates: {
            description: `${completionRateStatement1}\n\n${completionRateStatement2}`,
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

type TShareAdsMessage = {
    adRateType: string;
    advertUrl: string;
    firstCurrency?: string;
    localize: TLocalize;
    rateDisplay?: string;
    secondCurrency?: string;
};

export const getShareAdsMessage = ({
    adRateType,
    advertUrl,
    firstCurrency = 'USD',
    localize,
    rateDisplay = '0.0',
    secondCurrency = 'USD',
}: TShareAdsMessage) => {
    const message1 = localize(
        "Hi! I'd like to exchange {{firstCurrency}} for {{secondCurrency}} at {{rateDisplay}}{{adRateType}} on Deriv P2P.",
        {
            adRateType,
            firstCurrency,
            rateDisplay,
            secondCurrency,
        }
    );
    const message2 = localize("If you're interested, check out my ad 👉");
    const message3 = localize('Thanks!');
    return `${message1}\n\n${message2}\n\n${advertUrl}\n\n${message3}`;
};
