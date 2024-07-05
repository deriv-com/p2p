import { TCurrency } from 'types';
import { AD_ACTION, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { percentOf, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';

type TAdSummaryProps = {
    adRateType?: string; // ratetype for the ad when action is edit
    currency: TCurrency;
    localCurrency: TCurrency;
    offerAmount: string;
    priceRate: number;
    rateType: string;
    type: string;
};

const AdSummary = ({
    adRateType = '',
    currency,
    localCurrency,
    offerAmount,
    priceRate,
    rateType,
    type,
}: TAdSummaryProps) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { queryString } = useQueryString();
    const adOption = queryString.formAction;
    const { data: p2pSettings } = api.settings.useSettings();
    const { exchangeRate } = api.exchangeRates.useGet(localCurrency);
    const overrideExchangeRate = p2pSettings?.override_exchange_rate;

    const marketRateType = adOption === AD_ACTION.CREATE ? rateType : adRateType;
    const displayOfferAmount = offerAmount ? FormatUtils.formatMoney(Number(offerAmount), { currency }) : '';
    const adText = adOption === AD_ACTION.CREATE ? localize('creating') : localize('editing');
    const adTypeText = type;

    let displayPriceRate: number | string = '';
    let displayTotal = '';

    const marketRate = overrideExchangeRate ? Number(overrideExchangeRate) : exchangeRate;
    const marketFeed = marketRateType === RATE_TYPE.FLOAT ? marketRate : null;
    const summaryTextSize = isDesktop ? 'sm' : 'md';

    if (priceRate) {
        displayPriceRate = marketFeed ? roundOffDecimal(percentOf(marketFeed, priceRate), 6) : priceRate;
    }

    if (offerAmount) {
        if (priceRate) {
            displayTotal = FormatUtils.formatMoney(
                Number(offerAmount) * Number(marketFeed ? displayPriceRate : priceRate),
                { currency: localCurrency }
            );
            const formattedPriceRate = FormatUtils.formatMoney(Number(displayPriceRate), {
                currency: localCurrency,
                decimalPlaces: setDecimalPlaces(Number(displayPriceRate), 6),
            });
            return (
                <Text color='less-prominent' size={summaryTextSize}>
                    <Localize
                        i18n_default_text='You’re {{adText}} an ad to {{adTypeText}}'
                        values={{ adText, adTypeText }}
                    />
                    <Text color='blue' size={summaryTextSize} weight='bold'>
                        {` ${displayOfferAmount} ${currency} `}
                    </Text>
                    <Localize i18n_default_text='for' />
                    <Text color='blue' size={summaryTextSize} weight='bold'>
                        {` ${displayTotal} ${localCurrency}`}
                    </Text>
                    <Text color='blue' size={summaryTextSize}>
                        {` (${formattedPriceRate} ${localCurrency}/${currency})`}
                    </Text>
                </Text>
            );
        }

        return (
            <Text color='less-prominent' size={summaryTextSize}>
                <Localize
                    i18n_default_text='You’re {{adText}} an ad to {{adTypeText}}'
                    values={{ adText, adTypeText }}
                />
                <Text color='blue' size={summaryTextSize} weight='bold'>
                    {` ${displayOfferAmount} ${currency}`}
                </Text>
                ...
            </Text>
        );
    }

    return (
        <Text color='less-prominent' size={summaryTextSize}>
            <Localize
                i18n_default_text='You’re {{adText}} an ad to {{adTypeText}}...'
                values={{ adText, adTypeText }}
            />
        </Text>
    );
};

export default AdSummary;
