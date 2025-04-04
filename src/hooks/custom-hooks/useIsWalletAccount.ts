import { api } from '..';

const useIsWalletAccount = () => {
    const { data: activeAccount, isFetchedAfterMount } = api.account.useActiveAccount();

    const isWalletAccount = activeAccount?.isWalletAccount;
    return { isFetchedAfterMount, isWalletAccount };
};

export default useIsWalletAccount;
