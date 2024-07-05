import { RATE_TYPE } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdRateSwitchModal.scss';

type TAdRateSwitchModalProps = {
    isModalOpen: boolean;
    onClickSet: () => void;
    onRequestClose: () => void;
    rateType?: string;
    reachedEndDate?: boolean;
};
const AdRateSwitchModal = ({
    isModalOpen,
    onClickSet,
    onRequestClose,
    rateType,
    reachedEndDate,
}: TAdRateSwitchModalProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const isFloat = rateType === RATE_TYPE.FLOAT;
    return (
        <Modal
            ariaHideApp={false}
            className='ad-rate-switch-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Body className='ad-rate-switch-modal__body'>
                <Text size='sm'>
                    {isFloat ? (
                        <Localize i18n_default_text='Set a floating rate for your ad.' />
                    ) : (
                        <Localize i18n_default_text='Set a fixed rate for your ad.' />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer className='ad-rate-switch-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    {reachedEndDate ? (
                        <Localize i18n_default_text='Cancel' />
                    ) : (
                        <Localize i18n_default_text="I'll do this later " />
                    )}
                </Button>
                <Button onClick={onClickSet} size='lg' textSize={textSize}>
                    {isFloat ? (
                        <Localize i18n_default_text='Set floating rate' />
                    ) : (
                        <Localize i18n_default_text='Set fixed rate' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdRateSwitchModal;
