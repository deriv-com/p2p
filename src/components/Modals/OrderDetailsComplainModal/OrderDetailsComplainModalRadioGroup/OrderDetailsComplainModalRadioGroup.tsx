import { TLocalize } from 'types';
import { RadioGroup } from '@/components';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import './OrderDetailsComplainModalRadioGroup.scss';

type TOrderDetailsComplainModalRadioGroupProps = {
    disputeReason: string;
    isBuyOrderForUser: boolean;
    onCheckboxChange: (reason: string) => void;
};

const getRadioItems = (isBuyOrderForUser: boolean, localize: TLocalize) => {
    const radioItems = [
        {
            label: isBuyOrderForUser
                ? localize('I’ve made full payment, but the seller hasn’t released the funds.')
                : localize('I’ve not received any payment.'),
            value: isBuyOrderForUser ? 'seller_not_released' : 'buyer_not_paid',
        },
        {
            label: isBuyOrderForUser
                ? localize('I wasn’t able to make full payment.')
                : localize('I’ve received less than the agreed amount.'),
            value: 'buyer_underpaid',
        },
        {
            label: isBuyOrderForUser
                ? localize('I’ve paid more than the agreed amount.')
                : localize('I’ve received more than the agreed amount.'),
            value: 'buyer_overpaid',
        },
        {
            hidden: isBuyOrderForUser,
            label: localize('I’ve received payment from 3rd party.'),
            value: localize('buyer_third_party_payment_method'),
        },
    ];

    return radioItems;
};
const OrderDetailsComplainModalRadioGroup = ({
    disputeReason,
    isBuyOrderForUser,
    onCheckboxChange,
}: TOrderDetailsComplainModalRadioGroupProps) => {
    const { isDesktop } = useDevice();

    const { localize } = useTranslations();
    return (
        <RadioGroup
            className='order-details-complain-modal-radio-group'
            name='reason'
            onToggle={event => onCheckboxChange(event.target.value)}
            required
            selected={disputeReason}
            textSize={isDesktop ? 'sm' : 'md'}
        >
            {getRadioItems(isBuyOrderForUser, localize).map(item => (
                <RadioGroup.Item hidden={item.hidden} key={item.label} label={item.label} value={item.value} />
            ))}
        </RadioGroup>
    );
};

export default OrderDetailsComplainModalRadioGroup;
