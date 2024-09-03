import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './CancelBusinessHoursModal.scss';

type TCancelBusinessHoursModalProps = {
    isModalOpen: boolean;
    onDiscard: () => void;
    onKeepEditing: () => void;
};

const CancelBusinessHoursModal = ({ isModalOpen, onDiscard, onKeepEditing }: TCancelBusinessHoursModalProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    return (
        <Modal ariaHideApp={false} className='cancel-business-hours-modal' isOpen={isModalOpen}>
            <Modal.Header className='lg:px-[2.4rem] px-[1.6rem]' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    <Localize i18n_default_text='Discard changes?' />
                </Text>
            </Modal.Header>
            <Modal.Body className='lg:px-[2.4rem] px-[1.6rem] lg:py-4 pb-2'>
                <Text size='sm'>
                    <Localize i18n_default_text='All unsaved changes to your business hours will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='gap-3 lg:px-[2.4rem] px-[1.6rem]' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onDiscard}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Discard' />
                </Button>
                <Button onClick={onKeepEditing} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Keep editing' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelBusinessHoursModal;
