import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { BuyAdPaymentSelection } from '../BuyAdPaymentSelection';
import { SellAdPaymentSelection } from '../SellAdPaymentSelection';

type TAdPaymentSectionProps = {
    isSellAdvert: boolean;
    onSelectPaymentMethod: (paymentMethod: number | string, action?: string) => void;
    selectedPaymentMethods: (number | string)[];
};
const AdPaymentSelection = ({
    isSellAdvert,
    onSelectPaymentMethod,
    selectedPaymentMethods,
}: TAdPaymentSectionProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    return (
        <>
            <div className='mb-[2.4rem]'>
                <Text as='div' color='prominent' size={textSize}>
                    <Localize i18n_default_text='Payment methods' />
                </Text>
                <Text as='div' color='less-prominent' size={textSize}>
                    {isSellAdvert ? (
                        <Localize i18n_default_text='You may tap and choose up to 3.' />
                    ) : (
                        <Localize i18n_default_text='You may choose up to 3.' />
                    )}
                </Text>
            </div>

            {isSellAdvert ? (
                <SellAdPaymentSelection
                    onSelectPaymentMethod={onSelectPaymentMethod}
                    selectedPaymentMethodIds={selectedPaymentMethods as number[]}
                />
            ) : (
                <BuyAdPaymentSelection
                    onSelectPaymentMethod={onSelectPaymentMethod}
                    selectedPaymentMethods={selectedPaymentMethods as string[]}
                />
            )}
        </>
    );
};

export default AdPaymentSelection;
