import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { NonUndefinedValues, TCountryListItem, TCurrency, TErrorCodes, THooks } from 'types';
import { AdCancelCreateEditModal, AdCreateEditErrorModal, AdCreateEditSuccessModal } from '@/components/Modals';
import { MY_ADS_URL, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useFloatingRate, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { Loader } from '@deriv-com/ui';
import { AdWizard } from '../../components';

const getSteps = (isEdit = false) => {
    const text = isEdit ? 'Edit' : 'Set';
    const steps = [
        { header: { title: `${text} ad type and amount` } },
        { header: { title: `${text} payment details` } },
        { header: { title: `${text} ad conditions` } },
    ];
    return steps;
};
type FormValues = {
    'ad-type': 'buy' | 'sell';
    amount: string;
    'contact-details': string;
    'float-rate-offset-limit': string;
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

const CreateEditAd = () => {
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const { data: advertInfo, isLoading } = api.advert.useGet({ id: advertId ?? undefined }, !!advertId, false);
    const isEdit = !!advertId;
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data: countryList = {} as TCountryListItem } = api.countryList.useGet();
    const { data: paymentMethodList = [] } = api.paymentMethods.useGet();
    const { floatRateOffsetLimitString, rateType } = useFloatingRate();
    const { data: activeAccount } = api.account.useActiveAccount();
    const { data: p2pSettings } = api.settings.useSettings();
    const { order_payment_period: orderPaymentPeriod } = p2pSettings ?? {};
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
            'order-completion-time': `${orderPaymentPeriod ? (orderPaymentPeriod * 60).toString() : '3600'}`,
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

    const shouldNotShowArchiveMessageAgain = localStorage.getItem('should_not_show_auto_archive_message_again');

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
            if (shouldNotShowArchiveMessageAgain !== 'true') {
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

    const setInitialAdRate = () => {
        if (rateType !== advertInfo?.rate_type) {
            if (rateType === RATE_TYPE.FLOAT) {
                return advertInfo?.is_buy ? '-0.01' : '+0.01';
            }
            return '';
        }
        return advertInfo?.rate;
    };

    const setFormValues = useCallback(
        (advertInfo: NonUndefinedValues<THooks.Advert.Get>) => {
            setValue('ad-type', advertInfo.type);
            setValue('amount', advertInfo.amount.toString());
            setValue('instructions', advertInfo.description);
            setValue('max-order', advertInfo.max_order_amount.toString());
            setValue('min-completion-rate', advertInfo.min_completion_rate?.toString() ?? '');
            setValue('min-join-days', advertInfo.min_join_days?.toString() ?? '');
            setValue('min-order', advertInfo.min_order_amount.toString());
            setValue('rate-value', setInitialAdRate() as string);
            setValue('preferred-countries', advertInfo.eligible_countries ?? Object.keys(countryList as object));
            setValue('order-completion-time', `${advertInfo.order_expiry_period}`);
            if (advertInfo.type === 'sell') {
                setValue('contact-details', advertInfo.contact_info);
                setValue('payment-method', Object.keys(advertInfo.payment_method_details ?? {}).map(Number));
            } else {
                const paymentMethodNames = advertInfo?.payment_method_names;
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
        if (advertInfo && isEdit) {
            setFormValues(advertInfo as NonUndefinedValues<THooks.Advert.Get>);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AdWizard
                        countryList={countryList as TCountryListItem}
                        currency={activeAccount?.currency as TCurrency}
                        localCurrency={p2pSettings?.localCurrency as TCurrency}
                        onCancel={onClickCancel}
                        rateType={rateType}
                        steps={getSteps(isEdit)}
                    />
                </form>
            </FormProvider>
            <AdCreateEditErrorModal
                // @ts-expect-error types are not correct from api-hooks
                errorCode={(error?.code || updateError?.code) as TErrorCodes}
                // @ts-expect-error types are not correct from api-hooks
                errorMessage={(error?.message || updateError?.message) ?? 'Something’s not right'}
                isModalOpen={!!isModalOpenFor('AdCreateEditErrorModal')}
                onRequestClose={hideModal}
            />
            <AdCreateEditSuccessModal
                advertsArchivePeriod={orderPaymentPeriod}
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
