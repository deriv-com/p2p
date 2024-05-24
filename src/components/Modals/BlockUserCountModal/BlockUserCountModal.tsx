import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './BlockUserCountModal.scss';

type TBlockUserCountModalProps = {
    isModalOpen: boolean;
    message: string;
    onRequestClose: () => void;
};

const BlockUserCountModal = ({ isModalOpen, message, onRequestClose }: TBlockUserCountModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='block-user-count-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Body className='p-[2.4rem] pb-[0.8rem]'>
                <Text>{message}</Text>
            </Modal.Body>
            <Modal.Footer className='p-[1.6rem]' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='md'>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BlockUserCountModal;
