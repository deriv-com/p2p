import { useCallback, useEffect, useReducer } from 'react';
import { TFormState, TReducerAction, TSelectedPaymentMethod } from 'types';
import { PaymentMethodForm } from '@/components';
import { api } from '@/hooks';
import { useIsAdvertiser } from '@/hooks/custom-hooks';
import { advertiserPaymentMethodsReducer } from '@/reducers';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { PaymentMethodsEmpty } from './PaymentMethodsEmpty';
import { PaymentMethodsList } from './PaymentMethodsList';

/**
 * @component This component is the main component of the PaymentMethods screen. It's used to conditionally display the list of payment methods if it exists otherwise, it will display the empty state and the form to add a new payment method
 * @returns {JSX.Element}
 * @example <PaymentMethods />
 * **/
const PaymentMethods = () => {
    const isAdvertiser = useIsAdvertiser();
    const { currentLang, localize } = useTranslations();
    const { data: p2pAdvertiserPaymentMethods, get, isPending: isLoading } = api.advertiserPaymentMethods.useGet();
    const [formState, dispatch] = useReducer(
        (currentState: TFormState, action: TReducerAction) =>
            advertiserPaymentMethodsReducer(currentState, action, localize),
        {}
    );

    useEffect(() => {
        if (isAdvertiser) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser, currentLang]);

    const handleAddPaymentMethod = (selectedPaymentMethod?: TSelectedPaymentMethod) => {
        dispatch({
            payload: {
                selectedPaymentMethod,
            },
            type: 'ADD',
        });
    };
    const handleEditPaymentMethod = (selectedPaymentMethod?: TSelectedPaymentMethod) => {
        dispatch({
            payload: {
                selectedPaymentMethod,
            },
            type: 'EDIT',
        });
    };
    const handleDeletePaymentMethod = (selectedPaymentMethod?: TSelectedPaymentMethod) => {
        dispatch({
            payload: {
                selectedPaymentMethod,
            },
            type: 'DELETE',
        });
    };

    const handleResetFormState = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    if (isLoading) {
        return <Loader className='m-auto' isFullScreen={false} />;
    }

    if (!p2pAdvertiserPaymentMethods?.length && !formState.isVisible) {
        return <PaymentMethodsEmpty onAddPaymentMethod={handleAddPaymentMethod} />;
    }

    if (formState?.isVisible) {
        return (
            <PaymentMethodForm
                formState={formState}
                onAdd={handleAddPaymentMethod}
                onEdit={handleEditPaymentMethod}
                onResetFormState={handleResetFormState}
            />
        );
    }

    return (
        <PaymentMethodsList
            formState={formState}
            onAdd={handleAddPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            onEdit={handleEditPaymentMethod}
            onResetFormState={handleResetFormState}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethods;
