import { LightDivider } from '@/components';
import { useDevice } from '@deriv-com/ui';
import { OrderDetailsCardFooter } from './OrderDetailsCardFooter';
import { OrderDetailsCardHeader } from './OrderDetailsCardHeader';
import { OrderDetailsCardInfo } from './OrderDetailsCardInfo';
import { OrderDetailsCardReview } from './OrderDetailsCardReview';
import './OrderDetailsCard.scss';

const OrderDetailsCard = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='order-details-card'>
            <OrderDetailsCardHeader />
            <LightDivider />
            <OrderDetailsCardInfo />
            <LightDivider />
            <OrderDetailsCardReview />
            {isDesktop && <OrderDetailsCardFooter />}
        </div>
    );
};

export default OrderDetailsCard;
