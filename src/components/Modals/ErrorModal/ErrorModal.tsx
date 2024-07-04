import clsx from 'clsx';
import { TGenericSizes } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './ErrorModal.scss';

type TErrorModalProps = {
    bodyClassName?: string;
    buttonText?: string;
    buttonTextSize?: TGenericSizes;
    hideCloseIcon?: boolean;
    isModalOpen: boolean;
    message?: string;
    onRequestClose: () => void;
    showTitle?: boolean;
    textSize?: TGenericSizes;
    title?: string;
};

const ErrorModal = ({
    bodyClassName,
    buttonText,
    buttonTextSize = 'sm',
    hideCloseIcon = false,
    isModalOpen,
    message,
    onRequestClose,
    showTitle = true,
    textSize,
    title,
}: TErrorModalProps) => {
    const { isDesktop } = useDevice();
    const defaultTextSize = !isDesktop ? 'md' : 'sm';
    return (
        <Modal ariaHideApp={false} className='error-modal' isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
            {showTitle && (
                <Modal.Header
                    className='lg:pl-[2.4rem] pl-[1.6rem]'
                    hideBorder
                    hideCloseIcon={hideCloseIcon}
                    onRequestClose={onRequestClose}
                >
                    <Text size='md' weight='bold'>
                        {title ?? <Localize i18n_default_text='Something’s not right' />}
                    </Text>
                </Modal.Header>
            )}
            <Modal.Body className={clsx('error-modal__body', bodyClassName)}>
                <Text size={textSize ?? defaultTextSize}>
                    {message ?? <Localize i18n_default_text='Something’s not right' />}
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={buttonTextSize}>
                    {buttonText ?? <Localize i18n_default_text='OK' />}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
