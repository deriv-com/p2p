import { useEffect, useState } from 'react';
import { THooks } from 'types';
import { FullPageMobileWrapper } from '@/components/FullPageMobileWrapper';
import { api } from '@/hooks';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import { OrderDetailsComplainModalRadioGroup } from './OrderDetailsComplainModalRadioGroup';
import './OrderDetailsComplainModal.scss';

type TOrderDetailsComplainModal = {
    id: string;
    isBuyOrderForUser: boolean;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

type TComplainFooterProps = {
    disputeOrderRequest: () => void;
    disputeReason: string;
    onRequestClose: () => void;
};

type TDisputeReason = Parameters<THooks.OrderDispute.Dispute>[0]['dispute_reason'];
const ComplainExplanation = () => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'sm' : 'xs';
    return (
        <div className='order-details-complain-modal__explanation'>
            <Text size={textSize}>If your complaint isn’t listed here, please contact our </Text>{' '}
            <Text color='red' size={textSize} weight='bold'>
                Customer Support
            </Text>{' '}
            <Text size={textSize}>team.</Text>
        </div>
    );
};

const ComplainFooter = ({ disputeOrderRequest, disputeReason, onRequestClose }: TComplainFooterProps) => {
    const { isMobile } = useDevice();
    const buttonTextSize = isMobile ? 'md' : 'sm';
    return (
        <div className='order-details-complain-modal__complain-footer'>
            <Button
                className='border-2'
                color='black'
                onClick={onRequestClose}
                size='lg'
                textSize={buttonTextSize}
                type='button'
                variant='outlined'
            >
                Cancel
            </Button>
            <Button disabled={!disputeReason} onClick={disputeOrderRequest} size='lg' textSize={buttonTextSize}>
                Submit
            </Button>
        </div>
    );
};

const OrderDetailsComplainModal = ({
    id,
    isBuyOrderForUser,
    isModalOpen,
    onRequestClose,
}: TOrderDetailsComplainModal) => {
    const { isMobile } = useDevice();
    const [disputeReason, setDisputeReason] = useState('');
    const { isSuccess, mutate } = api.orderDispute.useDispute();

    useEffect(() => {
        if (isSuccess) {
            onRequestClose();
        }
    }, [isSuccess, onRequestClose]);

    const disputeOrderRequest = () => {
        mutate({
            dispute_reason: disputeReason as TDisputeReason,
            id,
        });
    };

    const onCheckboxChange = (reason: string) => setDisputeReason(reason);

    if (isMobile && isModalOpen)
        return (
            <FullPageMobileWrapper
                className='order-details-complain-modal'
                onBack={onRequestClose}
                renderFooter={() => (
                    <ComplainFooter
                        disputeOrderRequest={disputeOrderRequest}
                        disputeReason={disputeReason}
                        onRequestClose={onRequestClose}
                    />
                )}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        Complaint
                    </Text>
                )}
            >
                <OrderDetailsComplainModalRadioGroup
                    disputeReason={disputeReason}
                    isBuyOrderForUser={isBuyOrderForUser}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </FullPageMobileWrapper>
        );
    return (
        <Modal
            ariaHideApp={false}
            className='order-details-complain-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header onRequestClose={onRequestClose}>
                <Text weight='bold'>What’s your complaint?</Text>
            </Modal.Header>
            <Modal.Body className='order-details-complain-modal__body'>
                <OrderDetailsComplainModalRadioGroup
                    disputeReason={disputeReason}
                    isBuyOrderForUser={isBuyOrderForUser}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </Modal.Body>
            <Modal.Footer>
                <ComplainFooter
                    disputeOrderRequest={disputeOrderRequest}
                    disputeReason={disputeReason}
                    onRequestClose={onRequestClose}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsComplainModal;
