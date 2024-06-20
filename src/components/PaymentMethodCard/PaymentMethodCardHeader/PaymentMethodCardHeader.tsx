import { THooks, TLocalize } from 'types';
import { LabelPairedEllipsisVerticalXlRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Checkbox, Dropdown } from '@deriv-com/ui';
import { ReactComponent as IcCashierBankTransfer } from '../../../public/ic-cashier-bank-transfer.svg';
import { ReactComponent as IcCashierEwallet } from '../../../public/ic-cashier-ewallet.svg';
import { ReactComponent as IcCashierOther } from '../../../public/ic-cashier-other.svg';
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

const getActions = (localize: TLocalize) => [
    {
        text: localize('Edit'),
        value: 'edit',
    },
    {
        text: localize('Delete'),
        value: 'delete',
    },
];

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
    const { localize } = useTranslations();
    let Icon = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }

    return (
        <div className='payment-method-card__header' data-testid='dt_payment_method_card_header'>
            <Icon
                className='payment-method-card__icon'
                data-testid='dt_payment_method_card_header_icon'
                height={medium || small ? 16 : 24}
                width={medium || small ? 16 : 24}
            />
            {isEditable && (
                <Dropdown
                    className='payment-method-card__header-dropdown'
                    dropdownIcon={<LabelPairedEllipsisVerticalXlRegularIcon />}
                    list={getActions(localize)}
                    name='payment-method-actions'
                    onSelect={value => {
                        if (value === 'edit') {
                            onEditPaymentMethod?.();
                        } else if (value === 'delete') {
                            onDeletePaymentMethod?.();
                        }
                    }}
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
