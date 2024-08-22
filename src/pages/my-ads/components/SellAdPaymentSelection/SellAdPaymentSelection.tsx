import { useCallback, useEffect, useReducer } from 'react';
import { TAdvertiserPaymentMethod, TSelectedPaymentMethod } from 'types';
import { PaymentMethodCard, PaymentMethodForm } from '@/components';
import { api } from '@/hooks';
import { useIsAdvertiser, useModalManager } from '@/hooks/custom-hooks';
import { advertiserPaymentMethodsReducer } from '@/reducers';
import { LabelPairedPlusLgBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './SellAdPaymentSelection.scss';

type TSellAdPaymentSelectionProps = {
    onSelectPaymentMethod: (paymentMethod: number) => void;
    selectedPaymentMethodIds: number[];
};
const SellAdPaymentSelection = ({ onSelectPaymentMethod, selectedPaymentMethodIds }: TSellAdPaymentSelectionProps) => {
    const { isDesktop, isMobile } = useDevice();
    const isAdvertiser = useIsAdvertiser();
    const { data: advertiserPaymentMethods, get } = api.advertiserPaymentMethods.useGet();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { currentLang } = useTranslations();

    const [formState, dispatch] = useReducer(advertiserPaymentMethodsReducer, {});

    useEffect(() => {
        if (isAdvertiser) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser, currentLang]); // currentLang is used to refetch the data when the language changes

    const handleAddPaymentMethod = (selectedPaymentMethod?: TSelectedPaymentMethod) => {
        dispatch({
            payload: {
                selectedPaymentMethod,
            },
            type: 'ADD',
        });
    };

    const handleResetFormState = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    return (
        <div className='sell-ad-payment-selection__card'>
            {advertiserPaymentMethods?.map((paymentMethod: TAdvertiserPaymentMethod) => {
                const isDisabled =
                    selectedPaymentMethodIds.length >= 3 &&
                    !selectedPaymentMethodIds.includes(Number(paymentMethod.id));
                return (
                    <PaymentMethodCard
                        isDisabled={isDisabled} //TODO: add logic to disable if selectedPaymentMethodIds.length >= 3
                        key={paymentMethod.id}
                        medium
                        onSelectPaymentMethodCard={onSelectPaymentMethod}
                        paymentMethod={paymentMethod}
                        selectedPaymentMethodIds={selectedPaymentMethodIds}
                        textSize={isMobile ? 'md' : 'xs'}
                    />
                );
            })}
            <div className='sell-ad-payment-selection__button'>
                <Button
                    className='flex items-center justify-center w-[3.2rem] h-[3.2rem] mb-[0.8rem] rounded-full bg-[#ff444f]'
                    onClick={() => showModal('PaymentMethodForm')}
                    type='button'
                >
                    <LabelPairedPlusLgBoldIcon fill='white' />
                </Button>
                <Text size={isMobile ? 'md' : 'sm'}>
                    <Localize i18n_default_text='Payment method' />
                </Text>
            </div>
            {isModalOpenFor('PaymentMethodForm') && (
                <PaymentMethodForm
                    displayModal={isDesktop && !!isModalOpenFor('PaymentMethodForm')}
                    formState={formState}
                    onAdd={handleAddPaymentMethod}
                    onRequestClose={hideModal}
                    onResetFormState={handleResetFormState}
                />
            )}
        </div>
    );
};

export default SellAdPaymentSelection;
