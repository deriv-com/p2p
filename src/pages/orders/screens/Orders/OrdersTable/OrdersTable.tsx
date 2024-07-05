import { memo } from 'react';
import clsx from 'clsx';
import { THooks } from 'types';
import { Loader, Table, useDevice } from '@deriv-com/ui';
import { OrdersEmpty } from '../OrdersEmpty';
import { OrdersTableRow } from '../OrdersTableRow';
import './OrdersTable.scss';

type TOrdersTableRowRendererProps = THooks.Order.GetList[number];

const OrdersTableRowRenderer = memo((values: TOrdersTableRowRendererProps) => <OrdersTableRow {...values} />);
OrdersTableRowRenderer.displayName = 'OrdersTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const columnsActive = [
    {
        header: 'Order',
    },
    {
        header: 'Order ID',
    },
    {
        header: 'Counterparty',
    },
    {
        header: 'Status',
    },
    {
        header: 'Send',
    },
    {
        header: 'Receive',
    },
    {
        header: 'Time',
    },
];

const columnsPast = [
    {
        header: 'Date',
    },
    {
        header: 'Order',
    },
    {
        header: 'Order ID',
    },
    {
        header: 'Counterparty',
    },
    {
        header: 'Status',
    },
    {
        header: 'Send',
    },
    {
        header: 'Receive',
    },
];

type TOrdersTableProps = {
    data: THooks.Order.GetList;
    isActive: boolean;
    isLoading: boolean;
    loadMoreOrders: () => void;
};

const OrdersTable = ({ data, isActive, isLoading, loadMoreOrders }: TOrdersTableProps) => {
    const { isDesktop } = useDevice();
    if (data?.length === 0 && !isLoading) {
        return <OrdersEmpty isPast={!isActive} />;
    }

    const columns = isActive ? columnsActive : columnsPast;
    return (
        <div className={clsx('orders-table', { 'orders-table--inactive': !isActive })}>
            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    columns={isDesktop ? columns : []}
                    data={data}
                    loadMoreFunction={loadMoreOrders}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <OrdersTableRowRenderer {...(rowData as TOrdersTableRowRendererProps)} />
                    )}
                />
            )}
        </div>
    );
};

export default OrdersTable;
