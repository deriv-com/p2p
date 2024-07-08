import { useShallow } from 'zustand/react/shallow';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { getSortByList } from '@/constants';
import { useModalManager } from '@/hooks/custom-hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { useBuySellFiltersStore } from '@/stores';
import { getLocalizedTabs } from '@/utils/tabs';
import { LabelPairedBarsFilterMdBoldIcon, LabelPairedBarsFilterSmBoldIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    setActiveTab: (tab: number) => void;
    setIsFilterModalOpen: () => void;
    setSearchValue: (value: string) => void;
};

const BuySellHeader = ({ activeTab, setActiveTab, setIsFilterModalOpen, setSearchValue }: TBuySellHeaderProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
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

    return (
        <div className='buy-sell-header' data-testid='dt_buy_sell_header'>
            <div className='buy-sell-header__row justify-between'>
                <Tabs
                    TitleFontSize={isDesktop ? 'sm' : 'md'}
                    activeTab={getLocalizedTabs(localize)[activeTab]}
                    onChange={setActiveTab}
                    variant='primary'
                    wrapperClassName='buy-sell-header__tabs'
                >
                    <Tab title={localize('Buy')} />
                    <Tab title={localize('Sell')} />
                </Tabs>
                {!isDesktop && <GuideTooltip />}
            </div>
            <div className='buy-sell-header__row'>
                <div className='flex flex-row-reverse lg:flex-row gap-4'>
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
                    {!!selectedPaymentMethods?.length && <div className='buy-sell-header__filter-button__indication' />}
                </Button>
            </div>
            {isModalOpenFor('FilterModal') && <FilterModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default BuySellHeader;
