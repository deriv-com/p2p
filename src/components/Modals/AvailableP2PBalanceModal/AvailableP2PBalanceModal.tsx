import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './AvailableP2PBalanceModal.scss';

type TAvailableP2PBalanceModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const AvailableP2PBalanceModal = ({ isModalOpen, onRequestClose }: TAvailableP2PBalanceModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='available-balance-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
            testId='dt_available_p2p_balance_modal'
        >
            <Modal.Header className='p-0 h-auto' hideBorder hideCloseIcon>
                <Text as='p' weight='bold'>
                    <Localize i18n_default_text='Deriv P2P balance' />
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='available-balance-modal__text' size='sm'>
                    <Localize i18n_default_text='Your Deriv P2P balance includes:' />
                </Text>
                <ol className='available-balance-modal__list'>
                    <Text as='li' size='sm'>
                        <Localize i18n_default_text='P2P deposits: Funds received from buying USD from another Deriv P2P user.' />
                    </Text>
                    <Text as='li' size='sm'>
                        <Localize i18n_default_text='Non-reversible deposits: Deposits from non-reversible payment methods.' />
                    </Text>
                </ol>
                <Text as='p' className='available-balance-modal__note' size='sm'>
                    <Localize i18n_default_text='Note: Funds deposited using reversible payment methods, like credit cards, Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR will not appear in your P2P balance.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='p-0 min-h-auto' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
