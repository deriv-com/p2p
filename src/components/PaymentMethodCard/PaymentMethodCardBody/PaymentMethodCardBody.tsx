import { TAccount, TBankName, THooks, TName } from 'types';
import { Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodCardBody.scss';

type TPaymentMethodCardBodyProps = {
    paymentMethod: THooks.AdvertiserPaymentMethods.Get[number] | THooks.PaymentMethods.Get[number];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCardBody = ({
    paymentMethod,
    shouldShowPaymentMethodDisplayName = true,
}: TPaymentMethodCardBodyProps) => {
    const displayName = paymentMethod?.display_name;
    const modifiedDisplayName = displayName?.replace(/\s|-/gm, '');
    const isBankOrOther = modifiedDisplayName && ['BankTransfer', 'Other'].includes(modifiedDisplayName);
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <div className='payment-method-card__body'>
            {isBankOrOther && !shouldShowPaymentMethodDisplayName ? null : <Text size={textSize}>{displayName}</Text>}
            <Text size={textSize}>
                {(paymentMethod.fields?.bank_name as TBankName)?.value ?? (paymentMethod.fields?.name as TName)?.value}
            </Text>
            <Text size={textSize}>{(paymentMethod.fields?.account as TAccount)?.value}</Text>
        </div>
    );
};

export default PaymentMethodCardBody;
