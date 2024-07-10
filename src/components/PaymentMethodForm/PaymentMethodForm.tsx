import { FormEvent, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { TAdvertiserPaymentMethod, TFormState, TSelectedPaymentMethod } from 'types';
import { PageReturn, PaymentMethodField, PaymentMethodsFormFooter } from '@/components';
import { api } from '@/hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Modal, useDevice } from '@deriv-com/ui';
import { PaymentMethodFormAutocomplete } from './PaymentMethodFormAutocomplete';
import { PaymentMethodFormModalRenderer } from './PaymentMethodFormModalRenderer';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    displayModal?: boolean;
    formState: TFormState;
    onAdd?: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
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
    const { localize } = useTranslations();
    const {
        control,
        formState: { dirtyFields, isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const [isError, setIsError] = useState(false);
    const { actionType, selectedPaymentMethod, title = '' } = rest.formState;
    const { data: availablePaymentMethods } = api.paymentMethods.useGet();
    const {
        create,
        error: createError,
        isError: isCreateError,
        isSuccess: isCreateSuccessful,
        reset: resetCreate,
    } = api.advertiserPaymentMethods.useCreate();
    const {
        error: updateError,
        isError: isUpdateError,
        isSuccess: isUpdateSuccessful,
        reset: resetUpdate,
        update,
    } = api.advertiserPaymentMethods.useUpdate();

    const { isDesktop, isMobile } = useDevice();

    const showPaymentMethodFormModal = isError || isCreateError || isUpdateError;

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
        if (Object.keys(dirtyFields).length) {
            setIsError(true);
        } else {
            onResetFormState();
            onRequestClose?.();
        }
    };

    if (displayModal) {
        return (
            <>
                <Modal
                    ariaHideApp={false}
                    className={clsx('payment-method-form__modal', { hidden: showPaymentMethodFormModal })}
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
                                className='my-0'
                                hasBorder={!isDesktop}
                                onClick={handleGoBack}
                                pageTitle={localize('Add payment method')}
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
                                        (selectedPaymentMethod?.fields as TAdvertiserPaymentMethod['fields'])?.[
                                            field
                                        ] ?? {};
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
                                <Button
                                    className='border-2'
                                    color='black'
                                    onClick={onRequestClose}
                                    size='lg'
                                    textSize='sm'
                                    variant='outlined'
                                >
                                    <Localize i18n_default_text='Cancel' />
                                </Button>
                            )}
                        </Modal.Footer>
                    </form>
                </Modal>
                {showPaymentMethodFormModal && (
                    <PaymentMethodFormModalRenderer
                        actionType={actionType}
                        createError={createError}
                        isCreateSuccessful={isCreateSuccessful}
                        isUpdateSuccessful={isUpdateSuccessful}
                        onResetFormState={onResetFormState}
                        resetCreate={resetCreate}
                        resetUpdate={resetUpdate}
                        setIsError={setIsError}
                        updateError={updateError}
                    />
                )}
            </>
        );
    }

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    };

    return (
        <div className='payment-method-form'>
            <PageReturn
                className='py-[1.4rem] mb-0'
                hasBorder={!isDesktop}
                onClick={handleGoBack}
                pageTitle={title === '' ? localize('Add payment method') : title}
                size={isMobile ? 'lg' : 'md'}
                weight='bold'
            />
            <form className='payment-method-form__form' onSubmit={handleFormSubmit}>
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
                {!!selectedPaymentMethod && (
                    <PaymentMethodsFormFooter
                        actionType={actionType}
                        handleGoBack={handleGoBack}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        onSubmit={handleFormSubmit}
                        type='button'
                    />
                )}
            </form>
            {showPaymentMethodFormModal && (
                <PaymentMethodFormModalRenderer
                    actionType={actionType}
                    createError={createError}
                    isCreateSuccessful={isCreateSuccessful}
                    isUpdateSuccessful={isUpdateSuccessful}
                    onResetFormState={onResetFormState}
                    resetCreate={resetCreate}
                    resetUpdate={resetUpdate}
                    setIsError={setIsError}
                    updateError={updateError}
                />
            )}
        </div>
    );
};

export default PaymentMethodForm;
