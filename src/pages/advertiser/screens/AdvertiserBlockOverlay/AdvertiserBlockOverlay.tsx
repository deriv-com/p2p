import { PropsWithChildren } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './AdvertiserBlockOverlay.scss';

type TAdvertiserBlockOverlayProps = {
    advertiserName: string;
    isOverlayVisible: boolean;
    onClickUnblock: () => void;
};
const AdvertiserBlockOverlay = ({
    advertiserName,
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
                        <Localize i18n_default_text='You have blocked {{advertiserName}}' values={{ advertiserName }} />
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
