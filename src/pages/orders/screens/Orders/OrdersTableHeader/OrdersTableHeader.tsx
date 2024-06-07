import { ORDERS_STATUS } from '@/constants/orders';
import { useQueryString } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import './OrdersTableHeader.scss';

type TOrdersTableHeaderProps = {
    activeTab: string;
};

const OrdersTableHeader = ({ activeTab }: TOrdersTableHeaderProps) => {
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();
    const { localize } = useTranslations();

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
                <Tab title={localize('Active orders')} />
                <Tab title={localize('Past orders')} />
            </Tabs>
        </div>
    );
};

export default OrdersTableHeader;
