import { THooks } from 'types';
import { FlyoutMenu } from '@/components';
import { LabelPairedEllipsisVerticalXlRegularIcon } from '@deriv/quill-icons';
import { Button, Checkbox } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../../public/ic-cashier-bank-transfer.svg?react';
import IcCashierEwallet from '../../../public/ic-cashier-ewallet.svg?react';
import IcCashierOther from '../../../public/ic-cashier-other.svg?react';
import './PaymentMethodCardHeader.scss';

type TPaymentMethodCardHeaderProps = {
    isDisabled?: boolean;
    isEditable?: boolean;
    isSelectable?: boolean;
    isSelected?: boolean;
    medium?: boolean;
    onDeletePaymentMethod?: () => void;
    onEditPaymentMethod?: () => void;
    onSelectPaymentMethod?: () => void;
    small?: boolean;
    type: THooks.AdvertiserPaymentMethods.Get[number]['type'];
};

const PaymentMethodCardHeader = ({
    isDisabled = false,
    isEditable = false,
    isSelectable = false,
    isSelected = false,
    medium = false,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    onSelectPaymentMethod,
    small = false,
    type,
}: TPaymentMethodCardHeaderProps) => {
    let Icon = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }
    // TODO: Remember to translate these
    const flyoutMenuItems = [
        <Button color='black' key={0} onClick={() => onEditPaymentMethod?.()} size='sm' textSize='xs' variant='ghost'>
            Edit
        </Button>,

        <Button color='black' key={1} onClick={() => onDeletePaymentMethod?.()} size='sm' textSize='xs' variant='ghost'>
            Delete
        </Button>,
    ];
    return (
        <div className='payment-method-card__header' data-testid='dt_payment_method_card_header'>
            <Icon
                className='payment-method-card__icon'
                data-testid='dt_payment_method_card_header_icon'
                height={medium || small ? 16 : 24}
                width={medium || small ? 16 : 24}
            />
            {isEditable && (
                <FlyoutMenu
                    listItems={flyoutMenuItems}
                    renderIcon={() => <LabelPairedEllipsisVerticalXlRegularIcon className='cursor-pointer' />}
                />
            )}
            {isSelectable && (
                <div data-testid='dt_payment_method_card_header_checkbox'>
                    <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        name='payment-method-checkbox'
                        onChange={onSelectPaymentMethod}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentMethodCardHeader;
