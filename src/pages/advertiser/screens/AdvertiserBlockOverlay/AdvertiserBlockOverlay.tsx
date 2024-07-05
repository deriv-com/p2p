import { PropsWithChildren } from 'react';
import { BlockUnblockUserModal } from '@/components/Modals';
import { useModalManager } from '@/hooks';
import { DerivLightIcBlockIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './AdvertiserBlockOverlay.scss';

type TAdvertiserBlockOverlayProps = {
    advertiserName: string;
    id?: string;
    isOverlayVisible: boolean;
    onClickUnblock: () => void;
    setShowOverlay: (showOverlay: boolean) => void;
};
const AdvertiserBlockOverlay = ({
    advertiserName,
    children,
    id,
    isOverlayVisible,
    setShowOverlay,
}: PropsWithChildren<TAdvertiserBlockOverlayProps>) => {
    const { isDesktop } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    if (isOverlayVisible) {
        return (
            <div className='advertiser-block-overlay'>
                <div className='advertiser-block-overlay__wrapper'>
                    <DerivLightIcBlockIcon height={160} width={160} />
                    <Text
                        className='advertiser-block-overlay__wrapper-text'
                        size={isDesktop ? 'md' : 'lg'}
                        weight='bold'
                    >
                        <Localize i18n_default_text='You have blocked {{advertiserName}}' values={{ advertiserName }} />
                    </Text>
                    <Button
                        className='border-2'
                        color='black'
                        onClick={() => showModal('BlockUnblockUserModal')}
                        size='lg'
                        textSize={isDesktop ? 'sm' : 'md'}
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Unblock' />
                    </Button>
                </div>
                {children}
                <BlockUnblockUserModal
                    advertiserName={advertiserName}
                    id={id ?? ''}
                    isBlocked
                    isModalOpen={!!isModalOpenFor('BlockUnblockUserModal')}
                    onClickBlocked={() => setShowOverlay(false)}
                    onRequestClose={hideModal}
                />
            </div>
        );
    }
    return children;
};

export default AdvertiserBlockOverlay;
