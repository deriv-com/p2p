import { DerivLightIcCashierBlockedIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './FallbackErrorModal.scss';

type TFallbackErrorModalProps = {
    errorMessage?: string;
};

const FallbackErrorModal = ({ errorMessage }: TFallbackErrorModalProps) => {
    return (
        <Modal ariaHideApp={false} className='fallback-error-modal' isOpen>
            <Modal.Body className='flex flex-col items-center gap-4 p-10'>
                <DerivLightIcCashierBlockedIcon height='100px' width='100px' />
                <Text weight='bold'>
                    <Localize i18n_default_text='Sorry for the interruption' />
                </Text>
                <Text size='sm'>
                    {errorMessage || <Localize i18n_default_text='Something went wrong. Please refresh the page.' />}
                </Text>
                <Button className='mt-4' onClick={() => window.location.reload()} size='lg' textSize='sm'>
                    <Localize i18n_default_text='Refresh' />
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default FallbackErrorModal;
