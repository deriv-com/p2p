import { useCallback, useReducer } from 'react';
import { TPaymentMethod, TSelectedPaymentMethod } from 'types';
import { LightDivider, PaymentMethodForm } from '@/components';
import { useModalManager } from '@/hooks';
import { advertiserPaymentMethodsReducer } from '@/reducers';
import { sortPaymentMethodsWithAvailability } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import { PaymentMethodCard } from '../../PaymentMethodCard';

type TBuySellPaymentSectionProps = {
    availablePaymentMethods: (TPaymentMethod & { isAvailable?: boolean })[];
    onSelectPaymentMethodCard?: (paymentMethodId: number) => void;
    selectedPaymentMethodIds: number[];
};

const BuySellPaymentSection = ({
    availablePaymentMethods,
    onSelectPaymentMethodCard,
    selectedPaymentMethodIds,
}: TBuySellPaymentSectionProps) => {
    const { isMobile } = useDevice();
    const sortedList = sortPaymentMethodsWithAvailability(availablePaymentMethods);

    const [formState, dispatch] = useReducer(advertiserPaymentMethodsReducer, {});
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    const handleAddPaymentMethod = (displayName: string, selectedPaymentMethod?: TSelectedPaymentMethod) => {
        dispatch({
            payload: {
                selectedPaymentMethod: {
                    ...selectedPaymentMethod,
                    displayName,
                    method: selectedPaymentMethod?.method ?? selectedPaymentMethod?.id,
                },
            },
            type: 'ADD',
        });
    };

    const handleResetFormState = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    return (
        <>
            <div className='flex px-[1.6rem] lg:px-[2.4rem] flex-col py-[1.6rem]'>
                <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                    Receive payment to
                </Text>
                <Text size={isMobile ? 'md' : 'sm'}>
                    {sortedList && sortedList.length > 0
                        ? 'You may choose up to 3.'
                        : 'To place an order, add one of the advertiser’s preferred payment methods:'}
                </Text>
                <div className='flex gap-[0.8rem] flex-wrap'>
                    {sortedList?.map(paymentMethod => (
                        <PaymentMethodCard
                            key={paymentMethod?.id}
                            medium
                            onClickAdd={() => {
                                showModal('PaymentMethodForm', { shouldStackModals: false });
                                handleAddPaymentMethod(paymentMethod?.display_name, paymentMethod);
                            }}
                            onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                            paymentMethod={paymentMethod}
                            selectedPaymentMethodIds={selectedPaymentMethodIds}
                        />
                    ))}
                </div>
            </div>
            <LightDivider />
            {isModalOpenFor('PaymentMethodForm') && (
                <PaymentMethodForm
                    displayModal={!isMobile && !!isModalOpenFor('PaymentMethodForm')}
                    formState={formState}
                    onRequestClose={hideModal}
                    onResetFormState={handleResetFormState}
                />
            )}
        </>
    );
};

export default BuySellPaymentSection;
