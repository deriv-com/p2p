import clsx from 'clsx';
import { ERROR_CODES } from '@/constants';
import { DerivLightIcEmailVerificationLinkInvalidIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './InvalidVerificationLinkModal.scss';

type TInvalidVerificationLinkModalProps = {
    error: {
        code: string;
        message: string;
    } | null;
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
    const { isDesktop } = useDevice();
    const iconSize = isDesktop ? 128 : 96;
    const isInvalidVerification = error?.code === ERROR_CODES.INVALID_VERIFICATION_TOKEN;
    const isExcessiveErrorMobile = !isInvalidVerification && !isDesktop;

    return (
        <Modal
            ariaHideApp={false}
            className='invalid-verification-link-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Body
                className={clsx('flex flex-col items-center gap-[2.4rem] p-[2.4rem] lg:pb-[2.4rem] pb-0', {
                    'px-[1.4rem] gap-[1.4rem]': isExcessiveErrorMobile,
                })}
            >
                <DerivLightIcEmailVerificationLinkInvalidIcon height={iconSize} width={iconSize} />
                <Text weight='bold'>
                    <Localize i18n_default_text='Invalid verification link' />
                </Text>
                {error?.message && <Text align='center'>{error.message}</Text>}
            </Modal.Body>
            <Modal.Footer
                className={clsx('justify-center', {
                    'pt-2 min-h-fit': isExcessiveErrorMobile,
                })}
                hideBorder
            >
                <Button onClick={mutate} size={isDesktop ? 'lg' : 'md'} textSize='sm'>
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvalidVerificationLinkModal;
