import { OrderDetailsCancelModal, OrderDetailsComplainModal } from '@/components/Modals';
import { useModalManager } from '@/hooks/custom-hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { Button, useDevice } from '@deriv-com/ui';
import './OrderDetailsCardFooter.scss';

// TODO: Implement functionality for each button when integrating with the API and disable buttons while chat is loading
const OrderDetailsCardFooter = () => {
    const { orderDetails } = useOrderDetails();
    const {
        id,
        isBuyOrderForUser,
        shouldShowCancelAndPaidButton,
        shouldShowComplainAndReceivedButton,
        shouldShowOnlyComplainButton,
        shouldShowOnlyReceivedButton,
    } = orderDetails;
    const { isMobile } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const textSize = isMobile ? 'md' : 'sm';

    if (
        !shouldShowCancelAndPaidButton &&
        !shouldShowComplainAndReceivedButton &&
        !shouldShowOnlyComplainButton &&
        !shouldShowOnlyReceivedButton
    ) {
        return null;
    }

    return (
        <div className='order-details-card-footer'>
            {shouldShowCancelAndPaidButton && (
                <div className='flex gap-3 ml-auto'>
                    <Button
                        className='border-2'
                        color='black'
                        onClick={() => showModal('OrderDetailsCancelModal')}
                        size='lg'
                        textSize={textSize}
                        variant='outlined'
                    >
                        Cancel order
                    </Button>
                    <Button size='lg' textSize={textSize}>
                        I’ve paid
                    </Button>
                </div>
            )}
            {shouldShowComplainAndReceivedButton && (
                <div className='justify-between'>
                    <Button
                        className='border-2'
                        color='primary-light'
                        onClick={() => showModal('OrderDetailsComplainModal')}
                        size='lg'
                        textSize={textSize}
                        variant='ghost'
                    >
                        Complain
                    </Button>
                    <Button size='lg' textSize={textSize}>
                        I’ve received payment
                    </Button>
                </div>
            )}
            {shouldShowOnlyComplainButton && (
                <div className='ml-auto'>
                    <Button
                        className='border-2'
                        color='primary-light'
                        onClick={() => showModal('OrderDetailsComplainModal')}
                        size='lg'
                        textSize={textSize}
                        variant='ghost'
                    >
                        Complain
                    </Button>
                </div>
            )}
            {shouldShowOnlyReceivedButton && (
                <div className='ml-auto'>
                    <Button size='lg' textSize={textSize}>
                        I’ve received payment
                    </Button>
                </div>
            )}
            {!!isModalOpenFor('OrderDetailsComplainModal') && (
                <OrderDetailsComplainModal
                    id={id}
                    isBuyOrderForUser={isBuyOrderForUser}
                    isModalOpen={!!isModalOpenFor('OrderDetailsComplainModal')}
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('OrderDetailsCancelModal') && (
                <OrderDetailsCancelModal
                    id={id}
                    isModalOpen={!!isModalOpenFor('OrderDetailsCancelModal')}
                    onRequestClose={hideModal}
                />
            )}
        </div>
    );
};

export default OrderDetailsCardFooter;
