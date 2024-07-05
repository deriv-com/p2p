import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodModal.scss';

type TPaymentMethodModalProps = {
    description?: string;
    isModalOpen: boolean;
    onConfirm: () => void;
    onReject: () => void;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    title?: string;
};

const PaymentMethodModal = ({
    description,
    isModalOpen,
    onConfirm,
    onReject,
    primaryButtonLabel,
    secondaryButtonLabel,
    title,
}: TPaymentMethodModalProps) => {
    const { isDesktop } = useDevice();
    const buttonTextSize = isDesktop ? 'sm' : 'md';

    return (
        <Modal
            ariaHideApp={false}
            className='payment-method-modal'
            contentLabel={title}
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='payment-method-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>{title}</Text>
            </Modal.Header>
            <Modal.Body className='payment-method-modal__body'>
                <Text size='sm'>{description}</Text>
            </Modal.Body>
            <Modal.Footer className='payment-method-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={e => {
                        e.currentTarget.setAttribute('disabled', 'disabled');
                        onConfirm();
                    }}
                    size='lg'
                    textSize={buttonTextSize}
                    variant='outlined'
                >
                    {secondaryButtonLabel}
                </Button>
                <Button
                    onClick={e => {
                        e.currentTarget.setAttribute('disabled', 'disabled');
                        onReject();
                    }}
                    size='lg'
                    textSize={buttonTextSize}
                >
                    {primaryButtonLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentMethodModal;
