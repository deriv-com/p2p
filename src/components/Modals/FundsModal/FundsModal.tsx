import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './FundsModal.scss';

type TFundsModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const FundsModal = ({ isModalOpen, onRequestClose }: TFundsModalProps) => {
    return (
        <Modal ariaHideApp={false} className='funds-modal' isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
            <Modal.Header className='funds-modal__header' hideBorder hideCloseIcon>
                <Text size='md' weight='bold'>
                    <Localize i18n_default_text='How to fund your trades?' />
                </Text>
            </Modal.Header>
            <Modal.Body className='funds-modal__body'>
                <div className='flex flex-col'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='For Options trading:' />
                    </Text>
                    <Text size='sm'>
                        <Localize i18n_default_text='Trade directly with funds from your Options trading account.' />
                    </Text>
                </div>
                <div className='flex flex-col'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='For CFDs trading:' />
                    </Text>
                    <Text size='sm'>
                        <Localize i18n_default_text='1. Transfer funds from your Options trading account to your USD Wallet.' />
                    </Text>
                    <Text size='sm'>
                        <Localize i18n_default_text='2. Then, move the funds from your USD Wallet to your CFDs account.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer className='funds-modal__footer' hideBorder>
                <Button onClick={() => onRequestClose()} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FundsModal;
