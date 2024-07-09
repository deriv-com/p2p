import { TFormState, THooks, TSelectedPaymentMethod } from 'types';
import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import AddNewButton from './AddNewButton';
import { PaymentMethodsListContent } from './PaymentMethodsListContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onDelete: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onEdit: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
    p2pAdvertiserPaymentMethods?: THooks.AdvertiserPaymentMethods.Get;
};

/**
 * @component This component is used to display the list of advertiser payment methods
 * @param formState - The form state of the payment method form
 * @returns {JSX.Element}
 * @example <PaymentMethodsList formState={formState} />
 * **/
const PaymentMethodsList = ({
    formState,
    onAdd,
    onDelete,
    onEdit,
    onResetFormState,
    p2pAdvertiserPaymentMethods,
}: TPaymentMethodsListProps) => {
    const { isDesktop, isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className='payment-methods-list__mobile-wrapper'
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderFooter={() => <AddNewButton isMobile onAdd={onAdd} />}
                renderHeader={() => (
                    <Text size={isMobile ? 'lg' : 'md'} weight='bold'>
                        <Localize i18n_default_text='Payment methods' />
                    </Text>
                )}
            >
                {!!p2pAdvertiserPaymentMethods?.length && (
                    <PaymentMethodsListContent
                        formState={formState}
                        isMobile
                        onAdd={onAdd}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onResetFormState={onResetFormState}
                        p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
                    />
                )}
            </FullPageMobileWrapper>
        );
    }

    return p2pAdvertiserPaymentMethods?.length === 0 ? null : (
        <PaymentMethodsListContent
            formState={formState}
            isMobile={false}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onResetFormState={onResetFormState}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethodsList;
