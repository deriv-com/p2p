import clsx from 'clsx';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { getSortByList } from '@/constants';
import { useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
import { GuideTooltip } from '@/pages/guide/components';
import { TSortByValues } from '@/utils';
import { getLocalizedTabs } from '@/utils/tabs';
import { LabelPairedBarsFilterMdBoldIcon, LabelPairedBarsFilterSmBoldIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    selectedCurrency: string;
    selectedPaymentMethods: string[];
    setActiveTab: (tab: number) => void;
    setIsFilterModalOpen: () => void;
    setSearchValue: (value: string) => void;
    setSelectedCurrency: (value: string) => void;
    setSelectedPaymentMethods: (value: string[]) => void;
    setShouldUseClientLimits: (value: boolean) => void;
    setSortDropdownValue: (value: TSortByValues) => void;
    shouldUseClientLimits: boolean;
    sortDropdownValue: TSortByValues;
};

const BuySellHeader = ({
    activeTab,
    selectedCurrency,
    selectedPaymentMethods,
    setActiveTab,
    setIsFilterModalOpen,
    setSearchValue,
    setSelectedCurrency,
    setSelectedPaymentMethods,
    setShouldUseClientLimits,
    setSortDropdownValue,
    shouldUseClientLimits,
    sortDropdownValue,
}: TBuySellHeaderProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();

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
                    <CurrencyDropdown selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
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
                    onSelect={setSortDropdownValue}
                    setIsFilterModalOpen={setIsFilterModalOpen}
                    value={sortDropdownValue}
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
            {isModalOpenFor('FilterModal') && (
                <FilterModal
                    isModalOpen
                    isToggled={shouldUseClientLimits}
                    onRequestClose={hideModal}
                    onToggle={setShouldUseClientLimits}
                    selectedPaymentMethods={selectedPaymentMethods}
                    setSelectedPaymentMethods={setSelectedPaymentMethods}
                />
            )}
        </div>
    );
};

export default BuySellHeader;
