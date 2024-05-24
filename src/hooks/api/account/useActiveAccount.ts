import { useMemo } from 'react';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { useBalance } from '.';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data, ...rest } = useAccountList();
    const { activeLoginid } = useAuthData();
    const { data: balanceData } = useBalance();
    const active_account = useMemo(
        () => data?.find(account => account.loginid === activeLoginid),
        [activeLoginid, data]
    );

    const modified_account = useMemo(() => {
        return active_account
            ? {
                  ...active_account,
                  balance: balanceData?.accounts?.[active_account?.loginid]?.balance ?? 0,
              }
            : undefined;
    }, [active_account, balanceData]);

    return {
        /** User's current active account. */
        data: modified_account,
        ...rest,
    };
};

export default useActiveAccount;
