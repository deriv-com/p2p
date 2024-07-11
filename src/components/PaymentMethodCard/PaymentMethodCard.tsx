import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { TAdvertiserPaymentMethod, TPaymentMethod } from 'types';
import { LabelPairedPlusLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { PaymentMethodCardBody } from './PaymentMethodCardBody';
import { PaymentMethodCardHeader } from './PaymentMethodCardHeader';
import './PaymentMethodCard.scss';

type TPaymentMethodCardProps = HTMLAttributes<HTMLDivElement> & {
    isDisabled?: boolean;
    isEditable?: boolean;
    medium?: boolean;
    onClickAdd?: (paymentMethod: TAdvertiserPaymentMethod | TPaymentMethod) => void;
    onDeletePaymentMethod?: () => void;
    onEditPaymentMethod?: () => void;
    onSelectPaymentMethodCard?: (paymentMethodId: number) => void;
    paymentMethod: { isAvailable?: boolean } & (TAdvertiserPaymentMethod | TPaymentMethod);
    selectedPaymentMethodIds?: number[];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCard = ({
    isDisabled = false,
    isEditable = false,
    medium = false,
    onClickAdd,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    onSelectPaymentMethodCard,
    paymentMethod,
    selectedPaymentMethodIds = [],
    shouldShowPaymentMethodDisplayName,
}: TPaymentMethodCardProps) => {
    const { display_name: displayName, isAvailable, type } = paymentMethod;

    const toAdd = !!(isAvailable ?? isAvailable === undefined);
    const isSelected = !!paymentMethod.id && selectedPaymentMethodIds.includes(Number(paymentMethod.id));

    return (
        <div
            className={clsx('payment-method-card', {
                'payment-method-card--dashed': !toAdd,
                'payment-method-card--medium': medium,
                'payment-method-card--selected': isSelected,
            })}
        >
            {!toAdd ? (
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    <Button
                        className='flex items-center justify-center w-[3.2rem] h-[3.2rem] mb-[0.8rem] rounded-full bg-[#ff444f]'
                        data-testid='dt_payment_method_add_button'
                        onClick={() => onClickAdd?.(paymentMethod)}
                    >
                        <LabelPairedPlusLgBoldIcon fill='white' />
                    </Button>
                    <Text size='sm'>{displayName}</Text>
                </div>
            ) : (
                <>
                    <PaymentMethodCardHeader
                        isDisabled={isDisabled}
                        isEditable={isEditable}
                        isSelectable={!isEditable && toAdd}
                        isSelected={isSelected}
                        medium={medium}
                        onDeletePaymentMethod={onDeletePaymentMethod}
                        onEditPaymentMethod={onEditPaymentMethod}
                        onSelectPaymentMethod={() => onSelectPaymentMethodCard?.(Number(paymentMethod.id))}
                        type={type}
                    />
                    <PaymentMethodCardBody
                        paymentMethod={paymentMethod}
                        shouldShowPaymentMethodDisplayName={shouldShowPaymentMethodDisplayName}
                    />
                </>
            )}
        </div>
    );
};

export default PaymentMethodCard;
