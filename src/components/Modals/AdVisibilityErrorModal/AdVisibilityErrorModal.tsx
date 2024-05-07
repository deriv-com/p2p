import { TCurrency, TTextSize } from 'types';
import { ERROR_CODES } from '@/constants';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
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
    limit: string,
    textSize = 'sm' as TTextSize
): {
    [key: string]: { description: JSX.Element; title: string };
} => {
    return {
        [ERROR_CODES.AD_EXCEEDS_BALANCE]: {
            description: (
                <>
                    <Text size={textSize}>
                        This could be because your account balance is insufficient, your ad amount exceeds your daily
                        limit, or both. You can still see your ad on
                    </Text>{' '}
                    <Text size={textSize} weight='bold'>
                        My ads
                    </Text>
                    <Text size={textSize}>.</Text>
                </>
            ),
            title: 'Your ad isn’t visible to others',
        },
        [ERROR_CODES.AD_EXCEEDS_DAILY_LIMIT]: {
            description: (
                <>
                    <Text size={textSize}>Your ad is not listed on</Text>{' '}
                    <Text size={textSize} weight='bold'>
                        Buy/Sell
                    </Text>
                    <Text
                        className='whitespace-pre-line'
                        size={textSize}
                    >{` because the amount exceeds your daily limit of ${limit} ${currency}.\n\n`}</Text>
                    <Text size={textSize}>You can still see your ad on</Text>{' '}
                    <Text size={textSize} weight='bold'>
                        My ads
                    </Text>
                    <Text size={textSize}>. If you’d like to increase your daily limit, please contact us via</Text>{' '}
                    <Button
                        className='ad-visibility-error-modal__body__button'
                        //TODO: open live chat
                        onClick={() => undefined}
                        // onClick={() => window.LC_API.open_chat_window()}
                        textSize={textSize}
                        variant='ghost'
                    >
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
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <Modal
            ariaHideApp={false}
            className='ad-visibility-error-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='ad-visibility-error-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    {getErrorMessage(currency, limit)[errorCode]?.title ?? 'Something’s not right'}
                </Text>
            </Modal.Header>
            <Modal.Body className='ad-visibility-error-modal__body'>
                {getErrorMessage(currency, limit, textSize)[errorCode]?.description ?? 'Something’s not right'}
            </Modal.Body>
            <Modal.Footer className='ad-visibility-error-modal__footer' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdVisibilityErrorModal;
