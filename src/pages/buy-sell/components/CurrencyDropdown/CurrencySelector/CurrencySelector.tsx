import { useState } from 'react';
import clsx from 'clsx';
import { TCurrencyListItem } from 'types';
import { Search } from '@/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './CurrencySelector.scss';

type TCurrencySelectorProps = {
    localCurrencies: TCurrencyListItem[];
    onSelectItem: (value: string) => void;
    selectedCurrency: string;
};

const CurrencySelector = ({ localCurrencies, onSelectItem, selectedCurrency }: TCurrencySelectorProps) => {
    const { localize } = useTranslations();
    const [searchedCurrency, setSearchedCurrency] = useState<string>('');
    const [searchedCurrencies, setSearchedCurrencies] = useState(localCurrencies);
    const { isDesktop } = useDevice();

    const textSize = isDesktop ? 'sm' : 'md';

    const searchCurrencies = (value: string) => {
        if (!value) {
            setSearchedCurrencies(localCurrencies);
            return;
        }

        setSearchedCurrency(value);

        setSearchedCurrencies(
            localCurrencies.filter(currency => {
                return (
                    currency.value.toLowerCase().includes(value.toLocaleLowerCase()) ||
                    currency.display_name.toLowerCase().includes(value.toLocaleLowerCase())
                );
            })
        );
    };

    return (
        <div className='currency-selector'>
            <Search
                delayTimer={0}
                name='search-currency'
                onSearch={(value: string) => searchCurrencies(value)}
                placeholder={localize('Search')}
            />
            <div className='currency-selector__list'>
                {searchedCurrencies.length > 0 ? (
                    searchedCurrencies.map(currency => {
                        const isSelectedCurrency = currency.value === selectedCurrency;

                        return (
                            <div
                                className='lg:m-0 mx-[1.6rem] my-[0.8rem] cursor-pointer'
                                key={currency.value}
                                onClick={() => onSelectItem(currency.value)}
                            >
                                <div
                                    className={clsx(
                                        'flex justify-between rounded px-[1.6rem] py-[0.8rem] lg:hover:bg-[#d6dadb]',
                                        {
                                            'bg-[#d6dadb]': isSelectedCurrency,
                                        }
                                    )}
                                >
                                    <Text size={textSize} weight={isSelectedCurrency ? 'bold' : 'normal'}>
                                        {currency.text}
                                    </Text>
                                    <Text align='right' size={textSize}>
                                        {currency.display_name}
                                    </Text>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Text
                        align={isDesktop ? 'left' : 'center'}
                        className='lg:mt-0 lg:p-4 mt-64 flex lg:justify-start justify-center'
                        size={textSize}
                        weight={isDesktop ? 'normal' : 'bold'}
                    >
                        <Localize
                            i18n_default_text='No results for "{{searchedCurrency}}".'
                            values={{ searchedCurrency }}
                        />
                    </Text>
                )}
            </div>
        </div>
    );
};

export default CurrencySelector;
