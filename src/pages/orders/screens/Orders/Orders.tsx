import { useEffect, useState } from 'react';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { PNVBanner } from '@/components';
import { ORDERS_STATUS } from '@/constants';
import { api } from '@/hooks';
import { useGetPhoneNumberVerification, useIsAdvertiser } from '@/hooks/custom-hooks';
import { useTabsStore } from '@/stores';
import { Divider, Loader, useDevice } from '@deriv-com/ui';
import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';
import './Orders.scss';

const Orders = () => {
    const { isDesktop } = useDevice();
    const isAdvertiser = useIsAdvertiser();
    const { isGetSettingsLoading, shouldShowVerification } = useGetPhoneNumberVerification();
    const { activeOrdersTab } = useTabsStore(useShallow(state => ({ activeOrdersTab: state.activeOrdersTab })));
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const isActive = activeOrdersTab === ORDERS_STATUS.ACTIVE_ORDERS;

    const {
        data = [],
        isFetching,
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

    if (isGetSettingsLoading) {
        return <Loader />;
    }

    return (
        <div className='orders'>
            {isAdvertiser && shouldShowVerification && <PNVBanner />}
            <OrdersTableHeader fromDate={fromDate} setFromDate={setFromDate} setToDate={setToDate} toDate={toDate} />
            {!isDesktop && <Divider />}
            <OrdersTable
                data={data}
                isActive={isActive}
                isLoading={isLoading || (isFetching && isActive)}
                loadMoreOrders={loadMoreOrders}
            />
        </div>
    );
};
export default Orders;
