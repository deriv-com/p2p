import { api } from '@/hooks';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './OrderDetailsCancelModal.scss';

type TOrderDetailsCancelModalProps = {
    id: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const OrderDetailsCancelModal = ({ id, isModalOpen, onRequestClose }: TOrderDetailsCancelModalProps) => {
    const { data } = api.settings.useSettings();
    const { data: advertiserInfo } = api.advertiser.useGetInfo();
    const { mutate } = api.order.useCancel();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    const onCancel = () => {
        mutate({ id });
        onRequestClose();
    };

    return (
        <Modal className='order-details-cancel-modal' isOpen={isModalOpen}>
            <Modal.Header className='lg:px-[2.4rem] px-[1.6rem]' hideBorder hideCloseIcon>
                <Text weight='bold'>Do you want to cancel this order?</Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-2 lg:px-[2.4rem] px-[1.6rem]'>
                <Text size='sm'>
                    If you cancel your order {data?.cancellation_limit} times in {data?.cancellation_count_period}{' '}
                    hours, you will be blocked from using Deriv P2P for {data?.cancellation_block_duration} hours.
                    <br />({advertiserInfo.cancels_remaining} cancellations remaining)
                </Text>
                <Text color='error' size='sm'>
                    Please do not cancel if you have already made payment.
                </Text>
            </Modal.Body>
            <Modal.Footer className='gap-4 lg:px-[2.4rem] px-[1.6rem]' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onCancel}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    Cancel this order
                </Button>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    Do not cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsCancelModal;
