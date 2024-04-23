import clsx from 'clsx';
import './OrderStatusTag.scss';

type TOrderStatusTagProps = {
    shouldHighlightAlert?: boolean;
    shouldHighlightDanger?: boolean;
    shouldHighlightDisabled?: boolean;
    shouldHighlightSuccess?: boolean;
    status: string;
};

const OrderStatusTag = ({
    shouldHighlightAlert = false,
    shouldHighlightDanger = false,
    shouldHighlightDisabled = false,
    shouldHighlightSuccess = false,
    status,
}: TOrderStatusTagProps) => {
    return (
        <div
            className={clsx('order-status-tag', {
                'order-status-tag--alert': shouldHighlightAlert,
                'order-status-tag--danger': shouldHighlightDanger,
                'order-status-tag--disabled': shouldHighlightDisabled,
                'order-status-tag--success': shouldHighlightSuccess,
            })}
        >
            {status}
        </div>
    );
};

export default OrderStatusTag;
