import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './ErrorModal.scss';

type TErrorModalProps = {
    buttonText?: string;
    isModalOpen: boolean;
    message?: string;
    onRequestClose: () => void;
    title?: string;
};

const ErrorModal = ({ buttonText, isModalOpen, message, onRequestClose, title }: TErrorModalProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'lg' : 'md';
    return (
        <Modal ariaHideApp={false} className='error-modal' isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
            <Modal.Header hideBorder onRequestClose={onRequestClose}>
                <Text size={textSize} weight='bold'>
                    {title ?? `Something's not right`}
                </Text>
            </Modal.Header>
            <Modal.Body className='error-modal__body'>
                <Text size={textSize}>{message ?? `Something's not right`}</Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    {buttonText ?? 'Ok'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
