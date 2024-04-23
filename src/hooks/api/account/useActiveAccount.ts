import { useMemo } from 'react';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data, ...rest } = useAccountList();
    const { activeLoginid } = useAuthData();
    const active_account = useMemo(
        () => data?.find(account => account.loginid === activeLoginid),
        [activeLoginid, data]
    );

    return {
        /** User's current active account. */
        data: active_account,
        ...rest,
    };
};

export default useActiveAccount;
