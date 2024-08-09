import { ReactNode } from 'react';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useDotButton } from '@/hooks/custom-hooks';
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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    const { onDotButtonClick, scrollSnaps, selectedIndex } = useDotButton(emblaApi);

    return (
        <div className='carousel'>
            <div className='overflow-hidden' ref={!isDesktop ? emblaRef : undefined}>
                <div className='carousel__container'>
                    {items.map(item => (
                        <div className='carousel__item' key={item.id}>
                            <GuideCard {...item} />
                        </div>
                    ))}
                </div>
            </div>
            {!isDesktop && isControlVisible && (
                <div className='flex justify-center'>
                    {scrollSnaps.map((item, index) => (
                        <div
                            className={clsx('carousel__control mr-2', {
                                'carousel__control--active': selectedIndex === index,
                            })}
                            data-testid='dt_carousel_control'
                            key={item}
                            onClick={() => onDotButtonClick(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
