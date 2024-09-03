import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { FullPageMobileWrapper } from '@/components/FullPageMobileWrapper';
import { api } from '@/hooks';
import { useGetBusinessHours, useModalManager } from '@/hooks/custom-hooks';
import { convertToGMTWithOverflow, convertToMinutesRange, isTimeEdited, TBusinessDay, TData } from '@/utils';
import { Modal, useDevice } from '@deriv-com/ui';
import { CancelBusinessHoursModal } from '../CancelBusinessHoursModal';
import { BusinessHourModalEdit } from './BusinessHoursModalEdit';
import { BusinessHoursModalFooter } from './BusinessHoursModalFooter';
import { BusinessHoursModalHeader } from './BusinessHoursModalHeader';
import { BusinessHoursModalMain } from './BusinessHoursModalMain';
import './BusinessHoursModal.scss';

const BusinessHoursModal = () => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop } = useDevice();
    const { businessHours } = useGetBusinessHours();
    const { isSuccess, mutate } = api.advertiser.useUpdate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [showEdit, setShowEdit] = useState(true);
    const [editedBusinessHours, setEditedBusinessHours] = useState<TData[]>(businessHours);

    const onSave = useCallback(() => {
        const filteredTimes = editedBusinessHours.filter(day => day.start_time !== null || day.end_time !== null);
        const result = convertToMinutesRange(filteredTimes as TBusinessDay[]);
        const offset = new Date().getTimezoneOffset();
        const convertedResult = convertToGMTWithOverflow(result, offset).filter(
            day => day.start_min !== null || day.end_min !== null
        );

        mutate({ schedule: convertedResult });
    }, [editedBusinessHours, mutate]);

    const onClickCancel = useCallback(() => {
        const isEdited = isTimeEdited(businessHours, editedBusinessHours);

        if (isEdited && showEdit) {
            showModal('CancelBusinessHoursModal');
        } else if (showEdit) {
            setShowEdit(false);
        } else {
            hideModal();
        }
    }, [businessHours, editedBusinessHours, hideModal, showEdit, showModal]);

    const onDiscard = () => {
        setShowEdit(false);
        setEditedBusinessHours(businessHours);
        hideModal();
    };

    const onKeepEditing = () => {
        hideModal();
    };

    useEffect(() => {
        if (isSuccess) {
            setShowEdit(false);
        }
    }, [isSuccess]);

    if (isDesktop) {
        return (
            <>
                <Modal
                    ariaHideApp={false}
                    className={clsx('business-hours-modal', { hidden: isModalOpenFor('CancelBusinessHoursModal') })}
                    isOpen
                    style={{
                        content: {
                            overflow: 'visible',
                            zIndex: 'auto',
                        },
                        overlay: {
                            visibility: isModalOpenFor('CancelBusinessHoursModal') ? 'hidden' : 'visible',
                            zIndex: 'auto',
                        },
                    }}
                >
                    <Modal.Header hideBorder>
                        <BusinessHoursModalHeader showEdit={showEdit} />
                    </Modal.Header>
                    <Modal.Body className='business-hours-modal__body'>
                        {showEdit ? (
                            <BusinessHourModalEdit
                                editedBusinessHours={editedBusinessHours}
                                isDisabled={isDisabled}
                                setEditedBusinessHours={setEditedBusinessHours}
                                setIsDisabled={setIsDisabled}
                            />
                        ) : (
                            <BusinessHoursModalMain />
                        )}
                    </Modal.Body>
                    <Modal.Footer hideBorder>
                        <BusinessHoursModalFooter
                            isSaveDisabled={isDisabled}
                            onCancel={onClickCancel}
                            onSave={onSave}
                            setShowEdit={setShowEdit}
                            showEdit={showEdit}
                        />
                    </Modal.Footer>
                </Modal>
                {isModalOpenFor('CancelBusinessHoursModal') && (
                    <CancelBusinessHoursModal isModalOpen onDiscard={onDiscard} onKeepEditing={onKeepEditing} />
                )}
            </>
        );
    }

    return (
        <>
            <FullPageMobileWrapper
                className='business-hours-modal__full-page'
                renderFooter={() => (
                    <BusinessHoursModalFooter
                        isSaveDisabled={isDisabled}
                        onCancel={onClickCancel}
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
                        isDisabled={isDisabled}
                        setEditedBusinessHours={setEditedBusinessHours}
                        setIsDisabled={setIsDisabled}
                    />
                ) : (
                    <BusinessHoursModalMain />
                )}
            </FullPageMobileWrapper>
            {isModalOpenFor('CancelBusinessHoursModal') && (
                <CancelBusinessHoursModal isModalOpen onDiscard={onDiscard} onKeepEditing={onKeepEditing} />
            )}
        </>
    );
};

export default BusinessHoursModal;
