import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CompositeCalendar } from '@/components';
import { ORDERS_STATUS } from '@/constants/orders';
import { useQueryString } from '@/hooks/custom-hooks';
import { useTabsStore } from '@/stores';
import { getLocalizedTabs } from '@/utils/tabs';
import { useTranslations } from '@deriv-com/translations';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import './OrdersTableHeader.scss';

type TOrdersTableHeaderProps = {
    fromDate: number | null;
    onChange: (dateValues: { from: number | null; isBatch: boolean; to: number | null }) => void;
    toDate: number | null;
};

const ORDERS_TABS = [ORDERS_STATUS.ACTIVE_ORDERS, ORDERS_STATUS.PAST_ORDERS];

const OrdersTableHeader = ({ fromDate, onChange, toDate }: TOrdersTableHeaderProps) => {
    const { isMobile } = useDevice();
    const { queryString, setQueryString } = useQueryString();
    const { localize } = useTranslations();
    const { activeOrdersTab, setActiveOrdersTab } = useTabsStore(
        useShallow(state => ({ activeOrdersTab: state.activeOrdersTab, setActiveOrdersTab: state.setActiveOrdersTab }))
    );

    const setActiveTab = (index: number) => {
        setActiveOrdersTab(ORDERS_TABS[index]);
        setQueryString({ tab: ORDERS_TABS[index] });
    };

    useEffect(() => {
        if (queryString.tab) setActiveOrdersTab(queryString.tab);
        else setQueryString({ tab: activeOrdersTab });
    }, [activeOrdersTab, queryString.tab, setActiveOrdersTab, setQueryString]);

    return (
        <div className='orders-table-header' data-testid='dt_orders_table_header'>
            <Tabs
                TitleFontSize={isMobile ? 'md' : 'sm'}
                activeTab={getLocalizedTabs(localize)[activeOrdersTab]}
                onChange={setActiveTab}
                variant='primary'
                wrapperClassName='orders-table-header__tabs'
            >
                <Tab title={localize('Active orders')} />
                <Tab title={localize('Past orders')} />
            </Tabs>
            {activeOrdersTab === ORDERS_STATUS.PAST_ORDERS && (
                // @ts-expect-error onChange is not typed properly
                <CompositeCalendar from={fromDate} onChange={onChange} to={toDate} />
            )}
        </div>
    );
};

export default OrdersTableHeader;
