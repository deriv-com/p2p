import { memo } from 'react';
import clsx from 'clsx';
import { THooks, TLocalize } from 'types';
import { Table } from '@/components';
import { api } from '@/hooks';
import { useIsAdvertiser } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader, useDevice } from '@deriv-com/ui';
import { OrdersEmpty } from '../OrdersEmpty';
import { OrdersTableRow } from '../OrdersTableRow';
import './OrdersTable.scss';

type TOrdersTableRowRendererProps = THooks.Order.GetList[number];

const OrdersTableRowRenderer = memo((values: TOrdersTableRowRendererProps) => <OrdersTableRow {...values} />);
OrdersTableRowRenderer.displayName = 'OrdersTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const getColumns = (isActive: boolean, localize: TLocalize) => {
    const columnsActive = [
        { header: localize('Order') },
        { header: localize('Order ID') },
        { header: localize('Counterparty') },
        { header: localize('Status') },
        { header: localize('Send') },
        { header: localize('Receive') },
        { header: localize('Time') },
    ];

    const columnsPast = [
        { header: localize('Date') },
        { header: localize('Order') },
        { header: localize('Order ID') },
        { header: localize('Counterparty') },
        { header: localize('Status') },
        { header: localize('Send') },
        { header: localize('Receive') },
    ];

    return isActive ? columnsActive : columnsPast;
};

type TOrdersTableProps = {
    data: THooks.Order.GetList;
    isActive: boolean;
    isLoading: boolean;
    loadMoreOrders: () => void;
};

const OrdersTable = ({ data, isActive, isLoading, loadMoreOrders }: TOrdersTableProps) => {
    const { isDesktop } = useDevice();
    const isAdvertiser = useIsAdvertiser();
    const { localize } = useTranslations();

    const { data: accountData } = api.account.useActiveAccount();
    const isAwarenessBannerHidden = localStorage.getItem(`p2p_${accountData?.loginid}_is_awareness_banner_hidden`);

    if (!isAdvertiser || (data?.length === 0 && !isLoading)) {
        return <OrdersEmpty isPast={!isActive} />;
    }

    return (
        <div
            className={clsx('orders-table', {
                'orders-table--has-no-banner': isActive && isAwarenessBannerHidden === 'true',
                'orders-table--inactive': !isActive,
                'orders-table--inactive--has-no-banner': !isActive && isAwarenessBannerHidden === 'true',
            })}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    columns={isDesktop ? getColumns(isActive, localize) : []}
                    data={data}
                    loadMoreFunction={loadMoreOrders}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <OrdersTableRowRenderer {...(rowData as TOrdersTableRowRendererProps)} />
                    )}
                    tableClassname=''
                />
            )}
        </div>
    );
};

export default OrdersTable;
