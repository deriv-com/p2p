import { ChangeEvent, FocusEvent } from 'react';
import { TCurrency } from 'types';
import { api } from '@/hooks';
import { mobileOSDetect, percentOf, removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import InputField from '../InputField';
import './FloatingRate.scss';

type TFloatingRate = {
    changeHandler?: (event: ChangeEvent<HTMLInputElement>) => void;
    errorMessages: string;
    fiatCurrency: string;
    localCurrency: TCurrency;
    name?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
};

const FloatingRate = ({
    changeHandler,
    errorMessages,
    fiatCurrency,
    localCurrency,
    name,
    onChange,
    value,
}: TFloatingRate) => {
    const { exchangeRate } = api.exchangeRates.useGet(localCurrency);
    const { isDesktop, isMobile } = useDevice();

    const { data: p2pSettings } = api.settings.useSettings();
    const overrideExchangeRate = p2pSettings?.override_exchange_rate;

    const marketRate = overrideExchangeRate ? Number(overrideExchangeRate) : exchangeRate ?? 1;
    const os = mobileOSDetect();
    const marketFeed = value ? percentOf(marketRate, Number(value) || 0) : marketRate;
    const decimalPlace = setDecimalPlaces(marketFeed, 6);
    const textSize = isDesktop ? 'xs' : 'sm';

    // Input mask for formatting value on blur of floating rate field
    const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
        let floatRate = event.target.value;
        if (!isNaN(parseFloat(floatRate)) && floatRate.trim().length) {
            floatRate = parseFloat(floatRate).toFixed(2);
            if (/^\d+/.test(floatRate) && parseFloat(floatRate) > 0) {
                // Assign + symbol for positive rate
                event.target.value = `+${floatRate}`;
            } else {
                event.target.value = floatRate;
            }
        }
        onChange(event);
    };

    return (
        <div className='floating-rate'>
            <div className='floating-rate__field'>
                <Text as='div' className='floating-rate__field--prefix' size={isDesktop ? 'md' : 'lg'}>
                    <Localize i18n_default_text='at' />
                </Text>
                <InputField
                    decimalPointChange={2}
                    isError={!!errorMessages}
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={changeHandler}
                    type={isMobile && os !== 'iOS' ? 'tel' : 'number'}
                    value={value ?? ''}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text className='floating-rate__mkt-rate--label' size={textSize}>
                        <Localize i18n_default_text='of the market rate' />
                    </Text>
                    <Text className='floating-rate__mkt-rate--msg' color='prominent' size={textSize}>
                        1 {fiatCurrency} ={' '}
                        {removeTrailingZeros(
                            FormatUtils.formatMoney(marketRate, {
                                currency: localCurrency,
                                decimalPlaces: decimalPlace,
                            })
                        )}
                    </Text>
                </div>
            </div>
            {errorMessages ? (
                <Text as='div' className='floating-rate__error-message' color='red' size={textSize}>
                    {errorMessages}
                </Text>
            ) : (
                <Text as='div' className='floating-rate__hint' color='blue' size={textSize}>
                    <Localize i18n_default_text='Your rate is = ' />
                    {removeTrailingZeros(
                        FormatUtils.formatMoney(Number(roundOffDecimal(marketFeed, decimalPlace)), {
                            currency: localCurrency,
                            decimalPlaces: decimalPlace,
                        })
                    )}{' '}
                    {localCurrency}
                </Text>
            )}
        </div>
    );
};

export default FloatingRate;
