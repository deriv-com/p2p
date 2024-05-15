import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    EmailLinkBlockedModal,
    EmailLinkVerifiedModal,
    EmailVerificationModal,
    InvalidVerificationLinkModal,
    OrderDetailsCancelModal,
    OrderDetailsComplainModal,
    OrderDetailsConfirmModal,
} from '@/components/Modals';
import { ERROR_CODES } from '@/constants';
import { api } from '@/hooks';
import { useModalManager } from '@/hooks/custom-hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { Button, useDevice } from '@deriv-com/ui';
import { OrderDetailsCardReview } from '../OrderDetailsCardReview';
import './OrderDetailsCardFooter.scss';

const OrderDetailsCardFooter = ({ sendFile }: { sendFile: (file: File) => void }) => {
    const [verificationCode, setVerificationCode] = useState<string | undefined>(undefined);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const { orderDetails } = useOrderDetails();
    const {
        id,
        isBuyOrderForUser,
        isCompletedOrder,
        shouldShowCancelAndPaidButton,
        shouldShowComplainAndReceivedButton,
        shouldShowOnlyComplainButton,
        shouldShowOnlyReceivedButton,
        verification_next_request,
    } = orderDetails;

    const { isMobile } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data, error, isError, isSuccess, mutate, reset } = api.order.useConfirm();
    const textSize = isMobile ? 'md' : 'sm';

    const history = useHistory();
    const location = useLocation();

    const handleModalDisplay = (code?: string) => {
        if (isError) {
            if (code === ERROR_CODES.ORDER_EMAIL_VERIFICATION_REQUIRED && verification_next_request) {
                showModal('EmailVerificationModal');
            } else if (
                code === ERROR_CODES.INVALID_VERIFICATION_TOKEN ||
                code === ERROR_CODES.EXCESSIVE_VERIFICATION_REQUESTS
            ) {
                showModal('InvalidVerificationLinkModal');
            } else if (code === ERROR_CODES.EXCESSIVE_VERIFICATION_FAILURES) {
                showModal('EmailLinkBlockedModal');
            } else if (code === ERROR_CODES.ORDER_CONFIRM_COMPLETED) {
                history.replace({ pathname: location.pathname, search: '' });
            }
        } else if (isSuccess && verificationCode && data?.is_dry_run_successful) {
            showModal('EmailLinkVerifiedModal');
        } else if (isSuccess && !isBuyOrderForUser && orderDetails?.status === 'completed') {
            setShowRatingModal(true);

            // This is to help handle routing back to past orders tab after confirming order.
            // This is handled in OrderDetails
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('order_status', 'completed');
            history.replace({ pathname: location.pathname, search: searchParams.toString() });
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const actionParam = searchParams.get('action');
        const codeParam = searchParams.get('code');

        if (actionParam && codeParam) {
            setVerificationCode(codeParam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Need this useEffect to handle confirming order if verification code is present in the URL
    // If this is used in the above useEffect, it will invoke the mutation twice
    useEffect(() => {
        if (verificationCode) {
            mutate({ dry_run: 1, id, verification_code: verificationCode });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verificationCode]);

    useEffect(() => {
        handleModalDisplay(error?.error?.code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error?.error, isBuyOrderForUser, isError, isSuccess, verification_next_request, data, orderDetails?.status]);

    if (isCompletedOrder) {
        return <OrderDetailsCardReview setShowRatingModal={setShowRatingModal} showRatingModal={showRatingModal} />;
    }

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

    // If verification code params are present in the URL, clear the search params after the modal is closed
    const hideAndClearSearchParams = () => {
        history.replace({ pathname: location.pathname, search: '' });
        hideModal({ shouldHideAllModals: true });
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
                        Cancel order
                    </Button>
                    <Button onClick={() => showModal('OrderDetailsConfirmModal')} size='lg' textSize={textSize}>
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
                    <Button onClick={() => mutate({ id })} size='lg' textSize={textSize}>
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
                    <Button onClick={() => mutate({ id })} size='lg' textSize={textSize}>
                        I’ve received payment
                    </Button>
                </div>
            )}
            {!!isModalOpenFor('OrderDetailsComplainModal') && (
                <OrderDetailsComplainModal
                    id={id}
                    isBuyOrderForUser={isBuyOrderForUser}
                    isModalOpen
                    onRequestClose={hideModal}
                />
            )}
            {!!isModalOpenFor('OrderDetailsCancelModal') && (
                <OrderDetailsCancelModal id={id} isModalOpen onRequestClose={hideModal} />
            )}
            {!!isModalOpenFor('OrderDetailsConfirmModal') && (
                <OrderDetailsConfirmModal
                    isModalOpen
                    onCancel={hideModal}
                    onConfirm={onClickPaid}
                    onRequestClose={hideModal}
                    sendFile={sendFile}
                />
            )}
            {!!isModalOpenFor('EmailVerificationModal') && (
                <EmailVerificationModal
                    isModalOpen
                    nextRequestTime={verification_next_request!}
                    onRequestClose={hideModal}
                    onResendEmail={() => mutate({ id })}
                />
            )}
            {!!isModalOpenFor('InvalidVerificationLinkModal') && (
                <InvalidVerificationLinkModal
                    error={error?.error}
                    isModalOpen
                    mutate={() => mutate({ id })}
                    onRequestClose={() => {
                        hideAndClearSearchParams();
                        reset();
                    }}
                />
            )}
            {!!isModalOpenFor('EmailLinkBlockedModal') && (
                <EmailLinkBlockedModal
                    errorMessage={error?.error.message}
                    isModalOpen
                    onRequestClose={hideAndClearSearchParams}
                />
            )}
            {!!isModalOpenFor('EmailLinkVerifiedModal') && (
                <EmailLinkVerifiedModal
                    isModalOpen
                    onRequestClose={hideAndClearSearchParams}
                    onSubmit={() => {
                        mutate({ id, verification_code: verificationCode });
                        history.replace({ pathname: location.pathname, search: '' });
                    }}
                />
            )}
        </div>
    );
};

export default OrderDetailsCardFooter;
