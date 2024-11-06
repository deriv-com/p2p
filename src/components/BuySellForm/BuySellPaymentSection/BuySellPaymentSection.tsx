import { Dispatch, SetStateAction, useCallback, useReducer } from 'react';
import { TFormState, TPaymentMethod, TReducerAction, TSelectedPaymentMethod } from 'types';
import { LightDivider, PaymentMethodForm } from '@/components';
import { useModalManager } from '@/hooks';
import { advertiserPaymentMethodsReducer } from '@/reducers';
import { sortPaymentMethodsWithAvailability } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { PaymentMethodCard } from '../../PaymentMethodCard';

type TBuySellPaymentSectionProps = {
    advertiserPaymentMethods: TPaymentMethod[];
    availablePaymentMethods: (TPaymentMethod & { isAvailable?: boolean })[];
    isDisabled: boolean;
    onSelectPaymentMethodCard?: (paymentMethodId: number) => void;
    selectedPaymentMethodIds: number[];
    setIsHidden?: Dispatch<SetStateAction<boolean>>;
};

const BuySellPaymentSection = ({
    advertiserPaymentMethods,
    availablePaymentMethods,
    isDisabled = false,
    onSelectPaymentMethodCard,
    selectedPaymentMethodIds,
    setIsHidden,
}: TBuySellPaymentSectionProps) => {
    const { isDesktop } = useDevice();
    const sortedList = sortPaymentMethodsWithAvailability(availablePaymentMethods).filter(p => !p.isAvailable);
    const disableAdvertiserPaymentMethods = selectedPaymentMethodIds.length === 3;
    const { localize } = useTranslations();

    const [formState, dispatch] = useReducer(
        (currentState: TFormState, action: TReducerAction) =>
            advertiserPaymentMethodsReducer(currentState, action, localize),
        {}
    );
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
                <Text color='less-prominent' size={isDesktop ? 'xs' : 'sm'}>
                    <Localize i18n_default_text='Receive payment to' />
                </Text>
                <Text size={isDesktop ? 'sm' : 'md'}>
                    {advertiserPaymentMethods?.length > 0 ? (
                        <Localize i18n_default_text='You may choose up to 3.' />
                    ) : (
                        <Localize i18n_default_text='To place an order, add one of the advertiser’s preferred payment methods:' />
                    )}
                </Text>
                <div className='flex gap-[0.8rem] flex-wrap'>
                    {advertiserPaymentMethods?.map((paymentMethod, index) => {
                        const isSelected = selectedPaymentMethodIds.includes(Number(paymentMethod.id));

                        return (
                            <PaymentMethodCard
                                isDisabled={isDisabled || (disableAdvertiserPaymentMethods && !isSelected)}
                                key={index}
                                medium
                                onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                                paymentMethod={paymentMethod}
                                selectedPaymentMethodIds={selectedPaymentMethodIds}
                            />
                        );
                    })}
                    {sortedList?.map((paymentMethod, index) => (
                        <PaymentMethodCard
                            isDisabled={isDisabled}
                            key={index}
                            medium
                            onClickAdd={() => {
                                setIsHidden?.(true);
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
                    displayModal={isDesktop && !!isModalOpenFor('PaymentMethodForm')}
                    formState={formState}
                    onRequestClose={() => {
                        hideModal();
                        setIsHidden?.(false);
                    }}
                    onResetFormState={handleResetFormState}
                />
            )}
        </>
    );
};

export default BuySellPaymentSection;
