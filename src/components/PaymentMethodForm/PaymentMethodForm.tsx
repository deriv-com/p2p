import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { TAdvertiserPaymentMethod, TFormState, TSelectedPaymentMethod } from 'types';
import { PageReturn, PaymentMethodField, PaymentMethodsFormFooter } from '@/components';
import { api, useModalManager } from '@/hooks';
import { Button, Modal, useDevice } from '@deriv-com/ui';
import { PaymentMethodFormAutocomplete } from './PaymentMethodFormAutocomplete';
import { PaymentMethodFormModalRenderer } from './PaymentMethodFormModalRenderer';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    displayModal?: boolean;
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onRequestClose?: () => void;
    onResetFormState: () => void;
};

/**
 * @component This component is used to display the form to add or edit a payment method
 * @param formState - The current state of the form
 * @returns {JSX.Element}
 * @example <PaymentMethodForm formState={formState} />
 * **/
const PaymentMethodForm = ({
    displayModal = false,
    onAdd,
    onRequestClose,
    onResetFormState,
    ...rest
}: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { actionType, selectedPaymentMethod, title = '' } = rest.formState;
    const { data: availablePaymentMethods } = api.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = api.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = api.advertiserPaymentMethods.useUpdate();

    const { isMobile } = useDevice();

    useEffect(() => {
        if (isCreateSuccessful) {
            onResetFormState();
            onRequestClose?.();
        }
    }, [isCreateSuccessful, createError, onResetFormState, onRequestClose]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            onResetFormState();
        }
    }, [isUpdateSuccessful, onResetFormState, updateError]);

    const availablePaymentMethodsList = useMemo(() => {
        const listItems = availablePaymentMethods?.map(availablePaymentMethod => ({
            text: availablePaymentMethod?.display_name,
            value: availablePaymentMethod?.id,
        }));
        return listItems || [];
    }, [availablePaymentMethods]);
    const handleGoBack = () => {
        if (isDirty) {
            showModal('PaymentMethodFormErrorModal', { shouldStackModals: true });
        } else {
            onResetFormState();
            onRequestClose?.();
        }
    };

    if (displayModal) {
        return (
            <Modal
                ariaHideApp={false}
                className='payment-method-form__modal'
                isOpen={displayModal}
                onRequestClose={handleGoBack}
                shouldCloseOnOverlayClick={false}
            >
                <form
                    className='payment-method-form__form'
                    onSubmit={event => {
                        event.preventDefault(); // Prevents create edit ad form submission
                        event.stopPropagation();
                        handleSubmit(data => {
                            const hasData = Object.keys(data).length > 0;
                            if (actionType === 'ADD' && hasData) {
                                create({
                                    ...data,
                                    method: String((selectedPaymentMethod as TAdvertiserPaymentMethod)?.method),
                                });
                            } else if (actionType === 'EDIT' && hasData) {
                                update(String(selectedPaymentMethod?.id), {
                                    ...data,
                                });
                            }
                        })(event);
                    }}
                >
                    <Modal.Header hideBorder onRequestClose={handleGoBack}>
                        <PageReturn
                            className='mb-0'
                            hasBorder={isMobile}
                            onClick={handleGoBack}
                            pageTitle='Add payment method'
                            size={isMobile ? 'lg' : 'md'}
                            weight='bold'
                        />
                    </Modal.Header>
                    <Modal.Body className='payment-method-form__modal__body'>
                        <div className='payment-method-form__fields'>
                            <div className='payment-method-form__field-wrapper'>
                                <PaymentMethodFormAutocomplete
                                    actionType={actionType}
                                    availablePaymentMethods={availablePaymentMethods}
                                    availablePaymentMethodsList={availablePaymentMethodsList}
                                    onAdd={onAdd}
                                    reset={reset}
                                    selectedPaymentMethod={selectedPaymentMethod}
                                />
                            </div>
                            {Object.keys(selectedPaymentMethod?.fields || {})?.map(field => {
                                const paymentMethodField =
                                    (selectedPaymentMethod?.fields as TAdvertiserPaymentMethod['fields'])?.[field] ??
                                    {};
                                return (
                                    <PaymentMethodField
                                        control={control}
                                        defaultValue={paymentMethodField?.value ?? ''}
                                        displayName={paymentMethodField?.display_name ?? ''}
                                        field={field}
                                        key={field}
                                        required={!!paymentMethodField?.required}
                                    />
                                );
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {selectedPaymentMethod ? (
                            <PaymentMethodsFormFooter
                                actionType={actionType}
                                handleGoBack={handleGoBack}
                                isDirty={isDirty}
                                isSubmitting={isSubmitting}
                                isValid={isValid}
                            />
                        ) : (
                            <Button className='border-2' color='black' size='lg' textSize='sm' variant='outlined'>
                                Cancel
                            </Button>
                        )}
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }

    return (
        <div className='payment-method-form'>
            <PageReturn
                className='py-[1.4rem] mb-0'
                hasBorder={isMobile}
                onClick={handleGoBack}
                pageTitle={title}
                size={isMobile ? 'lg' : 'md'}
                weight='bold'
            />
            <form
                className='payment-method-form__form'
                onSubmit={handleSubmit(data => {
                    const hasData = Object.keys(data).length > 0;
                    if (actionType === 'ADD' && hasData) {
                        create({
                            ...data,
                            method: String((selectedPaymentMethod as TAdvertiserPaymentMethod)?.method),
                        });
                    } else if (actionType === 'EDIT' && hasData) {
                        update(String(selectedPaymentMethod?.id), {
                            ...data,
                        });
                    }
                })}
            >
                <div className='payment-method-form__fields'>
                    <div className='payment-method-form__field-wrapper'>
                        <PaymentMethodFormAutocomplete
                            actionType={actionType}
                            availablePaymentMethods={availablePaymentMethods}
                            availablePaymentMethodsList={availablePaymentMethodsList}
                            onAdd={onAdd}
                            reset={reset}
                            selectedPaymentMethod={selectedPaymentMethod}
                        />
                    </div>
                    {Object.keys(selectedPaymentMethod?.fields || {})?.map(field => {
                        const paymentMethodField =
                            (selectedPaymentMethod?.fields as TAdvertiserPaymentMethod['fields'])?.[field] ?? {};
                        return (
                            <PaymentMethodField
                                control={control}
                                defaultValue={paymentMethodField?.value ?? ''}
                                displayName={paymentMethodField?.display_name ?? ''}
                                field={field}
                                key={field}
                                required={!!paymentMethodField?.required}
                            />
                        );
                    })}
                </div>
                {(isMobile || !!selectedPaymentMethod) && (
                    <PaymentMethodsFormFooter
                        actionType={actionType}
                        handleGoBack={handleGoBack}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                    />
                )}
            </form>
            {isModalOpenFor('PaymentMethodFormErrorModal') && (
                <PaymentMethodFormModalRenderer
                    actionType={actionType}
                    createError={createError}
                    isCreateSuccessful={isCreateSuccessful}
                    isModalOpen={!!isModalOpenFor('PaymentMethodFormErrorModal')}
                    isUpdateSuccessful={isUpdateSuccessful}
                    onRequestClose={hideModal}
                    onResetFormState={onResetFormState}
                    updateError={updateError}
                />
            )}
        </div>
    );
};

export default PaymentMethodForm;
