import { ReactNode } from 'react';
import clsx from 'clsx';
import './GuideCard.scss';

type TGuideCardProps = {
    className?: string;
    description: ReactNode;
    icon?: ReactNode;
    media?: ReactNode;
    title: ReactNode;
};

const GuideCard = ({ className, description, icon, media, title }: TGuideCardProps) => {
    return (
        <div className={clsx('guide-card', className)}>
            {icon && <div className='guide-card__icon'>{icon}</div>}
            {media && <div className='guide-card__media'>{media}</div>}
            <div className='guide-card__title'>{title}</div>
            <div className='guide-card__description'>{description}</div>
        </div>
    );
};

export default GuideCard;
