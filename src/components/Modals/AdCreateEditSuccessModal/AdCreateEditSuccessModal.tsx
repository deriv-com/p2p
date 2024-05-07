import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TCurrency } from 'types';
import { MY_ADS_URL } from '@/constants';
import { Button, Checkbox, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdCreateEditSuccessModal.scss';

type TAdCreateEditSuccessModalProps = {
    advertsArchivePeriod?: number;
    currency: TCurrency;
    isModalOpen: boolean;
    limit: string;
    onRequestClose: () => void;
    visibilityStatus: string;
};

const AdCreateEditSuccessModal = ({
    advertsArchivePeriod,
    currency,
    isModalOpen,
    limit,
    onRequestClose,
    visibilityStatus,
}: TAdCreateEditSuccessModalProps) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const [isChecked, setIsChecked] = useState(false);
    const textSize = isMobile ? 'md' : 'sm';
    const onToggleCheckbox = useCallback(() => {
        setIsChecked(prevState => !prevState);
    }, []);

    const onClickOk = () => {
        localStorage.setItem('should_not_show_auto_archive_message_again', JSON.stringify(isChecked));
        if (visibilityStatus) {
            history.push(MY_ADS_URL, {
                currency,
                from: '',
                limit,
                visibilityStatus,
            });
        } else {
            history.push(MY_ADS_URL);
        }
        onRequestClose();
    };
    return (
        <Modal
            ariaHideApp={false}
            className='ad-create-edit-success-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header hideBorder hideCloseIcon>
                <Text weight='bold'>You’ve created an ad</Text>
            </Modal.Header>
            <Modal.Body className='ad-create-edit-success-modal__body'>
                <Text color='prominent' size={textSize}>
                    {`If the ad doesn't receive an order for ${advertsArchivePeriod} days, it will be deactivated.`}
                </Text>
                <Checkbox
                    checked={isChecked}
                    label='Don’t show this message again.'
                    name='ad-create-success-message'
                    onChange={onToggleCheckbox}
                />
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onClickOk} size='lg' textSize={textSize}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCreateEditSuccessModal;
