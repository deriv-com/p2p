import { FundsModal } from '@/components/Modals';
import { useModalManager } from '@/hooks/custom-hooks';
import { LabelPairedCircleInfoLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import './FundsBanner.scss';

const FundsBanner = () => {
    const { isDesktop } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    return (
        <div className='funds-banner'>
            <InlineMessage
                className='funds-banner__inline-message'
                icon={<LabelPairedCircleInfoLgBoldIcon fill='#0777C4' height={24} width={24} />}
                iconPosition='center'
            >
                <Text size={isDesktop ? 'sm' : 'md'}>
                    <Localize
                        components={[
                            <a
                                className='font-bold underline cursor-pointer'
                                key={0}
                                onClick={() => showModal('FundsModal')}
                            />,
                        ]}
                        i18n_default_text='Your P2P funds are accessible through your Options trading account. <0>Learn more</0>'
                    />
                </Text>
            </InlineMessage>
            {!!isModalOpenFor('FundsModal') && <FundsModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default FundsBanner;
