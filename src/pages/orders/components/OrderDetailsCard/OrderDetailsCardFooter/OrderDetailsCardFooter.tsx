import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
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
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { OrderDetailsCardReview } from '../OrderDetailsCardReview';
import './OrderDetailsCardFooter.scss';

const OrderDetailsCardFooter = ({ sendFile }: { sendFile: (file: File) => void }) => {
    const [verificationCode, setVerificationCode] = useState<string | undefined>(undefined);
    // const [hasEmailExpired, setHasEmailExpired] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const { orderDetails } = useOrderDetails();
    const {
        isBuyOrderForUser,
        isCompletedOrder,
        p2p_order_info: p2pOrderInfo,
        shouldShowCancelAndPaidButton,
        shouldShowComplainAndReceivedButton,
        shouldShowOnlyComplainButton,
        shouldShowOnlyReceivedButton,
        // verification_token_expiry: verificationTokenExpiry,
    } = orderDetails;

    const { orderId: id } = useParams<{ orderId: string }>();
    const { isMobile } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data, error, isError, isSuccess, mutate, reset } = api.order.useConfirm();
    const textSize = isMobile ? 'md' : 'sm';

    const history = useHistory();
    const location = useLocation();

    const handleModalDisplay = (code?: string) => {
        if (isError) {
            if (code === ERROR_CODES.ORDER_EMAIL_VERIFICATION_REQUIRED && p2pOrderInfo?.verification_next_request) {
                showModal('EmailVerificationModal');
            } else if (
                code === ERROR_CODES.INVALID_VERIFICATION_TOKEN ||
                code === ERROR_CODES.EXCESSIVE_VERIFICATION_REQUESTS
            ) {
                showModal('InvalidVerificationLinkModal');
            } else if (code === ERROR_CODES.EXCESSIVE_VERIFICATION_FAILURES) {
                showModal('EmailLinkBlockedModal');
            } else if (code === ERROR_CODES.ORDER_CONFIRM_COMPLETED) {
                // Clear search params if user tries to use verification link to a completed order
                history.replace({ pathname: location.pathname, search: '' });
            }
        } else if (isSuccess && verificationCode && data?.is_dry_run_successful) {
            showModal('EmailLinkVerifiedModal');
        } else if (isSuccess && !isBuyOrderForUser && orderDetails?.statusString === 'Completed') {
            setShowRatingModal(true);

            // This is to help handle routing back to past orders tab after confirming order.
            // This is handled in OrderDetails
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('order_status', 'completed');
            history.replace({ pathname: location.pathname, search: searchParams.toString() });
        }
        // TODO: Uncomment this block when implementing email link has expired modal
        // else if (
        //     verificationPending === 0 &&
        //     !isBuyOrderForUser &&
        //     orderDetails?.statusString !== 'Expired' &&
        //     orderDetails?.statusString !== 'Under Dispute' &&
        //     !verificationCode &&
        //     hasEmailExpired
        // ) {
        //     showModal('EmailLinkExpiredModal');
        // }
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
        // @ts-expect-error types are not correct from api-hooks
        handleModalDisplay(error?.code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // @ts-expect-error types are not correct from api-hooks
        error?.code,
        isBuyOrderForUser,
        isError,
        isSuccess,
        p2pOrderInfo?.verification_next_request,
        data?.is_dry_run_successful,
        p2pOrderInfo?.status,
    ]);

    // TODO: Uncomment this block when implementing email link has expired modal
    // useEffect(() => {
    //     if (verificationTokenExpiry) {
    //         const emailExpiryTime = epochToMoment(verificationTokenExpiry);
    //         const currentTime = epochToMoment(Date.now() / 1000);

    //         setHasEmailExpired(currentTime.isAfter(emailExpiryTime));
    //     }
    // }, [verificationTokenExpiry]);

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
                        <Localize i18n_default_text='Cancel order' />
                    </Button>
                    <Button onClick={() => showModal('OrderDetailsConfirmModal')} size='lg' textSize={textSize}>
                        <Localize i18n_default_text='I’ve paid' />
                    </Button>
                </div>
            )}
            {shouldShowComplainAndReceivedButton && (
                <div className='flex justify-end w-full'>
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
                    <Button onClick={() => mutate({ id })} size='lg' textSize={textSize}>
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
                    <Button onClick={() => mutate({ id })} size='lg' textSize={textSize}>
                        <Localize i18n_default_text='I’ve received payment' />
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
                    nextRequestTime={p2pOrderInfo!.verification_next_request!}
                    onRequestClose={hideModal}
                    onResendEmail={() => mutate({ id })}
                />
            )}
            {!!isModalOpenFor('InvalidVerificationLinkModal') && (
                <InvalidVerificationLinkModal
                    // @ts-expect-error types are not correct from api-hooks
                    error={error}
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
                    // @ts-expect-error types are not correct from api-hooks
                    errorMessage={error?.message}
                    isModalOpen
                    onRequestClose={hideAndClearSearchParams}
                />
            )}
            {!!isModalOpenFor('EmailLinkVerifiedModal') && (
                <EmailLinkVerifiedModal
                    isModalOpen
                    onRequestClose={() => {
                        hideAndClearSearchParams();
                        setVerificationCode(undefined);
                    }}
                    onSubmit={() => {
                        mutate({ id, verification_code: verificationCode });
                        history.replace({ pathname: location.pathname, search: '' });
                        setVerificationCode(undefined);
                    }}
                />
            )}
        </div>
    );
};

export default OrderDetailsCardFooter;
