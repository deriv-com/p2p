import { useEffect, useMemo, useState } from 'react';
import { TBankName, TFormState, THooks, TName, TSelectedPaymentMethod } from 'types';
import { PaymentMethodCard } from '@/components';
import { PaymentMethodErrorModal, PaymentMethodModal } from '@/components/Modals';
import { getPaymentMethodCategories } from '@/constants';
import { api } from '@/hooks';
import { sortPaymentMethods } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import AddNewButton from '../AddNewButton';
import './PaymentMethodsListContent.scss';

type TPaymentMethodsGroup = Record<
    string,
    {
        paymentMethods: THooks.AdvertiserPaymentMethods.Get;
        title: string;
    }
>;

type TPaymentMethodsListContentProps = {
    formState: TFormState;
    isMobile: boolean;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onDelete: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onEdit: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
    p2pAdvertiserPaymentMethods?: THooks.AdvertiserPaymentMethods.Get;
};

/**
 * @component This component is used to display a list of payment methods. It's the content of the PaymentMethodsList component, when the list is not empty
 * @param formState - The current state of the form
 * @param isMobile - Whether the current device is mobile or not
 * @param p2pAdvertiserPaymentMethods - The list of payment methods
 * @returns {JSX.Element}
 * @example <PaymentMethodsListContent formState={formState} isMobile={isMobile} p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods} />
 * **/
const PaymentMethodsListContent = ({
    formState,
    isMobile,
    onAdd,
    onDelete,
    onEdit,
    onResetFormState,
    p2pAdvertiserPaymentMethods,
}: TPaymentMethodsListContentProps) => {
    const { localize } = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        delete: deleteAdvertiserPaymentMethod,
        error: deleteError,
        isError: isDeleteError,
        isSuccess: isDeleteSuccessful,
    } = api.advertiserPaymentMethods.useDelete();
    const { actionType, selectedPaymentMethod } = formState;
    const groupedPaymentMethods = useMemo(() => {
        const groups: TPaymentMethodsGroup = {};
        const sortedPaymentMethods = sortPaymentMethods(p2pAdvertiserPaymentMethods ?? []);
        sortedPaymentMethods?.forEach(advertiserPaymentMethod => {
            if (groups[advertiserPaymentMethod.type]) {
                groups[advertiserPaymentMethod.type]?.paymentMethods?.push(advertiserPaymentMethod);
            } else {
                groups[advertiserPaymentMethod.type] = {
                    paymentMethods: [advertiserPaymentMethod],
                    title: getPaymentMethodCategories(localize)[advertiserPaymentMethod.type],
                };
            }
        });
        return groups;
    }, [p2pAdvertiserPaymentMethods]);

    useEffect(() => {
        if (isDeleteError) {
            setIsModalOpen(true);
        }
    }, [isDeleteError]);

    useEffect(() => {
        if (isDeleteSuccessful) {
            setIsModalOpen(false);
            onResetFormState();
        }
    }, [isDeleteSuccessful, onResetFormState]);

    return (
        <div className='payment-methods-list-content'>
            {!isMobile && <AddNewButton isMobile={isMobile} onAdd={onAdd} />}
            {Object.keys(groupedPaymentMethods)?.map(key => {
                return (
                    <div className='payment-methods-list-content__group' key={key}>
                        <Text size='sm' weight='bold'>
                            {groupedPaymentMethods[key].title}
                        </Text>
                        <div className='payment-methods-list-content__group-body'>
                            {groupedPaymentMethods[key].paymentMethods?.map(advertiserPaymentMethod => {
                                return (
                                    <PaymentMethodCard
                                        isEditable
                                        key={advertiserPaymentMethod.id}
                                        onDeletePaymentMethod={() => {
                                            onDelete(advertiserPaymentMethod);
                                            setIsModalOpen(true);
                                        }}
                                        onEditPaymentMethod={() => {
                                            onEdit({
                                                displayName: advertiserPaymentMethod.display_name,
                                                fields: advertiserPaymentMethod.fields,
                                                id: advertiserPaymentMethod.id,
                                                method: advertiserPaymentMethod.method,
                                            });
                                        }}
                                        paymentMethod={advertiserPaymentMethod}
                                        shouldShowPaymentMethodDisplayName={false}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            {actionType === 'DELETE' && isDeleteError && (
                <PaymentMethodErrorModal
                    errorMessage={String(deleteError?.message)}
                    isModalOpen={isModalOpen}
                    onConfirm={() => {
                        setIsModalOpen(false);
                    }}
                    title={localize('Something’s not right')}
                />
            )}
            {actionType === 'DELETE' && !isDeleteError && (
                <PaymentMethodModal
                    description={localize('Are you sure you want to remove this payment method?')}
                    isModalOpen={isModalOpen}
                    onConfirm={() => {
                        deleteAdvertiserPaymentMethod(Number(selectedPaymentMethod?.id));
                    }}
                    onReject={() => {
                        setIsModalOpen(false);
                    }}
                    primaryButtonLabel={localize('No')}
                    secondaryButtonLabel={localize('Yes, remove')}
                    title={localize('Delete {{value}}?', {
                        value:
                            (selectedPaymentMethod?.fields?.bank_name as TBankName)?.value ??
                            (selectedPaymentMethod?.fields?.name as TName)?.value ??
                            selectedPaymentMethod?.display_name,
                    })}
                />
            )}
        </div>
    );
};

export default PaymentMethodsListContent;
