import { Dispatch, SetStateAction } from 'react';
import { ORDERS_STATUS } from '@/constants/orders';
import { useQueryString } from '@/hooks/custom-hooks';
import { OrdersDateSelection } from '@/pages/orders/components/OrdersDateSelection';
import { getLocalizedTabs } from '@/utils/tabs';
import { useTranslations } from '@deriv-com/translations';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import './OrdersTableHeader.scss';

type TOrdersTableHeaderProps = {
    activeTab: string;
    fromDate: string | null;
    setFromDate: Dispatch<SetStateAction<string | null>>;
    setToDate: Dispatch<SetStateAction<string | null>>;
    toDate: string | null;
};

const OrdersTableHeader = ({ activeTab, fromDate, setFromDate, setToDate, toDate }: TOrdersTableHeaderProps) => {
    const { isDesktop } = useDevice();
    const { setQueryString } = useQueryString();
    const { localize } = useTranslations();

    return (
        <div className='orders-table-header' data-testid='dt_orders_table_header'>
            <Tabs
                TitleFontSize={isDesktop ? 'sm' : 'md'}
                activeTab={getLocalizedTabs(localize)[activeTab]}
                onChange={(index: number) =>
                    setQueryString({
                        tab: index === 0 ? ORDERS_STATUS.ACTIVE_ORDERS : ORDERS_STATUS.PAST_ORDERS,
                    })
                }
                variant='primary'
                wrapperClassName='orders-table-header__tabs'
            >
                <Tab title={localize('Active orders')} />
                <Tab title={localize('Past orders')} />
            </Tabs>
            {activeTab === ORDERS_STATUS.PAST_ORDERS && (
                <OrdersDateSelection
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    toDate={toDate}
                />
            )}
        </div>
    );
};

export default OrdersTableHeader;
