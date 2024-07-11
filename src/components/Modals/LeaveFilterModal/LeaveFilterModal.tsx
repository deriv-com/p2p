import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './LeaveFilterModal.scss';

type TLeaveFilterModalProps = {
    isModalOpen: boolean;
    onRequestClose: (shouldHide?: boolean) => void;
};

const LeaveFilterModal = ({ isModalOpen, onRequestClose }: TLeaveFilterModalProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    return (
        <Modal
            ariaHideApp={false}
            className='leave-filter-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='leave-filter-modal__header' hideBorder hideCloseIcon>
                <Text size={isDesktop ? 'md' : 'lg'} weight='bold'>
                    <Localize i18n_default_text='Leave page?' />
                </Text>
            </Modal.Header>

            <Modal.Body className='leave-filter-modal__body'>
                <Text size={textSize}>
                    <Localize i18n_default_text='Are you sure you want to leave this page? Changes made will not be saved.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='leave-filter-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={() => onRequestClose(false)}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button onClick={() => onRequestClose(true)} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Leave page' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LeaveFilterModal;
