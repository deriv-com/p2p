import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { BUY_SELL_URL, ERROR_CODES } from '@/constants';
import { api, useAdvertiserStats, useModalManager } from '@/hooks';
import { useErrorStore } from '@/stores';
import { getCurrentRoute, getInvalidIDErrorMessage, getInvalidIDTitle } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import { ErrorModal } from '../ErrorModal';
import './BlockUnblockUserModal.scss';

type TBlockUnblockUserModalProps = {
    advertiserName: string;
    id: string;
    isBlocked: boolean;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const BlockUnblockUserModal = ({
    advertiserName,
    id,
    isBlocked,
    isModalOpen,
    onRequestClose,
}: TBlockUnblockUserModalProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const {
        mutate: blockAdvertiser,
        mutation: { error, isSuccess, reset: blockReset },
    } = api.counterparty.useBlock();
    const {
        mutate: unblockAdvertiser,
        mutation: { error: unblockError, isSuccess: unblockIsSuccess, reset: unblockReset },
    } = api.counterparty.useUnblock();
    const { data } = useAdvertiserStats(id);
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { errorMessages, setErrorMessages } = useErrorStore(
        useShallow(state => ({ errorMessages: state.errorMessages, setErrorMessages: state.setErrorMessages }))
    );
    const isAdvertiser = getCurrentRoute() === 'advertiser';
    const history = useHistory();

    useEffect(() => {
        if (isSuccess || unblockIsSuccess) {
            onRequestClose();
        } else if (error || unblockError) {
            setErrorMessages(error || unblockError);

            if (isAdvertiser) {
                showModal('ErrorModal');
            } else {
                onRequestClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, unblockIsSuccess, unblockError, error, setErrorMessages]);

    const textSize = isMobile ? 'md' : 'sm';
    const getModalTitle = () =>
        isBlocked ? `${localize('Unblock')} ${advertiserName}?` : `${localize('Block')} ${advertiserName}?`;

    const getModalContent = () =>
        isBlocked ? (
            <Localize
                i18n_default_text="You will be able to see {{advertiserName}}'s ads. They'll be able to place orders on your ads, too."
                values={{ advertiserName }}
            />
        ) : (
            <Localize
                i18n_default_text="You won't see {{advertiserName}}'s ads anymore and they won't be able to place orders on your ads."
                values={{ advertiserName }}
            />
        );

    const onClickBlockUnblock = () => {
        if (isBlocked) {
            unblockAdvertiser([parseInt(id)]);
        } else {
            blockAdvertiser([parseInt(id)], !!data?.is_favourite);
        }
    };

    const blockUnblockError = errorMessages.find(
        error =>
            error.code === ERROR_CODES.PERMISSION_DENIED ||
            error.code === ERROR_CODES.INVALID_ADVERTISER_ID ||
            error.code === ERROR_CODES.ADVERTISER_NOT_REGISTERED
    );

    if (blockUnblockError && isModalOpenFor('ErrorModal')) {
        return (
            <ErrorModal
                hideCloseIcon
                isModalOpen
                message={getInvalidIDErrorMessage(blockUnblockError, localize)}
                onRequestClose={() => {
                    hideModal();
                    history.push(BUY_SELL_URL);
                    if (isBlocked) unblockReset();
                    else blockReset();
                }}
                title={getInvalidIDTitle(blockUnblockError, localize)}
            />
        );
    }

    return (
        <Modal
            ariaHideApp={false}
            className='block-unblock-user-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='px-[1.6rem] lg:px-[2.4rem]' hideBorder hideCloseIcon>
                <Text as='p' size={isMobile ? 'lg' : 'md'} weight='bold'>
                    {getModalTitle()}
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='px-[1.6rem] lg:px-[2.4rem]' size={textSize}>
                    {getModalContent()}
                </Text>
            </Modal.Body>
            <Modal.Footer className='gap-[0.8rem] lg:px-[2.4rem] px-[1.6rem]' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button onClick={onClickBlockUnblock} size='lg' textSize={textSize}>
                    {isBlocked ? <Localize i18n_default_text='Unblock' /> : <Localize i18n_default_text='Block' />}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BlockUnblockUserModal;
