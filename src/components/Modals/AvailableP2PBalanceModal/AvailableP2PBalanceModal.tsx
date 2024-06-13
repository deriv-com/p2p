import Modal from 'react-modal';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
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
            <Text as='p' weight='bold'>
                <Localize i18n_default_text='Deriv P2P balance' />
            </Text>
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
            <div className='available-balance-modal__footer'>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
