import { ComponentType, SVGAttributes } from 'react';
import clsx from 'clsx';
import { THooks } from 'types';
import { TGenericSizes } from '@/utils';
import { Text } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../public/ic-cashier-bank-transfer.svg?react';
import IcCashierEwallet from '../../public/ic-cashier-ewallet.svg?react';
import IcCashierOther from '../../public/ic-cashier-other.svg?react';

type TPaymentMethodWithIconProps = {
    className?: string;
    name: string;
    textSize?: TGenericSizes;
    type: THooks.AdvertiserPaymentMethods.Get[number]['type'];
};
const PaymentMethodWithIcon = ({ className, name, textSize = 'sm', type }: TPaymentMethodWithIconProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>> = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }
    return (
        <div className={clsx('flex items-center gap-[0.8rem]', className)}>
            <Icon data-testid='dt_payment_method_card_header_icon' height={16} width={16} />
            <Text size={textSize}>{name}</Text>
        </div>
    );
};

export default PaymentMethodWithIcon;
