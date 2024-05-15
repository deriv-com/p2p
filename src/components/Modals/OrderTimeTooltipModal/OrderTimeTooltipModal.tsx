import { MouseEventHandler } from 'react';
import { ORDER_TIME_INFO_MESSAGE } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';

type TOrderTimeTooltipModalProps = {
    isModalOpen: boolean;
    onRequestClose: MouseEventHandler<HTMLButtonElement>;
};

const OrderTimeTooltipModal = ({ isModalOpen, onRequestClose }: TOrderTimeTooltipModalProps) => {
    return (
        <Modal ariaHideApp={false} className='h-fit rounded-[8px] p-[2.4rem] pb-0 w-[32.8rem]' isOpen={isModalOpen}>
            <Modal.Body>
                <Text color='prominent' size='sm'>
                    {ORDER_TIME_INFO_MESSAGE}
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderTimeTooltipModal;
