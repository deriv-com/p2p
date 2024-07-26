import { useEffect, useState } from 'react';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { ORDERS_STATUS } from '@/constants';
import { api } from '@/hooks';
import { useTabsStore } from '@/stores';
import { Divider, useDevice } from '@deriv-com/ui';
import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';

const Orders = () => {
    const { isDesktop } = useDevice();
    const { activeOrdersTab } = useTabsStore(useShallow(state => ({ activeOrdersTab: state.activeOrdersTab })));
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const isActive = activeOrdersTab === ORDERS_STATUS.ACTIVE_ORDERS;

    const {
        data = [],
        isLoading,
        loadMoreOrders,
    } = api.order.useGetList({
        active: isActive ? 1 : 0,
        date_from: !isActive && fromDate ? `${moment(fromDate).startOf('day').unix()}` : undefined,
        date_to: !isActive && toDate ? `${moment(toDate).endOf('day').unix()}` : undefined,
    });

    useEffect(() => {
        return () => {
            setFromDate(null);
            setToDate(null);
        };
    }, []);

    return (
        <>
            <OrdersTableHeader fromDate={fromDate} setFromDate={setFromDate} setToDate={setToDate} toDate={toDate} />
            {!isDesktop && <Divider />}
            <OrdersTable data={data} isActive={isActive} isLoading={isLoading} loadMoreOrders={loadMoreOrders} />
        </>
    );
};
export default Orders;
