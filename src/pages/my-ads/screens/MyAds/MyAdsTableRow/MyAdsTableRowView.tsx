import { memo, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TCurrency, TErrorCodes, THooks } from 'types';
import { CopyAdForm } from '@/components';
import {
    AdCancelCreateEditModal,
    AdCreateEditErrorModal,
    AdCreateEditSuccessModal,
    AdErrorTooltipModal,
    AdRateSwitchModal,
    AdVisibilityErrorModal,
    ErrorModal,
    MyAdsDeleteModal,
    ShareAdsModal,
} from '@/components/Modals';
import { AD_ACTION, MY_ADS_URL } from '@/constants';
import { api } from '@/hooks';
import useInvalidateQuery from '@/hooks/api/useInvalidateQuery';
import { useFloatingRate, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { getPaymentMethodObjects, getVisibilityErrorCodes } from '@/utils';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import MyAdsTableRow from './MyAdsTableRow';

type TState = {
    currency?: TCurrency;
    limit?: string;
    visibilityStatus?: string;
};

type TMutatePayload = Parameters<THooks.Advert.Create>[0];
type TFormValues = {
    amount: number;
    maxOrder: string;
    minOrder: string;
    rateValue: string;
};

const MyAdsTableRowView = ({
    advertiserPaymentMethods,
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isListed,
    ...rest
}: TMyAdsTableRowRendererProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const invalidate = useInvalidateQuery();
    const { data: paymentMethodList = [] } = api.paymentMethods.useGet();
    const { data: p2pSettings } = api.settings.useSettings();
    const { order_payment_period: orderPaymentPeriod } = p2pSettings ?? {};
    const {
        data: createResponse,
        error: createError,
        isError: isCreateError,
        isSuccess: isCreateSuccess,
        mutate: createAd,
    } = api.advert.useCreate();
    const { rateType: currentRateType, reachedTargetDate } = useFloatingRate();
    const { data: updateResponse, error: updateError, isError: isErrorUpdate, mutate } = api.advert.useUpdate();
    const { error, isError, mutate: deleteAd } = api.advert.useDelete();
    const shouldNotShowArchiveMessageAgain = LocalStorageUtils.getValue<boolean>(
        LocalStorageConstants.p2pArchiveMessage
    );
    const [formValues, setFormValues] = useState<TFormValues>({
        amount: 0,
        maxOrder: '',
        minOrder: '',
        rateValue: '',
    });
    const history = useHistory();
    const location = useLocation();
    const paymentMethodObjects = getPaymentMethodObjects(paymentMethodList);
    const advertiserPaymentMethodObjects = getPaymentMethodObjects(
        advertiserPaymentMethods as THooks.AdvertiserPaymentMethods.Get
    );
    const { queryString } = useQueryString();

    const createAdvisibilityStatus = (location.state as TState)?.visibilityStatus;

    useEffect(() => {
        if (createAdvisibilityStatus) {
            showModal('AdVisibilityErrorModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createAdvisibilityStatus]);

    const {
        account_currency: accountCurrency = '',
        contact_info: contactInfo,
        description,
        eligible_countries: eligibleCountries = [],
        id = '',
        min_completion_rate: minCompletionRate = 0,
        min_join_days: minJoinDays = 0,
        payment_method_names: paymentMethodNames,
        rate_type: rateType,
        remaining_amount: remainingAmount = 0,
        type = '',
        visibility_status: visibilityStatus = [],
    } = rest;

    useEffect(() => {
        if (isError && error?.message) {
            showModal('MyAdsDeleteModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error?.message, isError]);

    useEffect(() => {
        if (isErrorUpdate && updateError?.message) {
            showModal('ErrorModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateError?.message]);

    const onClickIcon = (action: string) => {
        switch (action) {
            case AD_ACTION.ACTIVATE:
                mutate({ id, is_active: 1 });
                break;
            case AD_ACTION.COPY: {
                showModal('CopyAdForm');
                break;
            }
            case AD_ACTION.DEACTIVATE:
                mutate({ id, is_active: 0 });
                break;
            case AD_ACTION.DELETE: {
                showModal('MyAdsDeleteModal');
                break;
            }
            case AD_ACTION.SHARE: {
                showModal('ShareAdsModal');
                break;
            }
            case AD_ACTION.EDIT: {
                history.push(`${MY_ADS_URL}/adForm?formAction=edit&advertId=${id}`);
                break;
            }
            default:
                break;
        }
    };
    const onClickDelete = () => {
        deleteAd({ id });
        hideModal();
    };

    const clearValues = () => {
        setFormValues({
            amount: 0,
            maxOrder: '',
            minOrder: '',
            rateValue: '',
        });
    };

    useEffect(() => {
        if (isCreateSuccess) {
            if (shouldNotShowArchiveMessageAgain) {
                showModal('AdCreateEditSuccessModal');
            } else {
                invalidate('p2p_advertiser_adverts');
            }
            clearValues();
        } else if (isCreateError) {
            showModal('AdCreateEditErrorModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreateSuccess, history, shouldNotShowArchiveMessageAgain, isCreateError]);

    const onSubmit = (values: TFormValues) => {
        const { amount, maxOrder, minOrder, rateValue } = values;
        setFormValues(values);

        const payload: TMutatePayload = {
            amount,
            eligible_countries: eligibleCountries,
            max_order_amount: Number(maxOrder),
            min_order_amount: Number(minOrder),
            rate: Number(rateValue),
            rate_type: rateType,
            type: type as TMutatePayload['type'],
        };

        if (type === 'buy') {
            payload.payment_method_names = paymentMethodNames?.map(
                name => paymentMethodObjects[name].id
            ) as TMutatePayload['payment_method_names'];
        } else {
            payload.contact_info = contactInfo;
            payload.payment_method_ids = paymentMethodNames?.map(
                name => advertiserPaymentMethodObjects[name].id
            ) as TMutatePayload['payment_method_ids'];
        }
        if (description) {
            payload.description = description;
        }
        if (minCompletionRate > 0) {
            payload.min_completion_rate = Number(minCompletionRate);
        }
        if (minJoinDays > 0) {
            payload.min_join_days = Number(minJoinDays);
        }

        createAd(payload as TMutatePayload);
    };

    const onClickCancel = (values: TFormValues) => {
        setFormValues(values);
        showModal('AdCancelCreateEditModal');
    };

    return (
        <>
            <MyAdsTableRow
                currentRateType={currentRateType}
                isListed={isListed}
                onClickIcon={onClickIcon}
                showModal={showModal}
                {...rest}
            />
            {!!isModalOpenFor('AdErrorTooltipModal') && (
                <AdErrorTooltipModal
                    accountCurrency={accountCurrency}
                    advertType={type}
                    balanceAvailable={balanceAvailable}
                    dailyBuyLimit={dailyBuyLimit}
                    dailySellLimit={dailySellLimit}
                    isModalOpen
                    onRequestClose={hideModal}
                    remainingAmount={remainingAmount}
                    visibilityStatus={getVisibilityErrorCodes(visibilityStatus, rateType !== currentRateType, isListed)}
                />
            )}
            {!!isModalOpenFor('MyAdsDeleteModal') && (
                <MyAdsDeleteModal
                    error={error?.message}
                    id={id}
                    isModalOpen={!!isModalOpenFor('MyAdsDeleteModal') || !!error?.message}
                    onClickDelete={onClickDelete}
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('ShareAdsModal') && (
                <ShareAdsModal id={id} isModalOpen={!!isModalOpenFor('ShareAdsModal')} onRequestClose={hideModal} />
            )}
            {!!isModalOpenFor('AdRateSwitchModal') && (
                <AdRateSwitchModal
                    isModalOpen
                    onClickSet={() => onClickIcon(AD_ACTION.EDIT)}
                    onRequestClose={hideModal}
                    rateType={currentRateType}
                    reachedEndDate={reachedTargetDate}
                />
            )}
            {!!isModalOpenFor('ErrorModal') && (
                <ErrorModal isModalOpen message={updateError?.message} onRequestClose={hideModal} />
            )}
            {!!isModalOpenFor('AdVisibilityErrorModal') && (
                <AdVisibilityErrorModal
                    currency={(location.state as TState)?.currency ?? ('' as TCurrency)}
                    errorCode={(location.state as TState)?.visibilityStatus ?? ''}
                    isModalOpen
                    limit={(location.state as TState)?.limit ?? ''}
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('CopyAdForm') && (
                <CopyAdForm
                    formValues={formValues}
                    isModalOpen
                    onFormSubmit={onSubmit}
                    {...rest}
                    onClickCancel={onClickCancel}
                />
            )}
            {!!isModalOpenFor('AdCreateEditErrorModal') && (
                <AdCreateEditErrorModal
                    errorCode={createError?.code as TErrorCodes}
                    errorMessage={createError?.message ?? 'Something’s not right'}
                    isModalOpen
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('AdCreateEditSuccessModal') && (
                <AdCreateEditSuccessModal
                    advertsArchivePeriod={orderPaymentPeriod}
                    data={queryString.formAction === 'edit' ? updateResponse : createResponse}
                    isModalOpen
                    onRequestClose={() => hideModal({ shouldHideAllModals: true })}
                />
            )}
            {!!isModalOpenFor('AdCancelCreateEditModal') && (
                <AdCancelCreateEditModal isModalOpen onRequestClose={hideModal} resetValues={clearValues} />
            )}
        </>
    );
};

export default memo(MyAdsTableRowView);
