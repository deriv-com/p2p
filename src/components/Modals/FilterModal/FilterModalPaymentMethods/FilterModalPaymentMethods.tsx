import { useEffect, useState } from 'react';
import { THooks } from 'types';
import { Search } from '@/components/Search';
import { api } from '@/hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Checkbox, Text } from '@deriv-com/ui';
import './FilterModalPaymentMethods.scss';

type TFilterModalPaymentMethodsProps = {
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: (value: string[]) => void;
};

const FilterModalPaymentMethods = ({
    selectedPaymentMethods,
    setSelectedPaymentMethods,
}: TFilterModalPaymentMethodsProps) => {
    const { localize } = useTranslations();
    const { data = [] } = api.paymentMethods.useGet();
    const [searchedPaymentMethod, setSearchedPaymentMethod] = useState<string>('');
    const [searchedPaymentMethods, setSearchedPaymentMethods] = useState<THooks.PaymentMethods.Get>(data);

    const onSearch = (value: string) => {
        if (!value) {
            setSearchedPaymentMethods(data);
            return;
        }
        setSearchedPaymentMethod(value);
        if (value) {
            setSearchedPaymentMethods(
                data?.filter(paymentMethod => paymentMethod.display_name.toLowerCase().includes(value.toLowerCase()))
            );
        }
    };

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(searchedPaymentMethods)) setSearchedPaymentMethods(data);
    }, [data]);

    return (
        <div className='filter-modal-payment-methods'>
            <Search
                delayTimer={0}
                name='search-payment-method'
                onSearch={(value: string) => onSearch(value)}
                placeholder={localize('Search payment method')}
            />
            {searchedPaymentMethods?.length > 0 ? (
                <div>
                    {searchedPaymentMethods?.map(paymentMethod => (
                        <Checkbox
                            checked={selectedPaymentMethods?.includes(paymentMethod.id)}
                            key={paymentMethod.id}
                            label={paymentMethod.display_name}
                            name={paymentMethod.id}
                            onChange={event => {
                                if (event.target.checked) {
                                    setSelectedPaymentMethods([...selectedPaymentMethods, paymentMethod.id]);
                                } else {
                                    setSelectedPaymentMethods(
                                        selectedPaymentMethods.filter(id => id !== paymentMethod.id)
                                    );
                                }
                            }}
                            wrapperClassName='p-[1.6rem] leading-[3rem]'
                        />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col justify-center mt-64 break-all'>
                    <Text align='center' weight='bold'>
                        <Localize
                            i18n_default_text='No results for "{{value}}".'
                            values={{ value: searchedPaymentMethod }}
                        />
                    </Text>
                    <Text align='center'>
                        <Localize i18n_default_text='Check your spelling or use a different term.' />
                    </Text>
                </div>
            )}
        </div>
    );
};

export default FilterModalPaymentMethods;
