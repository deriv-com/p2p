import { TErrorCodes } from 'types';
import { ERROR_CODES } from '@/constants';
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
        description: string;
        title: string;
    };
};

const errorContent: ErrorContent = {
    [ERROR_CODES.ADVERT_SAME_LIMITS]: {
        description:
            'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.',
        title: 'You already have an ad with this range',
    },
    [ERROR_CODES.DUPLICATE_ADVERT]: {
        description:
            'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.',
        title: 'You already have an ad with this rate',
    },
};

const AdCreateEditErrorModal = ({
    errorCode,
    errorMessage,
    isModalOpen,
    onRequestClose,
}: TAdCreateEditErrorModalProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <Modal
            ariaHideApp={false}
            className='ad-create-edit-error-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header className='ad-create-edit-error-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>{(errorCode && errorContent?.[errorCode]?.title) ?? 'Something’s not right'}</Text>
            </Modal.Header>
            <Modal.Body className='ad-create-edit-error-modal__body'>
                <Text size={textSize}>{(errorCode && errorContent?.[errorCode]?.description) ?? errorMessage}</Text>
            </Modal.Body>
            <Modal.Footer className='ad-create-edit-error-modal__footer' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    {errorCode && errorContent?.[errorCode]?.title ? 'Update ad' : 'Ok'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCreateEditErrorModal;
