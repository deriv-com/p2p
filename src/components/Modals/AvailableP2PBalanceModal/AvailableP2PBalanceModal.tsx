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
            <Modal.Header className='pl-0 h-auto' hideBorder hideCloseIcon>
                <Text as='p' weight='bold'>
                    <Localize i18n_default_text='Deriv P2P balance' />
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='available-balance-modal__text' size='sm'>
                    <Localize i18n_default_text='Your Deriv P2P balance only includes:' />
                </Text>
                <ol className='available-balance-modal__list'>
                    <Text as='li' size='sm'>
                        <Localize i18n_default_text='Funds received from buying and selling USD through Deriv P2P.' />
                    </Text>
                    <Text as='li' size='sm'>
                        <Localize i18n_default_text='Profits from your trades, which you can sell to other Deriv P2P users.' />
                    </Text>
                    <Text as='li' size='sm'>
                        <Localize i18n_default_text='Deposits via payment methods that are acceptable on Deriv P2P.' />
                    </Text>
                </ol>
            </Modal.Body>
            <Modal.Footer className='p-0 min-h-fit' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
