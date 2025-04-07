import clsx from 'clsx';
import { TTextColors } from 'types';
import { TGenericSizes } from '@/utils';
import { Text } from '@deriv-com/ui';

type TPaymentMethodLabelProps = {
    color?: TTextColors;
    paymentMethodName: string;
    size?: TGenericSizes;
    type?: string;
};

const PaymentMethodLabel = ({ color = 'general', paymentMethodName, size = 'sm', type }: TPaymentMethodLabelProps) => {
    const hasPaymentMethod = paymentMethodName !== '-';
    return (
        <Text
            as='div'
            className={clsx({
                'border-solid border-[1px] border-[#D6DADB] rounded-lg px-[8px] py-1': !hasPaymentMethod,
                'flex items-center justify-center gap-[8px]': hasPaymentMethod,
            })}
            color={color}
            size={size}
        >
            {hasPaymentMethod && (
                <div
                    className={clsx('w-[8px] h-[8px] rounded-full', {
                        'bg-[#008832]': type === 'bank',
                        'bg-[#6E6E6E]': type === 'other',
                        'bg-[#377CFC]': type === 'ewallet',
                    })}
                />
            )}
            {paymentMethodName}
        </Text>
    );
};

export default PaymentMethodLabel;
