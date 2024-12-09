import { FundsModal } from '@/components/Modals';
import { useModalManager } from '@/hooks/custom-hooks';
import { LabelPairedCircleInfoLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import './FundsBanner.scss';

const FundsBanner = () => {
    const { isDesktop } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const textSize = isDesktop ? 'sm' : 'md';

    return (
        <div className='funds-banner'>
            <InlineMessage
                className='funds-banner__inline-message'
                icon={<LabelPairedCircleInfoLgBoldIcon fill='#0777C4' height={24} width={24} />}
                iconPosition='center'
            >
                <div>
                    <Text className='mr-1' size={textSize}>
                        <Localize i18n_default_text='Your P2P funds are accessible through your Options trading account.' />
                    </Text>
                    <Button
                        className='funds-banner__inline-message__button'
                        color='black'
                        hideHoverStyles
                        onClick={() => showModal('FundsModal')}
                        textSize={textSize}
                        variant='ghost'
                    >
                        <Localize i18n_default_text='Learn more' />
                    </Button>
                </div>
            </InlineMessage>
            {!!isModalOpenFor('FundsModal') && <FundsModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default FundsBanner;
