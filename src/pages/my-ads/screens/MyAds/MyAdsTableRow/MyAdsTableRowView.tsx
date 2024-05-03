import { memo, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TCurrency } from 'types';
import {
    AdErrorTooltipModal,
    AdRateSwitchModal,
    AdVisibilityErrorModal,
    ErrorModal,
    MyAdsDeleteModal,
    ShareAdsModal,
} from '@/components/Modals';
import { AD_ACTION, MY_ADS_URL } from '@/constants';
import { api } from '@/hooks';
import { useFloatingRate, useModalManager } from '@/hooks/custom-hooks';
import { getVisibilityErrorCodes } from '@/utils';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import MyAdsTableRow from './MyAdsTableRow';

type TState = {
    currency?: TCurrency;
    limit?: string;
    visibilityStatus?: string;
};
const MyAdsTableRowView = ({
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isListed,
    ...rest
}: TMyAdsTableRowRendererProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { rateType: currentRateType, reachedTargetDate } = useFloatingRate();
    const { error: updateError, isError: isErrorUpdate, mutate } = api.advert.useUpdate();
    const { error, isError, mutate: deleteAd } = api.advert.useDelete();
    const history = useHistory();
    const location = useLocation();
    const createAdvisibilityStatus = (location.state as TState)?.visibilityStatus;

    useEffect(() => {
        if (createAdvisibilityStatus) {
            showModal('AdVisibilityErrorModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createAdvisibilityStatus]);

    const {
        account_currency: accountCurrency = '',
        id = '',
        rate_type: rateType,
        remaining_amount: remainingAmount = 0,
        type = '',
        visibility_status: visibilityStatus = [],
    } = rest;

    useEffect(() => {
        if (isError && error?.error?.message) {
            showModal('MyAdsDeleteModal');
        }
    }, [error?.error?.message, isError]);

    useEffect(() => {
        if (isErrorUpdate && updateError?.error?.message) {
            showModal('ErrorModal');
        }
    }, [updateError?.error?.message]);

    const onClickIcon = (action: string) => {
        switch (action) {
            case AD_ACTION.ACTIVATE:
                mutate({ id, is_active: 1 });
                break;
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
                    isModalOpen={!!isModalOpenFor('AdErrorTooltipModal')}
                    onRequestClose={hideModal}
                    remainingAmount={remainingAmount}
                    visibilityStatus={getVisibilityErrorCodes(visibilityStatus, rateType !== currentRateType, isListed)}
                />
            )}
            {!!isModalOpenFor('MyAdsDeleteModal') && (
                <MyAdsDeleteModal
                    error={error?.error?.message}
                    id={id}
                    isModalOpen={!!isModalOpenFor('MyAdsDeleteModal') || !!error?.error?.message}
                    onClickDelete={onClickDelete}
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('ShareAdsModal') && (
                <ShareAdsModal id={id} isModalOpen={!!isModalOpenFor('ShareAdsModal')} onRequestClose={hideModal} />
            )}
            {!!isModalOpenFor('AdRateSwitchModal') && (
                <AdRateSwitchModal
                    isModalOpen={!!isModalOpenFor('AdRateSwitchModal')}
                    onClickSet={() => onClickIcon(AD_ACTION.EDIT)}
                    onRequestClose={hideModal}
                    rateType={currentRateType}
                    reachedEndDate={reachedTargetDate}
                />
            )}
            {!!isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    isModalOpen={!!isModalOpenFor('ErrorModal')}
                    message={updateError?.error?.message}
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('AdVisibilityErrorModal') && (
                <AdVisibilityErrorModal
                    currency={(location.state as TState)?.currency ?? ('' as TCurrency)}
                    errorCode={(location.state as TState)?.visibilityStatus ?? ''}
                    isModalOpen={!!isModalOpenFor('AdVisibilityErrorModal')}
                    limit={(location.state as TState)?.limit ?? ''}
                    onRequestClose={hideModal}
                />
            )}
        </>
    );
};

export default memo(MyAdsTableRowView);
