import { PropsWithChildren } from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './AdvertiserBlockOverlay.scss';

type TAdvertiserBlockOverlayProps = {
    isOverlayVisible: boolean;
    onClickUnblock: () => void;
};
const AdvertiserBlockOverlay = ({
    children,
    isOverlayVisible,
    onClickUnblock,
}: PropsWithChildren<TAdvertiserBlockOverlayProps>) => {
    const { isMobile } = useDevice();
    if (isOverlayVisible) {
        return (
            <div className='advertiser-block-overlay'>
                <div className='advertiser-block-overlay__wrapper'>
                    <Text
                        className='advertiser-block-overlay__wrapper-text'
                        size={isMobile ? 'lg' : 'md'}
                        weight='bold'
                    >
                        You have blocked
                    </Text>
                    <Button
                        className='border-2'
                        color='black'
                        onClick={onClickUnblock}
                        size='lg'
                        textSize={isMobile ? 'md' : 'sm'}
                        variant='outlined'
                    >
                        Unblock
                    </Button>
                </div>
                {children}
            </div>
        );
    }
    return children;
};

export default AdvertiserBlockOverlay;
