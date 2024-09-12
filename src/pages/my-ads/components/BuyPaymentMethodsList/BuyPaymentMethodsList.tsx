import { ComponentProps } from 'react';
import { LabelPairedCirclePlusCaptionRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Dropdown } from '@deriv-com/ui';
import './BuyPaymentMethodsList.scss';

type TBuyPaymentMethodsList = {
    list: ComponentProps<typeof Dropdown>['list'];
    onSelectPaymentMethod: (paymentMethod: string) => void;
};

const BuyPaymentMethodsList = ({ list, onSelectPaymentMethod }: TBuyPaymentMethodsList) => {
    const { localize } = useTranslations();
    return (
        <div className='buy-payment-methods-list'>
            <Dropdown
                className='buy-payment-methods-list__dropdown'
                data-testid='dt_buy_payment_methods_list'
                dropdownIcon={<div />}
                emptyResultMessage={localize('No results found')}
                icon={<LabelPairedCirclePlusCaptionRegularIcon />}
                isFullWidth
                label={localize('Add')}
                list={list}
                name='payment-method-list'
                onSelect={value => onSelectPaymentMethod(value as string)}
                shouldClearValue
                value=''
                variant='prompt'
            />
        </div>
    );
};

export default BuyPaymentMethodsList;
