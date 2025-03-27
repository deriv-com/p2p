import { api } from '..';

const useIsWalletAccount = () => {
    const { data: activeAccount } = api.account.useActiveAccount();
    const isWalletAccount = activeAccount?.isWalletAccount;
    return isWalletAccount;
};

export default useIsWalletAccount;
