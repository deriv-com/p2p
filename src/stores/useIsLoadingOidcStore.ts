import { create } from 'zustand';

type TIsLoadingOidcState = {
    isCheckingOidcTokens: boolean;
};

type TIsLoadingOidcAction = {
    setIsCheckingOidcTokens: (isCheckingOidcTokens: boolean) => void;
};

const useIsLoadingOidcStore = create<TIsLoadingOidcAction & TIsLoadingOidcState>()(set => ({
    isCheckingOidcTokens: true,
    setIsCheckingOidcTokens: isCheckingOidcTokens => set({ isCheckingOidcTokens }),
}));

export default useIsLoadingOidcStore;
