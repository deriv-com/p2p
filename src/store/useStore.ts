/* eslint-disable sort-keys */
import { create } from 'zustand';
import { api } from '@/hooks';
import { TSortByValues } from '@/utils';

type State = {
    filteredCurrency: string;
    hasCreatedAdvertiser: boolean;
    selectedPaymentMethods: string[];
    shouldUseClientLimits: boolean;
    sortByValue: TSortByValues;
    userInfoState:
        | {
              error: ReturnType<typeof api.advertiser.useGetInfo>['error'];
              isActive: boolean;
              isIdle: boolean;
              isLoading: boolean;
          }
        | undefined;
};

type Action = {
    setFilteredCurrency: (filteredCurrency: string) => void;
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => void;
    setSelectedPaymentMethods: (selectedPaymentMethods: string[]) => void;
    setShouldUseClientLimits: (shouldUseClientLimits: boolean) => void;
    setSortByValue: (sortByValue: TSortByValues) => void;
    setUserInfoState: (userInfoState: State['userInfoState']) => void;
};

const useStore = create<Action & State>()(set => ({
    filteredCurrency: '',
    hasCreatedAdvertiser: false,
    selectedPaymentMethods: [],
    shouldUseClientLimits: true,
    sortByValue: 'rate',
    userInfoState: undefined,
    setFilteredCurrency: (filteredCurrency: string) => set({ filteredCurrency }),
    setHasCreatedAdvertiser: (hasCreatedAdvertiser: boolean) => set({ hasCreatedAdvertiser }),
    setSelectedPaymentMethods: (selectedPaymentMethods: string[]) => set({ selectedPaymentMethods }),
    setShouldUseClientLimits: (shouldUseClientLimits: boolean) => set({ shouldUseClientLimits }),
    setSortByValue: (sortByValue: TSortByValues) => set({ sortByValue }),
    setUserInfoState: userInfoState => set({ userInfoState }),
}));

export default useStore;
