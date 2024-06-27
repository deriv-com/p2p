import { useHistory } from 'react-router-dom';
import { GUIDE_URL } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './GuideModal.scss';

type TGuideModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const GuideModal = ({ isModalOpen, onRequestClose }: TGuideModalProps) => {
    const history = useHistory();

    const onGetStarted = () => {
        history.push(GUIDE_URL);
        onRequestClose();
    };

    return (
        <Modal className='guide-modal' isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
            <Modal.Header hideBorder onRequestClose={onRequestClose}>
                <Text as='div' weight='bold'>
                    <Localize i18n_default_text='Deriv P2P Guide' />
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='div' className='mx-[2.4rem]'>
                    <Localize i18n_default_text='Learn how to create buy/sell ads and understand the safety guidelines on Deriv P2P.' />
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button className='mt-[1.6rem]' color='black' onClick={onGetStarted} rounded='md'>
                    <Localize i18n_default_text='Get Started' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GuideModal;
