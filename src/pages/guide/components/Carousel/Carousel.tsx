import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { useDevice } from '@deriv-com/ui';
import './Carousel.scss';

type TCarouselProps = {
    isControlVisible?: boolean;
    items: ReactNode[];
};

const Carousel = ({ isControlVisible = true, items }: TCarouselProps) => {
    const { isMobile } = useDevice();
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className='carousel'>
            <div className='carousel__container'>
                {items.map((item, index) => {
                    return (
                        <div
                            className='carousel__item'
                            key={index}
                            style={{
                                transform: `translate(-${currentIndex * 108}%)`,
                            }}
                        >
                            {item}
                        </div>
                    );
                })}
            </div>
            {isMobile && isControlVisible && (
                <div className='flex justify-center'>
                    {items.map((_item: ReactNode, index: number) => {
                        return (
                            <div
                                className={clsx('carousel__control mr-2', {
                                    'carousel__control--active': currentIndex === index,
                                })}
                                data-testid='dt_carousel_control'
                                key={index}
                                onClick={() => {
                                    scrollToIndex(index);
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Carousel;
