/* eslint-disable sort-keys */
import { create } from 'zustand';
import { TSortByValues } from '@/utils';

type TBuySellFiltersState = {
    filteredCurrency: string;
    hasCreatedAdvertiser: boolean;
    selectedPaymentMethods: string[];
    shouldUseClientLimits: boolean;
    sortByValue: TSortByValues;
};

type TBuySellFiltersAction = {
    setFilteredCurrency: (filteredCurrency: string) => void;
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => void;
    setSelectedPaymentMethods: (selectedPaymentMethods: string[]) => void;
    setShouldUseClientLimits: (shouldUseClientLimits: boolean) => void;
    setSortByValue: (sortByValue: TSortByValues) => void;
};

const useBuySellFiltersStore = create<TBuySellFiltersAction & TBuySellFiltersState>()(set => ({
    filteredCurrency: '',
    hasCreatedAdvertiser: false,
    selectedPaymentMethods: [],
    shouldUseClientLimits: true,
    sortByValue: 'rate',
    setFilteredCurrency: filteredCurrency => set({ filteredCurrency }),
    setHasCreatedAdvertiser: hasCreatedAdvertiser => set({ hasCreatedAdvertiser }),
    setSelectedPaymentMethods: selectedPaymentMethods => set({ selectedPaymentMethods }),
    setShouldUseClientLimits: shouldUseClientLimits => set({ shouldUseClientLimits }),
    setSortByValue: sortByValue => set({ sortByValue }),
}));

export default useBuySellFiltersStore;
