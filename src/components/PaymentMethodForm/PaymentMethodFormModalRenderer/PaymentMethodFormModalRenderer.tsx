import { useEffect } from 'react';
import { TFormState, TSocketError } from 'types';
import { PaymentMethodErrorModal, PaymentMethodModal } from '@/components/Modals';
import { useModalManager } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';

type TPaymentMethodFormModalRendererProps = {
    actionType: TFormState['actionType'];
    createError: TSocketError<'p2p_advertiser_payment_methods'>['error'] | null;
    isCreateSuccessful: boolean;
    isUpdateSuccessful: boolean;
    onResetFormState: () => void;
    resetCreate: () => void;
    resetUpdate: () => void;
    setIsError: (isError: boolean) => void;
    updateError: TSocketError<'p2p_advertiser_payment_methods'>['error'] | null;
};

const PaymentMethodFormModalRenderer = ({
    actionType,
    createError,
    isCreateSuccessful,
    isUpdateSuccessful,
    onResetFormState,
    resetCreate,
    resetUpdate,
    setIsError,
    updateError,
}: TPaymentMethodFormModalRendererProps) => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    useEffect(() => {
        if (createError || updateError) {
            showModal('PaymentMethodErrorModal');
        } else if ((actionType === 'ADD' && !isCreateSuccessful) || (actionType === 'EDIT' && !isUpdateSuccessful)) {
            showModal('PaymentMethodModal');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionType, createError, isCreateSuccessful, isUpdateSuccessful, updateError]);

    return (
        <>
            {!!isModalOpenFor('PaymentMethodErrorModal') && (
                <PaymentMethodErrorModal
                    errorMessage={String(createError?.message || updateError?.message)}
                    isModalOpen={!!isModalOpenFor('PaymentMethodErrorModal')}
                    onConfirm={() => {
                        setIsError(false);
                        hideModal();
                        if (createError) resetCreate();
                        if (updateError) resetUpdate();
                    }}
                    title={localize('Something’s not right')}
                />
            )}
            {!!isModalOpenFor('PaymentMethodModal') && (
                <PaymentMethodModal
                    description={
                        actionType === 'ADD'
                            ? localize('If you choose to cancel, the changes you’ve made will be lost.')
                            : localize('If you choose to cancel, the details you’ve entered will be lost.')
                    }
                    isModalOpen={!!isModalOpenFor('PaymentMethodModal')}
                    onConfirm={() => {
                        onResetFormState();
                        setIsError(false);
                        hideModal({ shouldHideAllModals: true });
                    }}
                    onReject={() => {
                        hideModal();
                        setIsError(false);
                    }}
                    primaryButtonLabel={actionType === 'ADD' ? localize('Go back') : localize("Don't cancel")}
                    secondaryButtonLabel='Cancel'
                    title={
                        actionType === 'ADD'
                            ? localize('Cancel adding this payment method?')
                            : localize('Cancel your edits?')
                    }
                />
            )}
        </>
    );
};

export default PaymentMethodFormModalRenderer;
