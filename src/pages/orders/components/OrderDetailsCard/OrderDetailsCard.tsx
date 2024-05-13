import { LightDivider } from '@/components';
import { useDevice } from '@deriv-com/ui';
import { OrderDetailsCardFooter } from './OrderDetailsCardFooter';
import { OrderDetailsCardHeader } from './OrderDetailsCardHeader';
import { OrderDetailsCardInfo } from './OrderDetailsCardInfo';
import { OrderDetailsCardReview } from './OrderDetailsCardReview';
import './OrderDetailsCard.scss';

const OrderDetailsCard = ({ sendFile }: { sendFile: (file: File) => void }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='order-details-card'>
            <OrderDetailsCardHeader />
            <LightDivider />
            <OrderDetailsCardInfo />
            <LightDivider />
            <OrderDetailsCardReview />
            {isDesktop && <OrderDetailsCardFooter sendFile={sendFile} />}
        </div>
    );
};

export default OrderDetailsCard;
