import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { DerivLightIcEmailVerificationLinkValidIcon } from '@deriv/quill-icons';
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
                    One last step before we close this order
                </Text>
                <Text align='center'>
                    If you’ve received {orderDetails.amount} {orderDetails.local_currency} from{' '}
                    {orderDetails.advertiser_details.name} in your bank account or e-wallet, hit the button below to
                    complete the order.
                </Text>
            </Modal.Body>
            <Modal.Footer className='justify-center lg:mt-4 mt-0' hideBorder>
                <Button onClick={onSubmit} size='md'>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkVerifiedModal;
