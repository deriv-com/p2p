import { useEffect, useState } from 'react';
import { EmailLinkExpiredModal, RadioGroupFilterModal } from '@/components/Modals';
import { ADVERT_TYPE, BUY_SELL, SORT_BY_LIST } from '@/constants';
import { api } from '@/hooks';
import { useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { TSortByValues } from '@/utils';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRenderer } from './BuySellTableRenderer';
import './BuySellTable.scss';

const TABS = [ADVERT_TYPE.BUY, ADVERT_TYPE.SELL];

const BuySellTable = () => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data: p2pSettingsData } = api.settings.useSettings();
    const { queryString, setQueryString } = useQueryString();
    const activeTab = queryString.tab || ADVERT_TYPE.BUY;

    useEffect(() => {
        showModal('EmailLinkExpiredModal');
    }, []);

    const [selectedCurrency, setSelectedCurrency] = useState<string>(p2pSettingsData?.localCurrency || '');
    const [sortDropdownValue, setSortDropdownValue] = useState<TSortByValues>('rate');
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
    const [shouldUseClientLimits, setShouldUseClientLimits] = useState<boolean>(true);

    const {
        data,
        isFetching,
        isPending: isLoading,
        loadMoreAdverts,
    } = api.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: selectedCurrency,
        payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
        sort_by: sortDropdownValue,
        use_client_limits: shouldUseClientLimits ? 1 : 0,
    });

    const onToggle = (value: string) => {
        setSortDropdownValue(value as TSortByValues);
        hideModal();
    };

    const setActiveTab = (index: number) => {
        setQueryString({
            tab: TABS[index],
        });
    };

    useEffect(() => {
        if (p2pSettingsData?.localCurrency) setSelectedCurrency(p2pSettingsData.localCurrency);
    }, [p2pSettingsData?.localCurrency]);

    return (
        <div className='buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader
                activeTab={activeTab}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethods={selectedPaymentMethods}
                setActiveTab={setActiveTab}
                setIsFilterModalOpen={() => showModal('RadioGroupFilterModal')}
                setSearchValue={setSearchValue}
                setSelectedCurrency={setSelectedCurrency}
                setSelectedPaymentMethods={setSelectedPaymentMethods}
                setShouldUseClientLimits={setShouldUseClientLimits}
                setSortDropdownValue={setSortDropdownValue}
                shouldUseClientLimits={shouldUseClientLimits}
                sortDropdownValue={sortDropdownValue}
            />
            <BuySellTableRenderer
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdverts={loadMoreAdverts}
                searchValue={searchValue}
            />
            {isModalOpenFor('RadioGroupFilterModal') && (
                <RadioGroupFilterModal
                    isModalOpen
                    list={SORT_BY_LIST}
                    onRequestClose={hideModal}
                    onToggle={onToggle}
                    selected={sortDropdownValue as string}
                />
            )}
            {isModalOpenFor('EmailLinkExpiredModal') && (
                <EmailLinkExpiredModal isModalOpen onRequestClose={hideModal} />
            )}
        </div>
    );
};

export default BuySellTable;
