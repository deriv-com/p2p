import { useEffect } from 'react';
import Modal from 'react-modal';
import { api } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './BlockUnblockUserModal.scss';

type TBlockUnblockUserModalProps = {
    advertiserName: string;
    id: string;
    isBlocked: boolean;
    isModalOpen: boolean;
    onClickBlocked?: () => void;
    onRequestClose: () => void;
};

const BlockUnblockUserModal = ({
    advertiserName,
    id,
    isBlocked,
    isModalOpen,
    onClickBlocked,
    onRequestClose,
}: TBlockUnblockUserModalProps) => {
    const { mutate: blockAdvertiser, mutation } = api.counterparty.useBlock();
    const { mutate: unblockAdvertiser, mutation: unblockMutation } = api.counterparty.useUnblock();

    useEffect(() => {
        if (mutation.isSuccess || unblockMutation.isSuccess) {
            onClickBlocked?.();
            onRequestClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutation.isSuccess, onClickBlocked, unblockMutation.isSuccess]);

    const getModalTitle = () => (isBlocked ? `Unblock ${advertiserName}?` : `Block ${advertiserName}?`);

    const getModalContent = () =>
        isBlocked ? (
            <Localize
                i18n_default_text={`You will be able to see {{advertiserName}}'s ads. They'll be able to place orders on your ads, too.`}
                values={{ advertiserName }}
            />
        ) : (
            <Localize
                i18n_default_text={`You won't see {{advertiserName}}'s ads anymore and they won't be able to place orders on your ads.`}
                values={{ advertiserName }}
            />
        );

    const onClickBlockUnblock = () => {
        if (isBlocked) {
            unblockAdvertiser([parseInt(id)]);
        } else {
            blockAdvertiser([parseInt(id)]);
        }
    };

    return (
        <Modal
            ariaHideApp={false}
            className='block-unblock-user-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <Text as='p' weight='bold'>
                {getModalTitle()}
            </Text>
            <Text as='p' className='block-unblock-user-modal__text' size='sm'>
                {getModalContent()}
            </Text>
            <div className='block-unblock-user-modal__footer'>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize='sm'
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button onClick={onClickBlockUnblock} size='lg' textSize='sm'>
                    {isBlocked ? 'Unblock' : 'Block'}
                </Button>
            </div>
        </Modal>
    );
};

export default BlockUnblockUserModal;
