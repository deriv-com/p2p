import { useEffect, useState } from 'react';
import moment from 'moment';
import { ORDERS_STATUS } from '@/constants';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { Divider, useDevice } from '@deriv-com/ui';
import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';

const Orders = () => {
    const { queryString } = useQueryString();
    const { isMobile } = useDevice();
    const currentTab = queryString.tab ?? ORDERS_STATUS.ACTIVE_ORDERS;
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const isActive = currentTab === ORDERS_STATUS.ACTIVE_ORDERS;

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
            <OrdersTableHeader
                activeTab={currentTab}
                fromDate={fromDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                toDate={toDate}
            />
            {isMobile && <Divider />}
            <OrdersTable data={data} isActive={isActive} isLoading={isLoading} loadMoreOrders={loadMoreOrders} />
        </>
    );
};
export default Orders;
