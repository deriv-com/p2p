import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './RemainingBuySellLimitModal.scss';

type TRemainingBuySellLimitModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const RemainingBuySellLimitModal = ({ isModalOpen, onRequestClose }: TRemainingBuySellLimitModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='remaining-buy-sell-limit-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <Modal.Header className='px-0 pb-9 h-auto' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    <Localize i18n_default_text='Daily limit' />
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='remaining-buy-sell-limit-modal__text' size='sm'>
                    <Localize i18n_default_text='Amount left to trade today. Limits reset every 24 hours.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='p-0 min-h-fit' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RemainingBuySellLimitModal;
