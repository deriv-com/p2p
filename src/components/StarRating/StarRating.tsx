import { memo } from 'react';
import clsx from 'clsx';
import { Rating } from 'react-simple-star-rating';
import { LabelPairedStarLgFillIcon, LabelPairedStarLgRegularIcon } from '@deriv/quill-icons';
import './StarRating.scss';

type TStarRatingProps = {
    allowFraction?: boolean;
    allowHover?: boolean;
    className?: string;
    isReadonly?: boolean;
    onClick?: (rate: number) => void;
    ratingValue: number;
    starsScale?: number;
};

const StarRating = ({
    allowFraction = false,
    allowHover = false,
    className,
    isReadonly = false,
    onClick,
    ratingValue,
    starsScale = 1,
}: TStarRatingProps) => {
    return (
        <Rating
            allowFraction={allowFraction}
            allowHover={allowHover}
            className={clsx('star-rating', className)}
            emptyIcon={<LabelPairedStarLgRegularIcon data-testid='dt_star_rating_empty_star' fill='#FFAD3A' />}
            fillIcon={<LabelPairedStarLgFillIcon data-testid='dt_star_rating_full_star' fill='#FFAD3A' />}
            iconsCount={5}
            initialValue={ratingValue}
            onClick={onClick}
            readonly={isReadonly}
            size={12}
            style={{ transform: `scale(${starsScale})`, transformOrigin: 'left' }}
        />
    );
};

export default memo(StarRating);
