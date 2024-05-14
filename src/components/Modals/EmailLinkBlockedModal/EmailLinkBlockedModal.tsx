import { DerivLightIcEmailVerificationLinkBlockedIcon } from '@deriv/quill-icons';
import { Modal, Text, useDevice } from '@deriv-com/ui';
import './EmailLinkBlockedModal.scss';

type TEmailLinkBlockedModalProps = {
    errorMessage?: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const EmailLinkBlockedModal = ({ errorMessage, isModalOpen, onRequestClose }: TEmailLinkBlockedModalProps) => {
    const { isMobile } = useDevice();
    const iconSize = isMobile ? 96 : 128;

    return (
        <Modal
            ariaHideApp={false}
            className='email-link-blocked-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header hideBorder onRequestClose={onRequestClose} />
            <Modal.Body className='flex flex-col items-center lg:gap-[2.4rem] gap-8 p-[2.4rem] lg:pt-4 pt-0'>
                <DerivLightIcEmailVerificationLinkBlockedIcon height={iconSize} width={iconSize} />
                <Text align='center' weight='bold'>
                    Too many failed attempts
                </Text>
                <Text align='center'>{errorMessage}</Text>
            </Modal.Body>
        </Modal>
    );
};

export default EmailLinkBlockedModal;
