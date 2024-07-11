import { ButtonHTMLAttributes, FormEvent, MouseEventHandler } from 'react';
import clsx from 'clsx';
import { TFormState } from 'types';
import { getCurrentRoute } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import './PaymentMethodsFormFooter.scss';

type TPaymentMethodsFormFooterProps = {
    actionType: TFormState['actionType'];
    handleGoBack: () => void;
    isDirty: boolean;
    isSubmitting: boolean;
    isValid: boolean;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

/**
 * @component This component is used to display the footer of the PaymentMethodForm
 * @param actionType - The type of action to be performed (ADD or EDIT)
 * @param handleGoBack - The function to be called when the back / cancel button is clicked
 * @param isDirty - The state of the form (whether it has been modified or not)
 * @param isSubmitting - The state of the form (whether it is being submitted or not)
 * @param isValid - The state of the form (whether it is valid or not)
 * @returns {JSX.Element}
 * @example <PaymentMethodsFormFooter actionType={actionType} handleGoBack={handleGoBack} isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} />
 * **/
const PaymentMethodsFormFooter = ({
    actionType,
    handleGoBack,
    isDirty,
    isSubmitting,
    isValid,
    onSubmit,
    type = 'submit',
}: TPaymentMethodsFormFooterProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const isMyProfile = getCurrentRoute() === 'my-profile';

    return (
        <div
            className={clsx('payment-methods-form-footer', {
                'mt-0': !isMyProfile,
            })}
            role='payment-methods-form-footer'
        >
            <Button
                className='border-2'
                color='black'
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    handleGoBack();
                }}
                size='lg'
                textSize={textSize}
                variant='outlined'
            >
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button
                disabled={isSubmitting || !isValid || !isDirty}
                onClick={onSubmit as unknown as MouseEventHandler<HTMLButtonElement>}
                size='lg'
                textSize={textSize}
                type={type}
            >
                {actionType === 'ADD' ? (
                    <Localize i18n_default_text='Add' />
                ) : (
                    <Localize i18n_default_text='Save changes' />
                )}
            </Button>
        </div>
    );
};

export default PaymentMethodsFormFooter;
