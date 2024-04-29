import Modal from 'react-modal';
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
            className='available-balance-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
            testId='dt_available_p2p_balance_modal'
        >
            <Text as='p' weight='bold'>
                Available Deriv P2P Balance
            </Text>
            <Text as='p' className='block-unblock-user-modal__text' size='sm'>
                Your Deriv P2P balance only includes deposits that cannot be reversed.
            </Text>
            <Text as='p' className='block-unblock-user-modal__text' size='sm'>
                Deposits via cards and the following payment methods aren’t included: Maestro, Diners Club, ZingPay,
                Skrill, Neteller, Ozow, and UPI QR.
            </Text>
            <div className='block-unblock-user-modal__footer'>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    Ok
                </Button>
            </div>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
