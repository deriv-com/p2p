import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodErrorModal.scss';

type TPaymentMethodErrorModalProps = {
    errorMessage: string;
    isModalOpen: boolean;
    onConfirm: () => void;
    title: string;
};

const PaymentMethodErrorModal = ({ errorMessage, isModalOpen, onConfirm, title }: TPaymentMethodErrorModalProps) => {
    const { isDesktop } = useDevice();

    return (
        <Modal
            ariaHideApp={false}
            className='payment-method-error-modal'
            contentLabel={title}
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='payment-method-error-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>{title}</Text>
            </Modal.Header>
            <Modal.Body className='payment-method-error-modal__body'>
                <Text size='sm'>{errorMessage}</Text>
            </Modal.Body>
            <Modal.Footer className='payment-method-error-modal__footer' hideBorder>
                <Button onClick={onConfirm} size='lg' textSize={isDesktop ? 'sm' : 'md'}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentMethodErrorModal;
