import { TErrorCodes } from 'types';
import { ERROR_CODES } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdCreateEditErrorModal.scss';

type TAdCreateEditErrorModalProps = {
    errorCode?: TErrorCodes;
    errorMessage?: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

type ErrorContent = {
    [key in TErrorCodes]?: {
        title: string;
    };
};

const errorContent: ErrorContent = {
    [ERROR_CODES.ADVERT_SAME_LIMITS]: {
        title: 'You already have an ad with this range',
    },
    [ERROR_CODES.DUPLICATE_ADVERT]: {
        title: 'You already have an ad with this rate',
    },
};

const AdCreateEditErrorModal = ({
    errorCode,
    errorMessage,
    isModalOpen,
    onRequestClose,
}: TAdCreateEditErrorModalProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    return (
        <Modal
            ariaHideApp={false}
            className='ad-create-edit-error-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header className='ad-create-edit-error-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    {(errorCode && errorContent?.[errorCode]?.title) ?? (
                        <Localize i18n_default_text='Something’s not right' />
                    )}
                </Text>
            </Modal.Header>
            <Modal.Body className='ad-create-edit-error-modal__body'>
                <Text size={textSize}>{errorMessage}</Text>
            </Modal.Body>
            <Modal.Footer className='ad-create-edit-error-modal__footer' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    {errorCode && errorContent?.[errorCode]?.title ? (
                        <Localize i18n_default_text='Update ad' />
                    ) : (
                        <Localize i18n_default_text='OK' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCreateEditErrorModal;
