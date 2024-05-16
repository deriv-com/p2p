import clsx from 'clsx';
import { ERROR_CODES } from '@/constants';
import {
    DerivLightIcEmailVerificationLinkBlockedIcon,
    DerivLightIcEmailVerificationLinkInvalidIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './InvalidVerificationLinkModal.scss';

type TInvalidVerificationLinkModalProps = {
    error?: {
        code: string;
        message: string;
    };
    isModalOpen: boolean;
    mutate: () => void;
    onRequestClose: () => void;
};

const InvalidVerificationLinkModal = ({
    error,
    isModalOpen,
    mutate,
    onRequestClose,
}: TInvalidVerificationLinkModalProps) => {
    const { isMobile } = useDevice();
    const iconSize = isMobile ? 96 : 128;
    const isInvalidVerification = error?.code === ERROR_CODES.INVALID_VERIFICATION_TOKEN;
    const isExcessiveErrorMobile = !isInvalidVerification && isMobile;

    return (
        <Modal
            ariaHideApp={false}
            className='invalid-verification-link-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header hideBorder onRequestClose={onRequestClose} />
            <Modal.Body
                className={clsx('flex flex-col items-center gap-[2.4rem] p-[2.4rem] pb-4', {
                    'py-0 px-[1.4rem] gap-[1.4rem]': isExcessiveErrorMobile,
                })}
            >
                {isInvalidVerification || !error ? (
                    <DerivLightIcEmailVerificationLinkInvalidIcon height={iconSize} width={iconSize} />
                ) : (
                    <DerivLightIcEmailVerificationLinkBlockedIcon height={iconSize} width={iconSize} />
                )}
                <Text align='center' weight={isInvalidVerification ? 'normal' : 'bold'}>
                    {error?.message || (
                        <Localize i18n_default_text='The verification link appears to be invalid. Hit the button below to request for a new one.' />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer
                className={clsx('justify-center', {
                    'pt-2 min-h-fit': isExcessiveErrorMobile,
                })}
                hideBorder
            >
                <Button
                    onClick={() => (isInvalidVerification ? mutate() : onRequestClose())}
                    size={isMobile ? 'md' : 'lg'}
                    textSize='sm'
                >
                    {isInvalidVerification || !error ? (
                        <Localize i18n_default_text='Get new link' />
                    ) : (
                        <Localize i18n_default_text='OK' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvalidVerificationLinkModal;
