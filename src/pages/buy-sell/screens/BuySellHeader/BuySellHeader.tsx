import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { ADVERT_TYPE, getSortByList } from '@/constants';
import { useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { useBuySellFiltersStore, useTabsStore } from '@/stores';
import { getLocalizedTabs } from '@/utils/tabs';
import { LabelPairedBarsFilterMdBoldIcon, LabelPairedBarsFilterSmBoldIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

const TABS = [ADVERT_TYPE.BUY, ADVERT_TYPE.SELL];

type TBuySellHeaderProps = {
    setIsFilterModalOpen: () => void;
    setSearchValue: (value: string) => void;
};

const BuySellHeader = ({ setIsFilterModalOpen, setSearchValue }: TBuySellHeaderProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { localize } = useTranslations();
    const { isDesktop, isMobile } = useDevice();
    const { queryString, setQueryString } = useQueryString();
    const { filteredCurrency, selectedPaymentMethods, setFilteredCurrency, setSortByValue, sortByValue } =
        useBuySellFiltersStore(
            useShallow(state => ({
                filteredCurrency: state.filteredCurrency,
                selectedPaymentMethods: state.selectedPaymentMethods,
                setFilteredCurrency: state.setFilteredCurrency,
                setSortByValue: state.setSortByValue,
                sortByValue: state.sortByValue,
            }))
        );

    const { activeBuySellTab, setActiveBuySellTab } = useTabsStore(
        useShallow(state => ({
            activeBuySellTab: state.activeBuySellTab,
            setActiveBuySellTab: state.setActiveBuySellTab,
        }))
    );

    useEffect(() => {
        if (queryString.tab) setActiveBuySellTab(queryString.tab);
        else setQueryString({ tab: activeBuySellTab });
    }, [activeBuySellTab, queryString.tab, setActiveBuySellTab, setQueryString]);

    return (
        <div className='buy-sell-header' data-testid='dt_buy_sell_header'>
            <div className='buy-sell-header__row justify-between'>
                <Tabs
                    TitleFontSize={isMobile ? 'md' : 'sm'}
                    activeTab={getLocalizedTabs(localize)[activeBuySellTab]}
                    onChange={index => {
                        setActiveBuySellTab(TABS[index]);
                        setQueryString({
                            tab: TABS[index],
                        });
                    }}
                    variant='primary'
                    wrapperClassName='buy-sell-header__tabs'
                >
                    <Tab title={localize('Buy')} />
                    <Tab title={localize('Sell')} />
                </Tabs>
                {!isDesktop && <GuideTooltip />}
            </div>
            <div className='buy-sell-header__row'>
                <div className='flex flex-row-reverse lg:flex-row gap-4 w-full'>
                    <CurrencyDropdown selectedCurrency={filteredCurrency} setSelectedCurrency={setFilteredCurrency} />
                    <div className='buy-sell-header__row-search'>
                        <Search
                            name='search-nickname'
                            onSearch={setSearchValue}
                            placeholder={isDesktop ? localize('Search by nickname') : localize('Search')}
                        />
                    </div>
                </div>
                <SortDropdown
                    list={getSortByList(localize)}
                    onSelect={setSortByValue}
                    setIsFilterModalOpen={setIsFilterModalOpen}
                    value={sortByValue}
                />
                <Button
                    className='buy-sell-header__filter-button'
                    color='black'
                    data-testid='dt_buy_sell_header_filter_button'
                    icon={isDesktop ? <LabelPairedBarsFilterMdBoldIcon /> : <LabelPairedBarsFilterSmBoldIcon />}
                    onClick={() => showModal('FilterModal')}
                    variant='outlined'
                >
                    {!!selectedPaymentMethods?.length && (
                        <div
                            className='buy-sell-header__filter-button__indication'
                            data-testid='dt_filter_button_indicator'
                        />
                    )}
                </Button>
            </div>
            {isModalOpenFor('FilterModal') && <FilterModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default BuySellHeader;
