import { ReactNode, useRef, useState } from 'react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { useDevice } from '@deriv-com/ui';
import './Carousel.scss';

type TCarouselProps = {
    isControlVisible?: boolean;
    items: ReactNode[];
};

const Carousel = ({ isControlVisible = true, items }: TCarouselProps) => {
    const { isMobile } = useDevice();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const onScroll = debounce(() => {
        const clientWidth = scrollRef.current?.clientWidth ?? 0;
        const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
        const totalWidth = clientWidth + 24;
        const selectedIndex = scrollLeft / totalWidth;

        setCurrentIndex(selectedIndex);
    }, 100);

    return (
        <div className='carousel'>
            <div className='carousel__container' onScroll={onScroll} ref={scrollRef}>
                {items.map((item, index) => {
                    return (
                        <div className='carousel__item' key={index}>
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
                                    const clientWidth = scrollRef.current?.clientWidth ?? 0;
                                    scrollRef.current?.scrollTo({ left: clientWidth * index });
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
