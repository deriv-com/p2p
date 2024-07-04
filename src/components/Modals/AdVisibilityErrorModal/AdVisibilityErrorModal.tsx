import { TCurrency, TTextSize } from 'types';
import { ERROR_CODES } from '@/constants';
import { Localize } from '@deriv-com/translations';
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
    [key: string]: { description: JSX.Element; title: JSX.Element };
} => {
    return {
        [ERROR_CODES.AD_EXCEEDS_BALANCE]: {
            description: (
                <>
                    <Text size={textSize}>
                        <Localize i18n_default_text='This could be because your account balance is insufficient, your ad amount exceeds your daily limit, or both. You can still see your ad on ' />
                    </Text>
                    <Text size={textSize} weight='bold'>
                        <Localize i18n_default_text='My ads' />
                    </Text>
                    <Text size={textSize}>.</Text>
                </>
            ),
            title: <Localize i18n_default_text='Your ad isn’t visible to others' />,
        },
        [ERROR_CODES.AD_EXCEEDS_DAILY_LIMIT]: {
            description: (
                <>
                    <Text size={textSize}>
                        <Localize i18n_default_text='Your ad is not listed on ' />
                    </Text>
                    <Text size={textSize} weight='bold'>
                        <Localize i18n_default_text='Buy/Sell' />
                    </Text>
                    <Text className='whitespace-pre-line' size={textSize}>
                        <Localize
                            i18n_default_text={` because the amount exceeds your daily limit of ${limit} ${currency}.\n\n`}
                            values={{ currency, limit }}
                        />
                    </Text>
                    <Text size={textSize}>
                        <Localize i18n_default_text='You can still see your ad on ' />
                    </Text>
                    <Text size={textSize} weight='bold'>
                        <Localize i18n_default_text='My ads' />
                    </Text>
                    <Text size={textSize}>
                        <Localize i18n_default_text='. If you’d like to increase your daily limit, please contact us via <0>live chat</0>' />
                    </Text>
                    <Button
                        className='ad-visibility-error-modal__body__button'
                        //TODO: open live chat
                        onClick={() => undefined}
                        // onClick={() => window.LC_API.open_chat_window()}
                        textSize={textSize}
                        variant='ghost'
                    >
                        <Localize i18n_default_text='live chat' />
                    </Button>
                </>
            ),
            title: <Localize i18n_default_text='Your ad exceeds the daily limit' />,
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
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
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
                {getErrorMessage(currency, limit, textSize)[errorCode]?.description ?? (
                    <Text size={textSize}>
                        <Localize i18n_default_text='Something’s not right' />
                    </Text>
                )}
            </Modal.Body>
            <Modal.Footer className='ad-visibility-error-modal__footer' hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdVisibilityErrorModal;
