import { TFormState, THooks, TPaymentMethod, TSelectedPaymentMethod } from 'types';
import { LabelPairedSearchMdRegularIcon, LegacyCloseCircle1pxIcon } from '@deriv/quill-icons';
import { Button, Dropdown, Input, Text } from '@deriv-com/ui';

type TPaymentMethodFormAutocompleteProps = {
    actionType: TFormState['actionType'];
    availablePaymentMethods?: THooks.PaymentMethods.Get;
    availablePaymentMethodsList: { text: string; value: string }[];
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    reset: () => void;
    selectedPaymentMethod: TFormState['selectedPaymentMethod'];
};

const PaymentMethodFormAutocomplete = ({
    actionType,
    availablePaymentMethods,
    availablePaymentMethodsList,
    onAdd,
    reset,
    selectedPaymentMethod,
}: TPaymentMethodFormAutocompleteProps) => {
    if (selectedPaymentMethod) {
        // TODO: Remember to translate this
        return (
            <Input
                defaultValue={selectedPaymentMethod?.display_name}
                disabled
                label='Choose your payment method'
                rightPlaceholder={
                    actionType === 'EDIT' ? null : (
                        <LegacyCloseCircle1pxIcon
                            className='payment-method-form__icon--close'
                            data-testid='dt_payment_methods_form_close_icon'
                            fill='#999999'
                            height={15.7}
                            onClick={() => {
                                onAdd();
                                reset();
                            }}
                            width={15.7}
                        />
                    )
                }
            />
        );
    }

    const getValue = () => {
        if (selectedPaymentMethod) {
            return (selectedPaymentMethod as TPaymentMethod)?.display_name;
        }
        return '';
    };
    return (
        <>
            <Dropdown
                dropdownIcon={<LabelPairedSearchMdRegularIcon />}
                isFullWidth
                label='Payment method'
                list={availablePaymentMethodsList}
                name='Payment method'
                onSelect={value => {
                    const selectedPaymentMethod = availablePaymentMethods?.find(p => p.id === value);
                    if (selectedPaymentMethod) {
                        onAdd({
                            displayName: selectedPaymentMethod?.display_name,
                            fields: selectedPaymentMethod?.fields,
                            method: selectedPaymentMethod?.id,
                        });
                    }
                }}
                // TODO: Remember to translate this
                value={getValue()}
                variant='prompt'
            />
            <div className='mt-[0.2rem] ml-[1.6rem]'>
                {/* TODO: Remember to translate these */}
                <Text color='less-prominent' size='xs'>
                    Don’t see your payment method?
                </Text>
                <Button
                    className='payment-method-form__button'
                    color='primary'
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                        if (paymentMethod) {
                            onAdd({
                                displayName: paymentMethod?.display_name,
                                fields: paymentMethod?.fields,
                                method: 'other',
                            });
                        }
                    }}
                    size='sm'
                    textSize='xs'
                    variant='ghost'
                >
                    Add new.
                </Button>
            </div>
        </>
    );
};

export default PaymentMethodFormAutocomplete;
