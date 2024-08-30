import { FullPageMobileWrapper } from '@/components/FullPageMobileWrapper';
import { Localize } from '@deriv-com/translations';
import { Modal, Text, useDevice } from '@deriv-com/ui';
import { BusinessHoursModalFooter } from './BusinessHoursModalFooter';
import { BusinessHoursModalMain } from './BusinessHoursModalMain';
import './BusinessHoursModal.scss';

const BusinessHoursModal = () => {
    const { isDesktop } = useDevice();

    if (isDesktop) {
        return (
            <Modal ariaHideApp={false} className='business-hours-modal' isOpen>
                <Modal.Header hideBorder>
                    <Text weight='bold'>
                        <Localize i18n_default_text='Business hours' />
                    </Text>
                </Modal.Header>
                <Modal.Body className='px-[2.4rem] py-6'>
                    <BusinessHoursModalMain />
                </Modal.Body>
                <Modal.Footer hideBorder>
                    <BusinessHoursModalFooter isEdit={false} />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <FullPageMobileWrapper
            className='business-hours-modal'
            renderFooter={() => <BusinessHoursModalFooter isEdit={false} />}
            renderHeader={() => (
                <Text weight='bold'>
                    <Localize i18n_default_text='Business hours' />
                </Text>
            )}
        >
            <BusinessHoursModalMain />
        </FullPageMobileWrapper>
    );
};

export default BusinessHoursModal;
