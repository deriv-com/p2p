import { Controller, FormProvider, NonUndefined, useForm } from 'react-hook-form';
import { TCountryListItem, TCurrency, THooks } from 'types';
import { RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { AdFormInput } from '@/pages/my-ads/components/AdFormInput';
import { formatTime, getValidationRules, restrictDecimalPlace } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { FloatingRate } from '../FloatingRate';
import CopyAdFormDisplayWrapper from './CopyAdFormDisplayWrapper';
import './CopyAdForm.scss';

type TCopyAdFormProps = NonUndefined<THooks.AdvertiserAdverts.Get>[0] & {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const CopyAdForm = ({ isModalOpen, onRequestClose, ...rest }: TCopyAdFormProps) => {
    const methods = useForm({ mode: 'all' });
    const { data: countryList = {} as TCountryListItem } = api.countryList.useGet();
    const { control, getValues, handleSubmit, trigger } = methods;
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const {
        account_currency: currency,
        description,
        eligible_countries: eligibleCountries = [],
        local_currency: localCurrency,
        min_completion_rate: minCompletionRate = 0,
        min_join_days: minJoinDays = 0,
        order_expiry_period: orderExpiryPeriod,
        payment_method_names: paymentMethodNames,
        rate_type: rateType,
        type,
    } = rest;

    const onSubmit = () => {};
    const labelSize = isMobile ? 'sm' : 'xs';
    const valueSize = isMobile ? 'md' : 'sm';

    const triggerValidation = (fieldNames: string[]) => {
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
                <CopyAdFormDisplayWrapper isModalOpen={isModalOpen} onRequestClose={onRequestClose}>
                    <div className='copy-ad-form'>
                        <InlineMessage variant='info'>
                            <Text size={isMobile ? 'xs' : '2xs'}>
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
                        <div className='flex flex-col'>
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
                            <Text size={valueSize}>{description ?? ''}</Text>
                        </div>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Order must be completed in' />
                            </Text>
                            <Text size={valueSize}>{formatTime(orderExpiryPeriod ?? 3600)}</Text>
                        </div>
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Payment methods' />
                            </Text>
                            <Text size={valueSize}>{paymentMethodNames?.join(', ') ?? '-'}</Text>
                        </div>
                        {hasCounterpartyConditions && (
                            <>
                                <Text color='less-prominent' size='xs'>
                                    <Localize i18n_default_text='Counterparty conditions' />
                                </Text>
                                <Text as='ul' className='copy-advert-form__list' color='prominent' size='xs'>
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
                                                i18n_default_text='Preferred countries <0>({{eligible_countries_display}})</0>'
                                                values={{
                                                    eligible_countries_display: getEligibleCountriesDisplay(),
                                                }}
                                            />
                                        </li>
                                    )}
                                </Text>
                            </>
                        )}
                        <div className='flex flex-col w-full mt-[1.6rem]'>
                            <Text color='less-prominent' size={labelSize}>
                                <Localize i18n_default_text='Counterparty conditions' />
                            </Text>
                            <Text size={valueSize}>{''}</Text>
                        </div>
                    </div>
                </CopyAdFormDisplayWrapper>
            </form>
        </FormProvider>
    );
};

export default CopyAdForm;
