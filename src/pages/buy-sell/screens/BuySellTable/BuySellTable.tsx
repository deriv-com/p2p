import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { RadioGroupFilterModal } from '@/components/Modals';
import { ADVERT_TYPE, BUY_SELL, getSortByList } from '@/constants';
import { api } from '@/hooks';
import { useModalManager } from '@/hooks/custom-hooks';
import { useBuySellFiltersStore, useTabsStore } from '@/stores';
import { TSortByValues } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRenderer } from './BuySellTableRenderer';
import './BuySellTable.scss';

const BuySellTable = () => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data: p2pSettingsData } = api.settings.useSettings();

    const {
        filteredCurrency,
        selectedPaymentMethods,
        setFilteredCurrency,
        setSortByValue,
        shouldUseClientLimits,
        sortByValue,
    } = useBuySellFiltersStore(
        useShallow(state => ({
            filteredCurrency: state.filteredCurrency,
            selectedPaymentMethods: state.selectedPaymentMethods,
            setFilteredCurrency: state.setFilteredCurrency,
            setSortByValue: state.setSortByValue,
            shouldUseClientLimits: state.shouldUseClientLimits,
            sortByValue: state.sortByValue,
        }))
    );

    const { activeBuySellTab } = useTabsStore(
        useShallow(state => ({
            activeBuySellTab: state.activeBuySellTab,
        }))
    );

    const [searchValue, setSearchValue] = useState<string>('');

    const {
        data,
        isFetching,
        isPending: isLoading,
        loadMoreAdverts,
    } = api.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeBuySellTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: filteredCurrency,
        payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
        sort_by: sortByValue,
        use_client_limits: shouldUseClientLimits ? 1 : 0,
    });

    const onToggle = (value: string) => {
        setSortByValue(value as TSortByValues);
        hideModal();
    };

    useEffect(() => {
        if (p2pSettingsData?.localCurrency && filteredCurrency === '')
            setFilteredCurrency(p2pSettingsData.localCurrency);
    }, [filteredCurrency, p2pSettingsData?.localCurrency, setFilteredCurrency]);

    return (
        <div className='buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader
                setIsFilterModalOpen={() => showModal('RadioGroupFilterModal')}
                setSearchValue={setSearchValue}
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
                    list={getSortByList(localize)}
                    onRequestClose={hideModal}
                    onToggle={onToggle}
                    selected={sortByValue}
                />
            )}
        </div>
    );
};

export default BuySellTable;
