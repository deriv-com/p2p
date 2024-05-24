import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks/custom-hooks';
import { DerivLightIcPaymentMethodsWalletIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodsEmpty.scss';

type TPaymentMethodsEmptyProps = {
    onAddPaymentMethod: () => void;
};

/**
 * @component This component is used to display the empty state of the PaymentMethods screen
 * @param {Function} onAddPaymentMethod - Callback to open the form to add a new payment method
 * @returns {JSX.Element}
 * @example <PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />
 * **/
const PaymentMethodsEmpty = ({ onAddPaymentMethod }: TPaymentMethodsEmptyProps) => {
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='payment-methods-empty__mobile'
                onBack={() => {
                    setQueryString({
                        tab: 'default',
                    });
                }}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        <Localize i18n_default_text='Payment methods' />
                    </Text>
                )}
            >
                <div className='payment-methods-empty'>
                    <DerivLightIcPaymentMethodsWalletIcon height={160} />
                    <Text className='payment-methods-empty__heading' size='lg' weight='bold'>
                        <Localize i18n_default_text='You haven’t added any payment methods yet' />
                    </Text>
                    <Text size='lg'>
                        <Localize i18n_default_text='Hit the button below to add payment methods.' />
                    </Text>
                    <Button
                        className='payment-methods-empty__button'
                        isFullWidth
                        onClick={() => {
                            onAddPaymentMethod();
                        }}
                        size='lg'
                        textSize='md'
                    >
                        <Localize i18n_default_text='Add payment methods' />
                    </Button>
                </div>
            </FullPageMobileWrapper>
        );
    }

    return (
        <div className='payment-methods-empty'>
            <DerivLightIcPaymentMethodsWalletIcon height={160} />
            <Text className='payment-methods-empty__heading' weight='bold'>
                <Localize i18n_default_text='You haven’t added any payment methods yet' />
            </Text>
            <Text>
                <Localize i18n_default_text='Hit the button below to add payment methods.' />
            </Text>
            <Button
                className='payment-methods-empty__button'
                onClick={() => {
                    onAddPaymentMethod();
                }}
            >
                <Localize i18n_default_text='Add payment methods' />
            </Button>
        </div>
    );
};
export default PaymentMethodsEmpty;
