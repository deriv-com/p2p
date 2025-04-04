import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AwarenessBanner, PNVBanner } from '@/components';
import { ORDERS_STATUS } from '@/constants';
import { api } from '@/hooks';
import { useGetPhoneNumberVerification, useIsAdvertiser } from '@/hooks/custom-hooks';
import { useTabsStore } from '@/stores';
import { toMoment } from '@/utils';
import { Divider, Loader, useDevice } from '@deriv-com/ui';
import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';
import './Orders.scss';

const Orders = () => {
    const { isDesktop } = useDevice();
    const isAdvertiser = useIsAdvertiser();
    const { isGetSettingsLoading, shouldShowVerification } = useGetPhoneNumberVerification();
    const { activeOrdersTab } = useTabsStore(useShallow(state => ({ activeOrdersTab: state.activeOrdersTab })));
    const [fromDate, setFromDate] = useState<number | null>(null);
    const [toDate, setToDate] = useState<number>(toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix());
    const isActive = activeOrdersTab === ORDERS_STATUS.ACTIVE_ORDERS;

    const {
        data = [],
        isLoading,
        loadMoreOrders,
    } = api.order.useGetList({
        active: isActive ? 1 : 0,
        date_from: !isActive && fromDate ? fromDate.toString() : undefined,
        date_to: !isActive && toDate ? toDate.toString() : undefined,
    });

    const onChange = (dateValues: { from: number | null; isBatch: boolean; to: number | null }) => {
        const { from, isBatch, to } = dateValues;

        if (from) {
            setFromDate(toMoment(from).unix());
        } else if (isBatch) {
            setFromDate(null);
        }

        if (to) setToDate(toMoment(to).unix());
    };

    useEffect(() => {
        return () => {
            setFromDate(null);
            setToDate(toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix());
        };
    }, []);

    if (isGetSettingsLoading) {
        return <Loader />;
    }

    return (
        <div className='orders'>
            {isAdvertiser && shouldShowVerification && <PNVBanner />}
            <AwarenessBanner />
            <OrdersTableHeader fromDate={fromDate} onChange={onChange} toDate={toDate} />
            {!isDesktop && <Divider />}
            <OrdersTable data={data} isActive={isActive} isLoading={isLoading} loadMoreOrders={loadMoreOrders} />
        </div>
    );
};
export default Orders;
