import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { DerivLightIcEmailVerificationLinkValidIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './EmailLinkVerifiedModal.scss';

type TEmailLinkVerifiedModal = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
};

const EmailLinkVerifiedModal = ({ isModalOpen, onRequestClose, onSubmit }: TEmailLinkVerifiedModal) => {
    const { orderDetails } = useOrderDetails();

    return (
        <Modal ariaHideApp={false} className='email-link-verified-modal' isOpen={isModalOpen}>
            <Modal.Header hideBorder onRequestClose={onRequestClose} />
            <Modal.Body className='flex flex-col items-center gap-[2.4rem] px-[2.4rem] pt-[2.4rem]'>
                <DerivLightIcEmailVerificationLinkValidIcon height={128} width={128} />
                <Text align='center' weight='bold'>
                    <Localize i18n_default_text='One last step before we close this order' />
                </Text>
                <Text align='center'>
                    <Localize
                        i18n_default_text='If you’ve received {{amount}} {{currency}} from 
                    {{name}} in your bank account or e-wallet, hit the button below to
                    complete the order.'
                        values={{
                            amount: orderDetails?.amount,
                            currency: orderDetails?.local_currency,
                            name: orderDetails.advertiser_details.name,
                        }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='justify-center lg:mt-4 mt-0' hideBorder>
                <Button onClick={onSubmit} size='md'>
                    <Localize i18n_default_text='Confirm' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkVerifiedModal;
