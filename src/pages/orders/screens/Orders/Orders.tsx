import { Divider, useDevice } from '@deriv-com/ui';

import { ORDERS_STATUS } from '@/constants';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';

import { OrdersTable } from './OrdersTable';
import { OrdersTableHeader } from './OrdersTableHeader';

const Orders = () => {
    const { queryString } = useQueryString();
    const { isMobile } = useDevice();
    const currentTab = queryString.tab ?? ORDERS_STATUS.ACTIVE_ORDERS;

    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreOrders,
    } = api.order.useGetList({ active: currentTab === ORDERS_STATUS.ACTIVE_ORDERS ? 1 : 0 });

    return (
        <>
            <OrdersTableHeader activeTab={currentTab} />
            {isMobile && <Divider />}
            <OrdersTable
                data={data}
                isActive={currentTab === ORDERS_STATUS.ACTIVE_ORDERS}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreOrders={loadMoreOrders}
            />
        </>
    );
};
export default Orders;
