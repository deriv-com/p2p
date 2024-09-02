import { useCallback, useEffect, useRef, useState } from 'react';
import { FullPageMobileWrapper } from '@/components/FullPageMobileWrapper';
import { api } from '@/hooks';
import { useGetBusinessHours } from '@/hooks/custom-hooks';
import { convertToGMTWithOverflow, convertToMinutesRange, TBusinessDay } from '@/utils/business-hours';
import { Modal, useDevice } from '@deriv-com/ui';
import { BusinessHourModalEdit } from './BusinessHoursModalEdit';
import { BusinessHoursModalFooter } from './BusinessHoursModalFooter';
import { BusinessHoursModalHeader } from './BusinessHoursModalHeader';
import { BusinessHoursModalMain } from './BusinessHoursModalMain';
import './BusinessHoursModal.scss';

type TData = {
    day: string;
    end_time?: string | null;
    short_day: string;
    start_time?: string | null;
    time: JSX.Element;
    value: string;
};

const BusinessHoursModal = () => {
    const { isDesktop } = useDevice();
    const { businessHours } = useGetBusinessHours();
    const { isSuccess, mutate } = api.advertiser.useUpdate();
    const [showEdit, setShowEdit] = useState(true);
    const [editedBusinessHours, setEditedBusinessHours] = useState<TData[]>(businessHours);
    const dataRef = useRef(businessHours);

    const onSave = useCallback(() => {
        const filteredTimes = editedBusinessHours.filter(day => day.start_time !== null || day.end_time !== null);
        const result = convertToMinutesRange(filteredTimes as TBusinessDay[]);
        const offset = new Date().getTimezoneOffset();
        const convertedResult = convertToGMTWithOverflow(result, offset).filter(
            day => day.start_min !== null || day.end_min !== null
        );

        mutate({ schedule: convertedResult });
    }, [editedBusinessHours, mutate]);

    useEffect(() => {
        if (isSuccess) {
            setShowEdit(false);
        }
    }, [isSuccess]);

    if (isDesktop) {
        return (
            <Modal
                ariaHideApp={false}
                className='business-hours-modal'
                isOpen
                style={{ content: { overflow: 'visible', zIndex: 'auto' } }}
            >
                <Modal.Header hideBorder>
                    <BusinessHoursModalHeader showEdit={showEdit} />
                </Modal.Header>
                <Modal.Body className='business-hours-modal__body'>
                    {showEdit ? (
                        <BusinessHourModalEdit
                            editedBusinessHours={editedBusinessHours}
                            setEditedBusinessHours={setEditedBusinessHours}
                        />
                    ) : (
                        <BusinessHoursModalMain />
                    )}
                </Modal.Body>
                <Modal.Footer hideBorder>
                    <BusinessHoursModalFooter
                        isSaveDisabled={dataRef.current === editedBusinessHours}
                        onSave={onSave}
                        setShowEdit={setShowEdit}
                        showEdit={showEdit}
                    />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <FullPageMobileWrapper
            className='business-hours-modal__full-page'
            renderFooter={() => (
                <BusinessHoursModalFooter
                    isSaveDisabled={dataRef.current === editedBusinessHours}
                    onSave={onSave}
                    setShowEdit={setShowEdit}
                    showEdit={showEdit}
                />
            )}
            renderHeader={() => <BusinessHoursModalHeader showEdit={showEdit} />}
        >
            {showEdit ? (
                <BusinessHourModalEdit
                    editedBusinessHours={editedBusinessHours}
                    setEditedBusinessHours={setEditedBusinessHours}
                />
            ) : (
                <BusinessHoursModalMain />
            )}
        </FullPageMobileWrapper>
    );
};

export default BusinessHoursModal;
