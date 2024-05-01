import { TCurrency } from 'types';
import { ERROR_CODES } from '@/constants';
import { Button, Modal, Text } from '@deriv-com/ui';
import './AdVisibilityErrorModal.scss';

type TAdVisibilityErrorModalProps = {
    currency: TCurrency;
    errorCode: string;
    isModalOpen: boolean;
    limit: string;
    onRequestClose: () => void;
};

const getErrorMessage = (
    currency: TCurrency,
    limit: string
): {
    [key: string]: { description: JSX.Element; title: string };
} => {
    return {
        [ERROR_CODES.AD_EXCEEDS_BALANCE]: {
            description: (
                <>
                    <Text>
                        This could be because your account balance is insufficient, your ad amount exceeds your daily
                        limit, or both. You can still see your ad on
                    </Text>
                    <Text weight='bold'>My ads.</Text>
                </>
            ),
            title: 'Your ad isn’t visible to others',
        },
        [ERROR_CODES.AD_EXCEEDS_DAILY_LIMIT]: {
            description: (
                <>
                    <Text>Your ad is not listed on</Text>
                    <Text weight='bold'>Buy/Sell</Text>
                    <Text>{`because the amount exceeds your daily limit of ${limit} ${currency}.`}</Text>
                    <br />
                    <Text>You can still see your ad on</Text>
                    <Text weight='bold'>My ads</Text>
                    <Text>. If you’d like to increase your daily limit, please contact us via</Text>
                    <Button onClick={() => window.LC_API.open_chat_window()} variant='ghost'>
                        live chat
                    </Button>
                </>
            ),
            title: 'Your ad exceeds the daily limit',
        },
    };
};
const AdVisibilityErrorModal = ({
    currency,
    errorCode,
    isModalOpen,
    limit,
    onRequestClose,
}: TAdVisibilityErrorModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='ad-visibility-error-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='ad-visibility-error-modal__header' hideBorder hideCloseIcon>
                <Text>{getErrorMessage(currency, limit)[errorCode].title}</Text>
            </Modal.Header>
            <Modal.Body className='ad-visibility-error-modal__body'>
                <Text size='sm'>{getErrorMessage(currency, limit)[errorCode].description}</Text>
            </Modal.Body>
            <Modal.Footer className='ad-visibility-error-modal__footer' hideBorder>
                <Button onClick={onRequestClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdVisibilityErrorModal;
