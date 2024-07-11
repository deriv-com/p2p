import { Controller, FormProvider, NonUndefined, useForm } from 'react-hook-form';
import { TCountryListItem, TCurrency, THooks } from 'types';
import { RATE_TYPE } from '@/constants';
import { useFloatingRate } from '@/hooks';
import { AdFormInput } from '@/pages/my-ads/components/AdFormInput';
import { formatTime, getValidationRules, restrictDecimalPlace } from '@/utils';
import { useP2PCountryList } from '@deriv-com/api-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { FloatingRate } from '../FloatingRate';
import CopyAdFormDisplayWrapper from './CopyAdFormDisplayWrapper';
import './CopyAdForm.scss';

type TSavedFormValues = {
    amount: number;
    maxOrder: string;
    minOrder: string;
    rateValue: string;
};

type TCopyAdFormProps = NonUndefined<THooks.AdvertiserAdverts.Get>[0] & {
    formValues: TSavedFormValues;
} & {
    isModalOpen: boolean;
    onClickCancel: (values: TSavedFormValues) => void;
    onFormSubmit: (values: TSavedFormValues) => void;
};

type TFormValues = {
    amount: number;
    'float-rate-offset-limit': string;
    'max-order': string;
    'min-order': string;
    'rate-type-string': string;
    'rate-value': string;
};

const CopyAdForm = ({ formValues, isModalOpen, onClickCancel, onFormSubmit, ...rest }: TCopyAdFormProps) => {
    const {
        account_currency: currency,
        amount,
        description,
        eligible_countries: eligibleCountries = [],
        local_currency: localCurrency,
        min_completion_rate: minCompletionRate = 0,
        min_join_days: minJoinDays = 0,
        order_expiry_period: orderExpiryPeriod,
        payment_method_names: paymentMethodNames,
        rate_display: rateDisplay,
        type,
    } = rest;
    const { floatRateOffsetLimitString, rateType } = useFloatingRate();

    const methods = useForm<TFormValues>({
        defaultValues: {
            amount: formValues.amount || (amount ?? 0),
            'float-rate-offset-limit': floatRateOffsetLimitString,
            'max-order': formValues.maxOrder,
            'min-order': formValues.minOrder,
            'rate-type-string': rateType,
            'rate-value': formValues.rateValue || (rateType === RATE_TYPE.FLOAT ? '-0.01' : rateDisplay),
        },
        mode: 'all',
    });

    const { data: countryList = {} as TCountryListItem } = useP2PCountryList({
        refetchOnWindowFocus: false,
    });
    const {
        control,
        formState: { isValid },
        getValues,
        handleSubmit,
        trigger,
    } = methods;
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    const onSubmit = () => {
        onFormSubmit({
            amount: getValues('amount'),
            maxOrder: getValues('max-order'),
            minOrder: getValues('min-order'),
            rateValue: getValues('rate-value'),
        });
    };

    const labelSize = isDesktop ? 'xs' : 'sm';
    const valueSize = isDesktop ? 'sm' : 'md';

    const triggerValidation = (fieldNames: (keyof TFormValues)[]) => {
        // Loop through the provided field names
        fieldNames.forEach(fieldName => {
            // Check if the field has a value
            if (getValues(fieldName)) {
                // Trigger validation for the field
                trigger(fieldName);
            }
        });
    };

    const getEligibleCountriesDisplay = () => {
        if (eligibleCountries?.length === 1) {
            return (countryList[eligibleCountries[0]] as TCountryListItem)?.country_name;
        } else if (eligibleCountries?.length === Object.keys(countryList)?.length) {
            return localize('All');
        }

        return eligibleCountries?.length;
    };

    const hasCounterpartyConditions = minJoinDays > 0 || minCompletionRate > 0 || (eligibleCountries?.length ?? 0) > 0;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CopyAdFormDisplayWrapper
                    isModalOpen={isModalOpen}
                    isValid={isValid}
                    onClickCancel={() =>
                        onClickCancel({
                            amount: getValues('amount'),
                            maxOrder: getValues('max-order'),
                            minOrder: getValues('min-order'),
                            rateValue: getValues('rate-value'),
                        })
                    }
                    onSubmit={onSubmit}
                >
                    <div className='copy-ad-form'>
                        <InlineMessage variant='info'>
                            <Text size={isDesktop ? '2xs' : 'sm'}>
                                <Localize i18n_default_text='Review your settings and create a new ad. Every ad must have unique limits and rates.' />
                            </Text>
                        </InlineMessage>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Ad type' />
                            </Text>
                            <Text size={valueSize}>
                                {type === 'buy' ? (
                                    <Localize i18n_default_text='Buy' />
                                ) : (
                                    <Localize i18n_default_text='Sell' />
                                )}
                            </Text>
                        </div>
                        <div className='flex flex-col mt-[1.6rem]'>
                            <AdFormInput
                                label={localize('Total amount')}
                                name='amount'
                                rightPlaceholder={
                                    <Text color='general' size={valueSize}>
                                        {currency}
                                    </Text>
                                }
                                triggerValidationFunction={() => triggerValidation(['min-order', 'max-order'])}
                            />

                            {rateType === RATE_TYPE.FLOAT ? (
                                <Controller
                                    control={control}
                                    name='rate-value'
                                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                                        return (
                                            <FloatingRate
                                                changeHandler={e => restrictDecimalPlace(e, onChange)}
                                                errorMessages={error?.message ?? ''}
                                                fiatCurrency={currency ?? 'USD'}
                                                localCurrency={localCurrency as TCurrency}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        );
                                    }}
                                    rules={{ validate: getValidationRules('rate-value', getValues) }}
                                />
                            ) : (
                                <AdFormInput
                                    label={localize('Fixed rate')}
                                    name='rate-value'
                                    rightPlaceholder={
                                        <Text color='general' size={valueSize}>
                                            {localCurrency}
                                        </Text>
                                    }
                                />
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <AdFormInput
                                label={localize('Min order')}
                                name='min-order'
                                rightPlaceholder={
                                    <Text color='general' size={valueSize}>
                                        {currency}
                                    </Text>
                                }
                                triggerValidationFunction={() => triggerValidation(['amount', 'max-order'])}
                            />
                            <AdFormInput
                                label={localize('Max order')}
                                name='max-order'
                                rightPlaceholder={
                                    <Text color='general' size={valueSize}>
                                        {currency}
                                    </Text>
                                }
                                triggerValidationFunction={() => triggerValidation(['amount', 'min-order'])}
                            />
                        </div>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Instructions' />
                            </Text>
                            <Text size={valueSize}>{description || '-'}</Text>
                        </div>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Order must be completed in' />
                            </Text>
                            <Text size={valueSize}>{formatTime(orderExpiryPeriod ?? 3600, localize)}</Text>
                        </div>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Payment methods' />
                            </Text>
                            <Text size={valueSize}>{paymentMethodNames?.join(', ') ?? '-'}</Text>
                        </div>
                        {hasCounterpartyConditions && (
                            <div className='flex flex-col w-full mt-[1.6rem]'>
                                <Text color='less-prominent' size={labelSize}>
                                    <Localize i18n_default_text='Counterparty conditions' />
                                </Text>
                                <Text as='ul' size={valueSize}>
                                    {minJoinDays > 0 && (
                                        <li>
                                            <Localize
                                                components={[<strong key={0} />]}
                                                i18n_default_text='Joined more than <0>{{minJoinDays}} days</0>'
                                                values={{ minJoinDays }}
                                            />
                                        </li>
                                    )}
                                    {minCompletionRate > 0 && (
                                        <li>
                                            <Localize
                                                components={[<strong key={0} />]}
                                                i18n_default_text='Completion rate of more than <0>{{minCompletionRate}}%</0>'
                                                values={{ minCompletionRate }}
                                            />
                                        </li>
                                    )}
                                    {eligibleCountries?.length > 0 && (
                                        <li>
                                            <Localize
                                                components={[<strong key={0} />]}
                                                i18n_default_text='Preferred countries <0>({{eligibleCountriesDisplay}})</0>'
                                                values={{
                                                    eligibleCountriesDisplay: getEligibleCountriesDisplay(),
                                                }}
                                            />
                                        </li>
                                    )}
                                </Text>
                            </div>
                        )}
                    </div>
                </CopyAdFormDisplayWrapper>
            </form>
        </FormProvider>
    );
};

export default CopyAdForm;
