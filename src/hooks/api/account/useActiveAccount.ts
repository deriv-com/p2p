import { useMemo } from 'react';
import { api } from '@/hooks';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data, error: accountListError, ...rest } = useAccountList();
    const { activeLoginid, data: authData, error: authError } = useAuthData();
    const { data: balanceData } = api.account.useBalance();
    const activeAccount = useMemo(
        () => data?.find(account => account.loginid === activeLoginid),
        [activeLoginid, data]
    );

    const modifiedAccount = useMemo(() => {
        return activeAccount
            ? {
                  ...activeAccount,
                  balance: balanceData?.accounts?.[activeAccount?.loginid]?.balance ?? 0,
                  country: authData?.authorize?.country,
                  isWalletAccount:
                      activeAccount.account_category === 'wallet' ||
                      authData?.authorize?.linked_to?.some(item => item.platform === 'dwallet'),
              }
            : undefined;
    }, [activeAccount, balanceData, authData]);

    return {
        /** User's current active account. */
        accountListError,
        authError,
        data: modifiedAccount,
        ...rest,
    };
};

export default useActiveAccount;
