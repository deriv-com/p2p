import { ComponentProps } from 'react';
import { LabelPairedCirclePlusCaptionRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import './BuyPaymentMethodsList.scss';

type TBuyPaymentMethodsList = {
    list: ComponentProps<typeof Dropdown>['list'];
    onSelectPaymentMethod: (paymentMethod: string) => void;
};

const BuyPaymentMethodsList = ({ list, onSelectPaymentMethod }: TBuyPaymentMethodsList) => {
    return (
        <div className='buy-payment-methods-list'>
            <Dropdown
                className='buy-payment-methods-list__dropdown'
                icon={<LabelPairedCirclePlusCaptionRegularIcon />}
                isFullWidth
                list={list}
                name='payment-method-list'
                onSelect={onSelectPaymentMethod}
                placeholder='Add'
                value=''
                variant='prompt'
            />
        </div>
    );
};

export default BuyPaymentMethodsList;
