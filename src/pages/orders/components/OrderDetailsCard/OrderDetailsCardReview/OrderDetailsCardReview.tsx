import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarRating } from '@/components';
import { RatingModal } from '@/components/Modals';
import { api } from '@/hooks';
import { useModalManager } from '@/hooks/custom-hooks';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { getDateAfterHours } from '@/utils';
import { StandaloneStarFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { RecommendationStatus } from './RecommendationStatus';

type TOrderDetailsCardReviewProps = {
    setShowRatingModal: (showRatingModal: boolean) => void;
    showRatingModal: boolean;
};

const OrderDetailsCardReview = ({ setShowRatingModal, showRatingModal }: TOrderDetailsCardReviewProps) => {
    const { orderDetails } = useOrderDetails();
    const { orderId: id } = useParams<{ orderId: string }>();
    const {
        client_details: clientDetails,
        hasReviewDetails,
        is_reviewable: isReviewable,
        isBuyOrderForUser,
        isCompletedOrder,
        p2p_order_info,
        review_details: reviewDetails,
    } = orderDetails;
    const { data: p2pSettingsData } = api.settings.useSettings();
    const [remainingReviewTime, setRemainingReviewTime] = useState<string | null>(null);
    const ratingAverageDecimals = reviewDetails ? Number(Number(reviewDetails.rating).toFixed(1)) : 0;
    const { isMobile } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });

    useEffect(() => {
        if (showRatingModal) showModal('RatingModal');
    }, [showModal, showRatingModal]);

    useEffect(() => {
        if (p2p_order_info?.completion_time && p2pSettingsData?.review_period) {
            setRemainingReviewTime(getDateAfterHours(p2p_order_info?.completion_time, p2pSettingsData.review_period));
        }
    }, [p2p_order_info?.completion_time, p2pSettingsData?.review_period]);

    if (isCompletedOrder && !hasReviewDetails)
        return (
            <div className='flex flex-col px-[1.6rem] py-10 gap-3 lg:static absolute top-[31rem] w-full'>
                <Button
                    className='border-[1px] gap-[0.2rem] pl-4 pr-[1.4rem] w-fit'
                    color='black'
                    disabled={!isReviewable}
                    icon={<StandaloneStarFillIcon fill='#FFAD3A' height={18} width={18} />}
                    onClick={() => showModal('RatingModal')}
                    variant='outlined'
                >
                    <Text size={isMobile ? 'sm' : 'xs'}>
                        {isReviewable ? (
                            <Localize i18n_default_text='Rate this transaction' />
                        ) : (
                            <Localize i18n_default_text='Not rated' />
                        )}
                    </Text>
                </Button>
                <Text color='less-prominent' size={isMobile ? 'xs' : '2xs'}>
                    {isReviewable ? (
                        <Localize
                            i18n_default_text='You have until {{remainingReviewTime}} GMT to rate this transaction.'
                            values={{ remainingReviewTime }}
                        />
                    ) : (
                        <Localize i18n_default_text='You can no longer rate this transaction.' />
                    )}
                </Text>
                {!!isModalOpenFor('RatingModal') && (
                    <RatingModal
                        isBuyOrder={isBuyOrderForUser}
                        isModalOpen
                        isRecommended={clientDetails?.is_recommended}
                        isRecommendedPreviously={!clientDetails?.has_not_been_recommended}
                        onRequestClose={() => {
                            if (showRatingModal) setShowRatingModal(false);
                            hideModal();
                        }}
                        orderId={id}
                    />
                )}
            </div>
        );

    if (hasReviewDetails) {
        return (
            <div className='flex flex-col px-[1.6rem] py-10 gap-4 lg:static absolute top-[31rem] w-full'>
                <Text weight='bold'>
                    <Localize i18n_default_text='Your transaction experience' />
                </Text>
                <div className='flex justify-between w-4/5 ml-2'>
                    <StarRating isReadonly ratingValue={ratingAverageDecimals} starsScale={1.2} />
                    <RecommendationStatus />
                </div>
            </div>
        );
    }

    return null;
};

export default OrderDetailsCardReview;
