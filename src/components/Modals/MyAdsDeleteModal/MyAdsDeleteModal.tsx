import { memo } from 'react';
import { api } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './MyAdsDeleteModal.scss';

type TMyAdsDeleteModalProps = {
    error?: string;
    id: string;
    isModalOpen: boolean;
    onClickDelete: () => void;
    onRequestClose: () => void;
};

const MyAdsDeleteModal = ({ error, id, isModalOpen, onClickDelete, onRequestClose }: TMyAdsDeleteModalProps) => {
    const { data: advertInfo, isLoading: isLoadingInfo } = api.advert.useGet({ id });
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    const hasActiveOrders = advertInfo?.active_orders && advertInfo?.active_orders > 0;

    const getModalText = () => {
        if (hasActiveOrders && !error) {
            return (
                <Localize i18n_default_text='You have open orders for this ad. Complete all open orders before deleting this ad.' />
            );
        } else if (error) {
            return error;
        }
        return <Localize i18n_default_text='You will NOT be able to restore it.' />;
    };

    const getModalFooter = () => {
        if (hasActiveOrders || error) {
            return (
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            );
        }

        return (
            <div className='flex gap-[0.8rem]'>
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
                <Button onClick={onClickDelete} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Delete' />
                </Button>
            </div>
        );
    };
    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    ariaHideApp={false}
                    className='my-ads-delete-modal'
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    shouldCloseOnOverlayClick={false}
                    testId='dt_ads_delete_modal'
                >
                    <Modal.Header
                        className='my-ads-delete-modal__header'
                        hideBorder
                        hideCloseIcon
                        onRequestClose={onRequestClose}
                    >
                        <Text weight='bold'>
                            <Localize i18n_default_text='Do you want to delete this ad?' />
                        </Text>
                    </Modal.Header>
                    <Modal.Body className='my-ads-delete-modal__body'>
                        <Text color='prominent' size='sm'>
                            {getModalText()}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer className='my-ads-delete-modal__footer' hideBorder>
                        {getModalFooter()}
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default memo(MyAdsDeleteModal);
