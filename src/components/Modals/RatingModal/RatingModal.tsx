import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { StarRating } from '@/components';
import { StandaloneThumbsDownRegularIcon, StandaloneThumbsUpRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './RatingModal.scss';

export type TRatingModalProps = {
    isBuyOrder: boolean;
    isModalOpen: boolean;
    isRecommendedPreviously: number | null;
    onRequestClose: () => void;
    ratingValue: number;
};

const RatingModal = ({
    isBuyOrder,
    isModalOpen,
    isRecommendedPreviously,
    onRequestClose,
    ratingValue,
}: TRatingModalProps) => {
    const [rating, setRating] = useState<number>(ratingValue);
    const [isNoSelected, setIsNoSelected] = useState(false);
    const [isYesSelected, setIsYesSelected] = useState(false);

    const { isMobile } = useDevice();
    const buttonTextSize = isMobile ? 'sm' : 'xs';

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

    useEffect(() => {
        if (isRecommendedPreviously !== null) {
            if (isRecommendedPreviously) {
                setIsYesSelected(true);
            } else {
                setIsNoSelected(true);
            }
        }
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
                    onClick={onRequestClose}
                    size='lg'
                    textSize={isMobile ? 'md' : 'sm'}
                    variant={rating ? 'contained' : 'outlined'}
                >
                    {rating ? <Localize i18n_default_text='Done' /> : <Localize i18n_default_text='Skip' />}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;
