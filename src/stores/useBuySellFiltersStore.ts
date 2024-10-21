/* eslint-disable sort-keys */
import { create } from 'zustand';
import { TSortByValues } from '@/utils';

type TBuySellFiltersState = {
    filteredCurrency: string;
    selectedPaymentMethods: string[];
    shouldUseClientLimits: boolean;
    showFollowedUsers: boolean;
    sortByValue: TSortByValues;
};

type TBuySellFiltersAction = {
    setFilteredCurrency: (filteredCurrency: string) => void;
    setSelectedPaymentMethods: (selectedPaymentMethods: string[]) => void;
    setShouldUseClientLimits: (shouldUseClientLimits: boolean) => void;
    setShowFollowedUsers: (showFollowedUsers: boolean) => void;
    setSortByValue: (sortByValue: TSortByValues) => void;
};

const useBuySellFiltersStore = create<TBuySellFiltersAction & TBuySellFiltersState>()(set => ({
    filteredCurrency: '',
    selectedPaymentMethods: [],
    shouldUseClientLimits: true,
    showFollowedUsers: false,
    sortByValue: 'rate',
    setFilteredCurrency: filteredCurrency => set({ filteredCurrency }),
    setSelectedPaymentMethods: selectedPaymentMethods => set({ selectedPaymentMethods }),
    setShouldUseClientLimits: shouldUseClientLimits => set({ shouldUseClientLimits }),
    setShowFollowedUsers: showFollowedUsers => set({ showFollowedUsers }),
    setSortByValue: sortByValue => set({ sortByValue }),
}));

export default useBuySellFiltersStore;
