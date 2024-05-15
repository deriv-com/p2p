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
                <Localize i18n_default_text='Available Deriv P2P Balance' />
            </Text>
            <Text as='p' className='block-unblock-user-modal__text' size='sm'>
                <Localize i18n_default_text='Your Deriv P2P balance only includes deposits that can’t be reversed.' />
            </Text>
            <Text as='p' className='block-unblock-user-modal__text' size='sm'>
                <Localize i18n_default_text='Deposits via cards and the following payment methods aren’t included: Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR.' />
            </Text>
            <div className='block-unblock-user-modal__footer'>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </div>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
