import { MouseEventHandler, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { TCountryListItem, TCurrency, TInitialData } from 'types';
import { AD_CONDITION_TYPES } from '@/constants';
import { isEmptyObject } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { AdConditionBlockSelector } from '../AdConditionBlockSelector';
import { AdFormController } from '../AdFormController';
import { AdSummary } from '../AdSummary';
import { PreferredCountriesSelector } from '../PreferredCountriesSelector';
import './AdCondtionsSection.scss';

type TAdConditionsSection = {
    countryList: TCountryListItem;
    currency: TCurrency;
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToFirstStep: () => void;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: () => void;
    initialData: TInitialData;
    localCurrency?: TCurrency;
    rateType: string;
    setShouldReset: (shouldReset: boolean) => void;
    shouldReset: boolean;
};

const AdConditionsSection = ({
    countryList,
    currency,
    initialData,
    localCurrency,
    rateType,
    setShouldReset,
    shouldReset,
    ...props
}: TAdConditionsSection) => {
    const {
        formState: { errors, isDirty },
        getValues,
        setValue,
        watch,
    } = useFormContext();
    const { isDesktop } = useDevice();
    const selectedMethods = getValues('payment-method') ?? [];
    const preferedCountries = getValues('preferred-countries') ?? [];
    const labelSize = isDesktop ? 'sm' : 'md';

    useEffect(() => {
        if (shouldReset) {
            props.goToFirstStep();
            setShouldReset(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldReset]);

    const onClickBlockSelector = (value: number, type: string) => {
        if (type === AD_CONDITION_TYPES.JOINING_DATE) {
            if (getValues('min-join-days') == value) {
                setValue('min-join-days', null);
            } else {
                setValue('min-join-days', value);
            }
        } else if (getValues('min-completion-rate') == value) {
            setValue('min-completion-rate', null);
        } else {
            setValue('min-completion-rate', value);
        }
    };

    const minJoinDays = watch('min-join-days');
    const minCompletionRate = watch('min-completion-rate');

    const isPaymentMethodsSame = () =>
        initialData?.paymentMethod.length === selectedMethods.length &&
        initialData?.paymentMethod.sort().every((value, index) => value === selectedMethods.sort()[index]);

    const isMinCompletionRateSame = () => (minCompletionRate?.toString() ?? null) === initialData.minCompletionRate;

    const isMinJoinDaysSame = () => (minJoinDays?.toString() ?? null) === initialData.minJoinDays;

    const isPreferredCountriesSame = () =>
        initialData?.selectedCountries.length === preferedCountries.length &&
        initialData?.selectedCountries.sort().every((value, index) => value === preferedCountries.sort()[index]);

    return (
        <div className='ad-conditions-section'>
            <AdSummary
                adRateType={getValues('ad-rate-type')}
                currency={currency}
                localCurrency={localCurrency as TCurrency}
                offerAmount={errors.amount ? '' : getValues('amount')}
                priceRate={getValues('rate-value')}
                rateType={rateType}
                type={getValues('ad-type')}
            />
            <div className='flex flex-col my-[2.4rem]'>
                <Text color='general' size={labelSize}>
                    <Localize i18n_default_text='Counterparty conditions (optional)' />
                </Text>
                <Text color='less-prominent' size={labelSize}>
                    <Localize i18n_default_text='Only users who match these criteria will see your ad.' />
                </Text>
            </div>
            <AdConditionBlockSelector
                onClick={value => onClickBlockSelector(value, AD_CONDITION_TYPES.JOINING_DATE)}
                selectedValue={minJoinDays && Number(minJoinDays)}
                type={AD_CONDITION_TYPES.JOINING_DATE}
            />
            <AdConditionBlockSelector
                onClick={value => onClickBlockSelector(value, AD_CONDITION_TYPES.COMPLETION_RATE)}
                selectedValue={minCompletionRate && Number(minCompletionRate)}
                type={AD_CONDITION_TYPES.COMPLETION_RATE}
            />
            <PreferredCountriesSelector countryList={countryList} type={AD_CONDITION_TYPES.PREFERRED_COUNTRIES} />
            <AdFormController
                {...props}
                isNextButtonDisabled={
                    !isEmptyObject(errors) ||
                    (isPaymentMethodsSame() &&
                        isMinCompletionRateSame() &&
                        isMinJoinDaysSame() &&
                        isPreferredCountriesSame() &&
                        !isDirty)
                }
            />
        </div>
    );
};

export default AdConditionsSection;
