import { getAdConditionContent } from '@/constants';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdConditionsModal.scss';

type TAdConditionsModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    type: string;
};

const AdConditionsModal = ({ isModalOpen, onRequestClose, type }: TAdConditionsModalProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    return (
        <Modal ariaHideApp={false} className='ad-conditions-modal' isOpen={isModalOpen} onRequestClose={onRequestClose}>
            <Modal.Header className='px-[1.6rem]' hideBorder hideCloseIcon onRequestClose={onRequestClose}>
                <Text weight='bold'>{getAdConditionContent(localize)[type].title}</Text>
            </Modal.Header>
            <Modal.Body className='p-[1.6rem] lg:p-[2.4rem]'>
                <Text className='whitespace-pre-line' size='sm'>
                    {getAdConditionContent(localize)[type].description}
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={isDesktop ? 'sm' : 'md'} variant='contained'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdConditionsModal;
