import { useEffect } from 'react';
import { OrderDetailsCancelModal, OrderDetailsComplainModal, OrderDetailsConfirmModal } from '@/components/Modals';
import { ERROR_CODES } from '@/constants';
import { api } from '@/hooks';
import { useModalManager } from '@/hooks/custom-hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import './OrderDetailsCardFooter.scss';

// TODO: Implement functionality for each button when integrating with the API and disable buttons while chat is loading
const OrderDetailsCardFooter = ({ sendFile }: { sendFile: (file: File) => void }) => {
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
    const { error, isError, mutate } = api.order.useConfirm();
    const textSize = isMobile ? 'md' : 'sm';

    //TODO: handle email verification, invalid verification, and rating modals.
    const handleModalDisplay = (isError: boolean, isBuyOrderForUser: boolean, code?: string) => {
        if (isError) {
            if (code === ERROR_CODES.ORDER_EMAIL_VERIFICATION_REQUIRED) {
                showModal('EmailVerificationModal');
            } else if (
                code === ERROR_CODES.INVALID_VERIFICATION_TOKEN ||
                code === ERROR_CODES.EXCESSIVE_VERIFICATION_REQUESTS
            ) {
                showModal('InvalidVerificationLinkModal');
            } else if (code === ERROR_CODES.EXCESSIVE_VERIFICATION_FAILURES && isBuyOrderForUser) {
                showModal('EmailLinkBlockedModal');
            }
        } else if (!isBuyOrderForUser) {
            showModal('RatingModal');
        }
    };

    useEffect(() => {
        handleModalDisplay(isError, isBuyOrderForUser, error?.error?.code);
    }, [error?.error, isBuyOrderForUser, isError]);

    if (
        !shouldShowCancelAndPaidButton &&
        !shouldShowComplainAndReceivedButton &&
        !shouldShowOnlyComplainButton &&
        !shouldShowOnlyReceivedButton
    ) {
        return null;
    }

    const onClickPaid = () => {
        hideModal();
        mutate({ id });
    };

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
                        <Localize i18n_default_text='Cancel order' />
                    </Button>
                    <Button onClick={() => showModal('OrderDetailsConfirmModal')} size='lg' textSize={textSize}>
                        <Localize i18n_default_text='I’ve paid' />
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
                        <Localize i18n_default_text='Complain' />
                    </Button>
                    <Button size='lg' textSize={textSize}>
                        <Localize i18n_default_text='I’ve received payment' />
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
                        <Localize i18n_default_text='Complain' />
                    </Button>
                </div>
            )}
            {shouldShowOnlyReceivedButton && (
                <div className='ml-auto'>
                    <Button size='lg' textSize={textSize}>
                        <Localize i18n_default_text='I’ve received payment' />
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
            {!!isModalOpenFor('OrderDetailsConfirmModal') && (
                <OrderDetailsConfirmModal
                    isModalOpen={!!isModalOpenFor('OrderDetailsConfirmModal')}
                    onCancel={hideModal}
                    onConfirm={onClickPaid}
                    onRequestClose={hideModal}
                    sendFile={sendFile}
                />
            )}
        </div>
    );
};

export default OrderDetailsCardFooter;
