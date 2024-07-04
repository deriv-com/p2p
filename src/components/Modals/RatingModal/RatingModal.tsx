import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { StarRating } from '@/components';
import { api } from '@/hooks';
import { StandaloneThumbsDownRegularIcon, StandaloneThumbsUpRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './RatingModal.scss';

export type TRatingModalProps = {
    isBuyOrder: boolean;
    isModalOpen: boolean;
    isRecommended?: boolean;
    isRecommendedPreviously?: boolean;
    onRequestClose: () => void;
    orderId: string;
};

const RatingModal = ({
    isBuyOrder,
    isModalOpen,
    isRecommended,
    isRecommendedPreviously,
    onRequestClose,
    orderId,
}: TRatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [isNoSelected, setIsNoSelected] = useState(false);
    const [isYesSelected, setIsYesSelected] = useState(false);
    const { mutate } = api.orderReview.useReview();

    const { isDesktop } = useDevice();
    const buttonTextSize = isDesktop ? 'xs' : 'sm';

    const handleSelectYes = () => {
        if (isNoSelected) {
            setIsNoSelected(false);
        }
        setIsYesSelected(prevState => !prevState);
    };

    const handleSelectNo = () => {
        if (isYesSelected) {
            setIsYesSelected(false);
        }
        setIsNoSelected(prevState => !prevState);
    };

    const getRecommendedValue = () => {
        if (isYesSelected || isNoSelected) {
            if (isYesSelected) return 1;
            else if (isNoSelected) return 0;
        } else {
            return undefined;
        }
    };

    useEffect(() => {
        if (isRecommendedPreviously) {
            if (isRecommended) {
                setIsYesSelected(true);
            } else {
                setIsNoSelected(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal ariaHideApp={false} className='rating-modal' isOpen={isModalOpen} onRequestClose={onRequestClose}>
            <Modal.Header hideBorder onRequestClose={onRequestClose}>
                <Text size='md' weight='bold'>
                    <Localize i18n_default_text='How would you rate this transaction?' />
                </Text>
            </Modal.Header>
            <Modal.Body className='px-0 py-4 lg:px-[2.4rem]'>
                <div className='rating-modal__stars' data-testid='dt_rating_modal_stars'>
                    <StarRating allowHover onClick={setRating} ratingValue={rating} starsScale={1.6} />
                </div>
                {rating > 0 && (
                    <div className='lg:px-0 pt-8 px-[2.4rem]'>
                        <Text size='sm'>
                            <Localize
                                i18n_default_text='Would you recommend this {{value}}?'
                                values={{ value: isBuyOrder ? 'seller' : 'buyer' }}
                            />
                        </Text>
                        <div className='mt-6 flex gap-3'>
                            <Button
                                className={clsx('rating-modal__button', {
                                    'rating-modal__button--disabled': !isYesSelected,
                                })}
                                color='black'
                                icon={
                                    <StandaloneThumbsUpRegularIcon
                                        fill={isYesSelected ? '#000' : '#999'}
                                        iconSize='sm'
                                    />
                                }
                                onClick={handleSelectYes}
                                size='sm'
                                variant='outlined'
                            >
                                <Text size={buttonTextSize}>
                                    <Localize i18n_default_text='Yes' />
                                </Text>
                            </Button>
                            <Button
                                className={clsx('rating-modal__button', {
                                    'rating-modal__button--disabled': !isNoSelected,
                                })}
                                color='black'
                                icon={
                                    <StandaloneThumbsDownRegularIcon
                                        fill={isNoSelected ? '#000' : '#999'}
                                        iconSize='sm'
                                    />
                                }
                                onClick={handleSelectNo}
                                size='sm'
                                variant='outlined'
                            >
                                <Text size={buttonTextSize}>
                                    <Localize i18n_default_text='No' />
                                </Text>
                            </Button>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button
                    className='border-2'
                    color={rating ? 'primary' : 'black'}
                    onClick={() => {
                        mutate({
                            order_id: orderId,
                            rating,
                            recommended: getRecommendedValue(),
                        });
                        onRequestClose();
                    }}
                    size='lg'
                    textSize={isDesktop ? 'sm' : 'md'}
                    variant={rating ? 'contained' : 'outlined'}
                >
                    {rating ? <Localize i18n_default_text='Done' /> : <Localize i18n_default_text='Skip' />}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;
