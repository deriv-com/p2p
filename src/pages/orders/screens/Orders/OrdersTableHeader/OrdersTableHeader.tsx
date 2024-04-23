import { ORDERS_STATUS } from '@/constants/orders';
import { useQueryString } from '@/hooks/custom-hooks';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import './OrdersTableHeader.scss';

type TOrdersTableHeaderProps = {
    activeTab: string;
};

const OrdersTableHeader = ({ activeTab }: TOrdersTableHeaderProps) => {
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    return (
        <div className='orders-table-header' data-testid='dt_orders_table_header'>
            <Tabs
                TitleFontSize={isMobile ? 'md' : 'sm'}
                activeTab={activeTab}
                onChange={(index: number) =>
                    setQueryString({
                        tab: index === 0 ? ORDERS_STATUS.ACTIVE_ORDERS : ORDERS_STATUS.PAST_ORDERS,
                    })
                }
                variant='primary'
                wrapperClassName='orders-table-header__tabs'
            >
                <Tab title={ORDERS_STATUS.ACTIVE_ORDERS} />
                <Tab title={ORDERS_STATUS.PAST_ORDERS} />
            </Tabs>
        </div>
    );
};

export default OrdersTableHeader;
