import { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { TCountryListItem, TCurrency } from 'types';
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
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: () => void;
    initialPaymentMethods: number[] | string[];
    localCurrency?: TCurrency;
    rateType: string;
};

const AdConditionsSection = ({
    countryList,
    currency,
    initialPaymentMethods,
    localCurrency,
    rateType,
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
    const labelSize = isDesktop ? 'sm' : 'md';

    const onClickBlockSelector = (value: number, type: string) => {
        if (type === AD_CONDITION_TYPES.JOINING_DATE) {
            setValue('min-join-days', value);
        } else {
            setValue('min-completion-rate', value);
        }
    };

    const minJoinDays = watch('min-join-days');
    const minCompletionRate = watch('min-completion-rate');

    const isPaymentMethodsSame = () =>
        initialPaymentMethods.length === selectedMethods.length &&
        initialPaymentMethods.sort().every((value, index) => value === selectedMethods.sort()[index]);
    return (
        <div className='ad-conditions-section'>
            <AdSummary
                currency={currency}
                localCurrency={localCurrency as TCurrency}
                offerAmount={errors.amount ? '' : getValues('amount')}
                priceRate={getValues('rate-value')}
                rateType={rateType}
                type={getValues('ad-type')}
            />
            <div className='flex flex-col my-[2.4rem]'>
                <Text color='prominent' size={labelSize}>
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
                isNextButtonDisabled={!isEmptyObject(errors) || (!isDirty && isPaymentMethodsSame())}
            />
        </div>
    );
};

export default AdConditionsSection;
