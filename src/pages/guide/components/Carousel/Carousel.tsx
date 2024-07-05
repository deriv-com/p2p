import { ReactNode, useRef, useState } from 'react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { useDevice } from '@deriv-com/ui';
import { GuideCard } from '../GuideCard';
import './Carousel.scss';

type TCarouselItem = {
    className?: string;
    description: ReactNode;
    icon: ReactNode;
    id: number;
    title: ReactNode;
};

type TCarouselProps = {
    isControlVisible?: boolean;
    items: TCarouselItem[];
};

const Carousel = ({ isControlVisible = true, items }: TCarouselProps) => {
    const { isDesktop } = useDevice();
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
                {items.map(item => {
                    return (
                        <div className='carousel__item' key={item.id}>
                            <GuideCard {...item} />
                        </div>
                    );
                })}
            </div>
            {!isDesktop && isControlVisible && (
                <div className='flex justify-center'>
                    {items.map((item: TCarouselItem, index: number) => {
                        return (
                            <div
                                className={clsx('carousel__control mr-2', {
                                    'carousel__control--active': currentIndex === index,
                                })}
                                data-testid='dt_carousel_control'
                                key={item.id}
                                onClick={() => {
                                    const clientWidth = scrollRef.current?.clientWidth ?? 0;
                                    scrollRef.current?.scrollTo?.({ left: clientWidth * index });
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
