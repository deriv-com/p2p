import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { BuySellForm } from '@/components';
import { ErrorModal, LoadingModal } from '@/components/Modals';
import { ADVERT_TYPE, BUY_SELL, BUY_SELL_URL } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiser, useIsAdvertiserBarred, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { useTabsStore } from '@/stores';
import { getLocalizedTabs } from '@/utils/tabs';
import { useTranslations } from '@deriv-com/translations';
import { Tab, Tabs } from '@deriv-com/ui';
import { AdvertsTableRenderer } from './AdvertsTableRenderer';
import './AdvertiserAdvertsTable.scss';

type TAdvertiserAdvertsTableProps = {
    advertiserId: string;
};

const TABS = [ADVERT_TYPE.BUY, ADVERT_TYPE.SELL];

const AdvertiserAdvertsTable = ({ advertiserId }: TAdvertiserAdvertsTableProps) => {
    const { localize } = useTranslations();
    const [advertId, setAdvertId] = useState<string | undefined>(undefined);
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const location = useLocation();
    const history = useHistory();

    const searchParams = new URLSearchParams(location.search);
    const currencyParam = searchParams.get('currency');
    const currency = currencyParam !== null && currencyParam ? currencyParam : undefined;

    const { queryString, setQueryString } = useQueryString();

    const { activeAdvertisersBuySellTab, setActiveAdvertisersBuySellTab } = useTabsStore(
        useShallow(state => ({
            activeAdvertisersBuySellTab: state.activeAdvertisersBuySellTab,
            setActiveAdvertisersBuySellTab: state.setActiveAdvertisersBuySellTab,
        }))
    );
    const { data: advertInfo, error, isLoading: isLoadingAdvert } = api.advert.useGet({ id: advertId }, !!advertId);
    const { data, isFetching, isLoading, loadMoreAdverts } = api.advert.useGetList({
        advertiser_id: advertiserId,
        counterparty_type: activeAdvertisersBuySellTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: currency,
    });
    const { data: advertiserInfo } = api.advertiser.useGetInfo() || {};
    const isMyAdvert = advertiserInfo?.id === advertiserId;
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserBarred = useIsAdvertiserBarred();

    const setActiveTab = (index: number) => {
        setActiveAdvertisersBuySellTab(TABS[index]);
        setQueryString({ tab: TABS[index] });
    };

    const setShowBuySellForm = useCallback(() => {
        if (advertInfo) {
            const { is_active: isActive, is_buy: isBuy, is_visible: isVisible } = advertInfo;
            if (isActive && isVisible) {
                setActiveTab(isBuy ? 1 : 0);
                showModal('BuySellForm', { shouldClearPreviousModals: true, shouldStackModals: false });
            } else {
                showModal('ErrorModal', { shouldClearPreviousModals: true });
            }
        } else if (error) {
            showModal('ErrorModal', { shouldClearPreviousModals: true });
        } else if (isLoadingAdvert && !advertInfo) {
            showModal('LoadingModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertInfo, error, isLoadingAdvert]);

    useEffect(() => {
        if (queryString.tab) setActiveAdvertisersBuySellTab(queryString.tab);
        else setQueryString({ tab: activeAdvertisersBuySellTab });
    }, [activeAdvertisersBuySellTab, queryString.tab, setActiveAdvertisersBuySellTab, setQueryString]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const advertIdParam = params.get('advert_id');

        if (advertIdParam) setAdvertId(advertIdParam !== null && !!advertIdParam ? advertIdParam : undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isAdvertiser && !isAdvertiserBarred && !isMyAdvert && advertId) setShowBuySellForm();
        else if (isAdvertiserBarred) history.push(BUY_SELL_URL);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advertId, isAdvertiser, isAdvertiserBarred, isMyAdvert, setShowBuySellForm]);

    return (
        <div className='advertiser-adverts-table'>
            <Tabs
                activeTab={getLocalizedTabs(localize)[activeAdvertisersBuySellTab]}
                className='lg:w-80 lg:mt-10'
                onChange={setActiveTab}
                variant='secondary'
            >
                <Tab className='text-xs' title={localize('Buy')} />
                <Tab title={localize('Sell')} />
            </Tabs>
            <AdvertsTableRenderer
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdverts={loadMoreAdverts}
            />
            {isModalOpenFor('BuySellForm') && (
                <BuySellForm advertId={advertId} isModalOpen onRequestClose={hideModal} />
            )}
            {isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    isModalOpen
                    message={localize('It’s either deleted or no longer active.')}
                    onRequestClose={hideModal}
                    title={localize('This ad is unavailable')}
                />
            )}
            {isModalOpenFor('LoadingModal') && <LoadingModal isModalOpen />}
        </div>
    );
};

export default AdvertiserAdvertsTable;
