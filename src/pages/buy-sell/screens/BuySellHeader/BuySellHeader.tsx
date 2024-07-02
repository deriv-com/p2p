import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { getSortByList } from '@/constants';
import { useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { useBuySellFiltersStore } from '@/stores';
import { TSortByValues } from '@/utils';
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
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { filteredCurrency, setFilteredCurrency, setSortByValue, sortByValue } = useBuySellFiltersStore(
        useShallow(state => ({
            filteredCurrency: state.filteredCurrency,
            setFilteredCurrency: state.setFilteredCurrency,
            setSortByValue: state.setSortByValue,
            sortByValue: state.sortByValue,
        }))
    );

    return (
        <div
            className={clsx('buy-sell-header', {
                'buy-sell-header--has-border': isMobile && !isAdvertiserBarred,
            })}
            data-testid='dt_buy_sell_header'
        >
            <div className='buy-sell-header__row justify-between'>
                <Tabs
                    TitleFontSize={isMobile ? 'md' : 'sm'}
                    activeTab={getLocalizedTabs(localize)[activeTab]}
                    onChange={setActiveTab}
                    variant='primary'
                    wrapperClassName='buy-sell-header__tabs'
                >
                    <Tab title={localize('Buy')} />
                    <Tab title={localize('Sell')} />
                </Tabs>
                {isMobile && <GuideTooltip />}
            </div>
            <div className='buy-sell-header__row'>
                <div className='flex flex-row-reverse lg:flex-row gap-4'>
                    <CurrencyDropdown selectedCurrency={filteredCurrency} setSelectedCurrency={setFilteredCurrency} />
                    <div className='buy-sell-header__row-search'>
                        <Search
                            name='search-nickname'
                            onSearch={setSearchValue}
                            placeholder={isMobile ? localize('Search') : localize('Search by nickname')}
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
                    className='!border-[#d6dadb] border-[1px] lg:p-0 lg:h-16 lg:w-16 h-[3.2rem] w-[3.2rem]'
                    color='black'
                    icon={
                        isMobile ? (
                            <LabelPairedBarsFilterSmBoldIcon
                                className='absolute'
                                data-testid='dt_buy_sell_header_filter_button'
                            />
                        ) : (
                            <LabelPairedBarsFilterMdBoldIcon />
                        )
                    }
                    onClick={() => showModal('FilterModal')}
                    variant='outlined'
                />
            </div>
            {isModalOpenFor('FilterModal') && <FilterModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default BuySellHeader;
