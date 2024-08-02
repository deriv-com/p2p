import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { TCurrencyListItem } from 'types';
import { useOnClickOutside } from 'usehooks-ts';
import { FullPageMobileWrapper } from '@/components';
import { api } from '@/hooks';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { CurrencySelector } from './CurrencySelector';
import './CurrencyDropdown.scss';

type TCurrencyDropdownProps = {
    selectedCurrency: string;
    setSelectedCurrency: (value: string) => void;
};

const CurrencyDropdown = ({ selectedCurrency, setSelectedCurrency }: TCurrencyDropdownProps) => {
    const { data } = api.settings.useSettings();
    const { isDesktop, isMobile } = useDevice();
    const [showCurrencySelector, setShowCurrencySelector] = useState<boolean>(false);

    const currencySelectorRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(currencySelectorRef, () => {
        setShowCurrencySelector(false);
    });

    const localCurrencies =
        useMemo(() => {
            return data?.currencyList
                ? data.currencyList
                      .sort((a, b) => (a?.value ?? '').localeCompare(b?.value ?? ''))
                      .sort((a, b) => {
                          if (a?.value === selectedCurrency) return -1;
                          if (b?.value === selectedCurrency) return 1;
                          return 0;
                      })
                : [];
        }, [data?.currencyList, selectedCurrency]) ?? [];

    const onSelectItem = (currency: string) => {
        setShowCurrencySelector(false);
        setSelectedCurrency(currency);
    };

    if (showCurrencySelector && !isDesktop)
        return (
            <FullPageMobileWrapper
                className='currency-dropdown__full-page-modal'
                onBack={() => {
                    setShowCurrencySelector(false);
                }}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        <Localize i18n_default_text='Preferred currency' />
                    </Text>
                )}
            >
                <CurrencySelector
                    localCurrencies={localCurrencies as TCurrencyListItem[]}
                    onSelectItem={onSelectItem}
                    selectedCurrency={selectedCurrency}
                />
            </FullPageMobileWrapper>
        );

    return (
        <div className='currency-dropdown' data-testid='dt_currency_dropdown' ref={currencySelectorRef}>
            <div
                className={clsx('currency-dropdown__dropdown', {
                    'currency-dropdown__dropdown--active': showCurrencySelector,
                })}
                onClick={() => setShowCurrencySelector(prev => !prev)}
            >
                <Text className='currency-dropdown__dropdown-text' size={isMobile ? 'xs' : '2xs'}>
                    <Localize i18n_default_text='Currency' />
                </Text>
                <Text size={isMobile ? 'md' : 'sm'}>{selectedCurrency}</Text>
                <LabelPairedChevronDownMdRegularIcon
                    className={clsx('currency-dropdown__dropdown-icon', {
                        'currency-dropdown__dropdown-icon--active': showCurrencySelector,
                    })}
                />
            </div>
            {showCurrencySelector && (
                <CurrencySelector
                    localCurrencies={localCurrencies as TCurrencyListItem[]}
                    onSelectItem={onSelectItem}
                    selectedCurrency={selectedCurrency}
                />
            )}
        </div>
    );
};

export default CurrencyDropdown;
