import { DerivLightIcEmailSentExpiredIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './EmailLinkExpiredModal.scss';

type TEmailLinkExpiredModal = {
    isModalOpen: boolean;
    onClickHandler: () => void;
    onRequestClose: () => void;
};

const EmailLinkExpiredModal = ({ isModalOpen, onClickHandler, onRequestClose }: TEmailLinkExpiredModal) => {
    const { isDesktop } = useDevice();
    const iconSize = isDesktop ? 128 : 96;
    return (
        <Modal
            ariaHideApp={false}
            className='email-link-expired-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header hideBorder onRequestClose={onRequestClose} />
            <Modal.Body className='email-link-expired-modal__body'>
                <DerivLightIcEmailSentExpiredIcon height={iconSize} width={iconSize} />
                <Text align='center' className='flex justify-center mt-[3.6rem]' weight='bold'>
                    <Localize i18n_default_text='The verification link appears to be invalid. Hit the button below to request for a new one' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='justify-center lg:py-[2.4rem]' hideBorder>
                <Button onClick={onClickHandler} size='lg' textSize='sm'>
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkExpiredModal;
