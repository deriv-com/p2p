import { useHistory } from 'react-router-dom';
import { NicknameModal } from '@/components/Modals';
import { MY_ADS_URL } from '@/constants';
import { useIsAdvertiser, useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
import { DerivLightIcCashierNoAdsIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';

const MyAdsEmpty = () => {
    const { isMobile } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const history = useHistory();
    const textSize = isMobile ? 'lg' : 'md';
    return (
        <div className='mt-[11.8rem] mx-[1.6rem]'>
            <ActionScreen
                actionButtons={
                    <Button
                        disabled={isAdvertiserBarred}
                        onClick={() => {
                            if (isAdvertiser) history.push(`${MY_ADS_URL}/adForm?formAction=create`);
                            else showModal('NicknameModal');
                        }}
                        size='lg'
                        textSize={isMobile ? 'md' : 'sm'}
                    >
                        <Localize i18n_default_text='Create new ad' />
                    </Button>
                }
                description={
                    <Text align='center' data-testid='dt_no_ads_message' size={textSize}>
                        <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                    </Text>
                }
                icon={<DerivLightIcCashierNoAdsIcon height='128px' width='128px' />}
                title={
                    <Text data-testid='dt_no_ads' size={textSize} weight='bold'>
                        <Localize i18n_default_text='You have no ads 😞' />
                    </Text>
                }
            />
            {isModalOpenFor('NicknameModal') && <NicknameModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default MyAdsEmpty;
