import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { NonUndefinedValues, TCountryListItem, TCurrency, TErrorCodes, THooks, TLocalize } from 'types';
import { AdCancelCreateEditModal, AdCreateEditErrorModal, AdCreateEditSuccessModal } from '@/components/Modals';
import { MY_ADS_URL, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useFloatingRate, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { useP2PCountryList } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import { AdWizard } from '../../components';
import './CreateEditAd.scss';

const getSteps = (localize: TLocalize, isEdit = false) => {
    const text = isEdit ? localize('Edit') : localize('Set');
    const steps = [
        { header: { title: localize('{{text}} ad type and amount', { text }) } },
        { header: { title: localize('{{text}} payment details', { text }) } },
        { header: { title: localize('{{text}} ad conditions', { text }) } },
    ];
    return steps;
};
type FormValues = {
    'ad-type': 'buy' | 'sell';
    amount: string;
    'contact-details': string;
    'float-rate-offset-limit': string;
    'form-type': 'create' | 'edit';
    instructions: string;
    'max-order': string;
    'min-completion-rate': string;
    'min-join-days': string;
    'min-order': string;
    'order-completion-time': string;
    'payment-method': number[] | string[];
    'preferred-countries': string[];
    'rate-type-string': string;
    'rate-value': string;
};

type TMutatePayload = Parameters<THooks.Advert.Create>[0];
type TFormValuesInfo = NonUndefinedValues<THooks.Advert.Get>;

const CreateEditAd = () => {
    const { queryString } = useQueryString();
    const { localize } = useTranslations();
    const { advertId = '' } = queryString;
    const { data: advertInfo, isLoading } = api.advert.useGet({ id: advertId ?? undefined }, !!advertId, false);
    const isEdit = !!advertId;
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data: countryList = {} as TCountryListItem } = useP2PCountryList({
        refetchOnWindowFocus: false,
    });
    const { data: paymentMethodList = [] } = api.paymentMethods.useGet();
    const { floatRateOffsetLimitString, rateType } = useFloatingRate();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { data: p2pSettings } = api.settings.useSettings();
    const { adverts_archive_period: advertsArchivePeriod, order_expiry_options: orderExpiryOptions = [] } =
        p2pSettings ?? {};
    const { data: createResponse, error, isError, isSuccess, mutate } = api.advert.useCreate();
    const {
        data: updateResponse,
        error: updateError,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
        mutate: updateMutate,
    } = api.advert.useUpdate();
    const history = useHistory();
    const methods = useForm<FormValues>({
        defaultValues: {
            'ad-type': 'buy',
            amount: '',
            'contact-details': '',
            'float-rate-offset-limit': floatRateOffsetLimitString,
            instructions: '',
            'max-order': '',
            'min-completion-rate': '',
            'min-join-days': '',
            'min-order': '',
            'order-completion-time': `${orderExpiryOptions.length > 0 ? Math.max(...(orderExpiryOptions as number[])) : '3600'}`,
            'payment-method': [],
            'preferred-countries': Object.keys(countryList as object),
            'rate-type-string': rateType,
            'rate-value': rateType === RATE_TYPE.FLOAT ? '-0.01' : '',
        },
        mode: 'all',
    });

    const {
        formState: { isDirty },
        getValues,
        handleSubmit,
        setValue,
    } = methods;
    useEffect(() => {
        if (Object.keys(countryList as object).length > 0 && getValues('preferred-countries').length === 0) {
            setValue('preferred-countries', Object.keys(countryList as object));
        }
    }, [countryList, getValues, setValue]);

    const shouldNotShowArchiveMessageAgain = LocalStorageUtils.getValue<boolean>(
        LocalStorageConstants.p2pArchiveMessage
    );

    const onSubmit = () => {
        type TPayload = {
            amount?: number;
            contact_info?: string;
            description?: string;
            eligible_countries: string[];
            max_order_amount: number;
            min_completion_rate?: number;
            min_join_days?: number;
            min_order_amount: number;
            order_expiry_period: number;
            payment_method_ids?: TMutatePayload['payment_method_ids'];
            payment_method_names?: TMutatePayload['payment_method_names'];
            rate: number;
            rate_type: typeof rateType;
            type?: 'buy' | 'sell';
        };
        const payload: TPayload = {
            amount: Number(getValues('amount')),
            eligible_countries: getValues('preferred-countries'),
            max_order_amount: Number(getValues('max-order')),
            min_order_amount: Number(getValues('min-order')),
            order_expiry_period: Number(getValues('order-completion-time')),
            rate: Number(getValues('rate-value')),
            rate_type: rateType,
            type: getValues('ad-type'),
        };

        if (getValues('ad-type') === 'buy') {
            payload.payment_method_names = getValues('payment-method') as TMutatePayload['payment_method_names'];
        } else {
            payload.contact_info = getValues('contact-details');
            payload.payment_method_ids = getValues('payment-method') as TMutatePayload['payment_method_ids'];
        }
        if (getValues('instructions')) {
            payload.description = getValues('instructions');
        }
        if (getValues('min-completion-rate')) {
            payload.min_completion_rate = Number(getValues('min-completion-rate'));
        }
        if (getValues('min-join-days')) {
            payload.min_join_days = Number(getValues('min-join-days'));
        }

        if (isEdit) {
            delete payload.amount;
            delete payload.type;
            updateMutate({ id: advertId, ...payload });
            return;
        }
        mutate(payload as TMutatePayload);
    };

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            if (!shouldNotShowArchiveMessageAgain) {
                showModal('AdCreateEditSuccessModal');
            } else if (createResponse?.visibility_status) {
                history.push(MY_ADS_URL, {
                    currency: createResponse?.account_currency,
                    from: '',
                    limit: createResponse?.max_order_amount_limit_display,
                    visibilityStatus: createResponse?.visibility_status[0],
                });
            } else {
                history.push(MY_ADS_URL);
            }
        } else if (isError || isUpdateError) {
            showModal('AdCreateEditErrorModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, history, shouldNotShowArchiveMessageAgain, isError, isUpdateSuccess, isUpdateError]);

    const setInitialAdRate = (formValues: TFormValuesInfo) => {
        if (rateType !== formValues?.rate_type) {
            if (rateType === RATE_TYPE.FLOAT) {
                return formValues?.is_buy ? '-0.01' : '+0.01';
            }
            return '';
        }
        return formValues?.rate;
    };

    const setFormValues = useCallback(
        (formValues: TFormValuesInfo) => {
            setValue('form-type', 'edit');
            setValue('ad-type', formValues.type);
            setValue('amount', formValues.amount.toString());
            setValue('instructions', formValues.description);
            setValue('max-order', formValues.max_order_amount.toString());
            setValue('min-completion-rate', formValues.min_completion_rate?.toString() ?? '');
            setValue('min-join-days', formValues.min_join_days?.toString() ?? '');
            setValue('min-order', formValues.min_order_amount.toString());
            setValue('rate-value', setInitialAdRate(formValues) as string);
            setValue('preferred-countries', formValues.eligible_countries ?? Object.keys(countryList as object));
            setValue('order-completion-time', `${formValues.order_expiry_period}`);
            if (formValues.type === 'sell') {
                setValue('contact-details', formValues.contact_info);
                setValue('payment-method', Object.keys(formValues.payment_method_details ?? {}).map(Number));
            } else {
                const paymentMethodNames = formValues?.payment_method_names;
                const paymentMethodKeys =
                    paymentMethodNames?.map(
                        name => paymentMethodList.find(method => method.display_name === name)?.id ?? ''
                    ) ?? [];
                setValue('payment-method', paymentMethodKeys);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paymentMethodList, countryList]
    );

    useEffect(() => {
        if (advertInfo && advertInfo.id === advertId && isEdit) {
            setFormValues(advertInfo as TFormValuesInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertInfo, isEdit]);

    if ((isLoading && isEdit) || (isEdit && !advertInfo)) {
        return <Loader />;
    }

    const onClickCancel = () => {
        if (isDirty) showModal('AdCancelCreateEditModal');
        else history.push(MY_ADS_URL);
    };

    return (
        <>
            <FormProvider {...methods}>
                <form className='create-edit-ad' onSubmit={handleSubmit(onSubmit)}>
                    <AdWizard
                        countryList={countryList as TCountryListItem}
                        currency={activeAccount?.currency as TCurrency}
                        localCurrency={p2pSettings?.localCurrency as TCurrency}
                        onCancel={onClickCancel}
                        orderExpiryOptions={orderExpiryOptions}
                        rateType={rateType}
                        steps={getSteps(localize, isEdit)}
                    />
                </form>
            </FormProvider>
            <AdCreateEditErrorModal
                errorCode={(error?.code || updateError?.code) as TErrorCodes}
                errorMessage={(error?.message || updateError?.message) ?? 'Something’s not right'}
                isModalOpen={!!isModalOpenFor('AdCreateEditErrorModal')}
                onRequestClose={hideModal}
            />
            <AdCreateEditSuccessModal
                advertsArchivePeriod={advertsArchivePeriod}
                data={isEdit ? updateResponse : createResponse}
                isModalOpen={!!isModalOpenFor('AdCreateEditSuccessModal')}
                onRequestClose={hideModal}
            />
            <AdCancelCreateEditModal
                isModalOpen={!!isModalOpenFor('AdCancelCreateEditModal')}
                onRequestClose={hideModal}
            />
        </>
    );
};

export default CreateEditAd;
