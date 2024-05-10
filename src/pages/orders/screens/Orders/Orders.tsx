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

    const {
        data = [],
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
                isLoading={isLoading}
                loadMoreOrders={loadMoreOrders}
            />
        </>
    );
};
export default Orders;
