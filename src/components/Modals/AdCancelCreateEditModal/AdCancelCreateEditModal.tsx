import { useHistory } from 'react-router-dom';
import { MY_ADS_URL } from '@/constants';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdCancelCreateEditModal.scss';

type TAdCancelCreateEditModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    resetValues?: () => void;
};

const AdCancelCreateEditModal = ({ isModalOpen, onRequestClose, resetValues }: TAdCancelCreateEditModalProps) => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const isEdit = !!advertId;
    const textSize = isDesktop ? 'sm' : 'md';
    return (
        <Modal
            ariaHideApp={false}
            className='ad-cancel-create-edit-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='ad-cancel-create-edit-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    {isEdit ? (
                        <Localize i18n_default_text='Cancel your edits?' />
                    ) : (
                        <Localize i18n_default_text='Cancel ad creation?' />
                    )}
                </Text>
            </Modal.Header>
            <Modal.Body className='ad-cancel-create-edit-modal__body'>
                <Text size='sm'>
                    {isEdit ? (
                        <Localize i18n_default_text='If you choose to cancel, the edited details will be lost.' />
                    ) : (
                        <Localize i18n_default_text="If you choose to cancel, the details you've entered will be lost." />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer className='ad-cancel-create-edit-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={() => {
                        resetValues?.();
                        history.push(MY_ADS_URL);
                    }}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Don’t cancel' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCancelCreateEditModal;
