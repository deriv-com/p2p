import { useMutation, useQuery } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../useInvalidateQuery';

/**
 * Hook that creates a wallet account.
 */
const useCreateWalletAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, isSuccess, ...rest } = useMutation({
        name: 'new_account_wallet',
        onSuccess: () => {
            invalidate('authorize');
        },
    });
    const { isSuccess: isAuthorized } = useQuery({
        enabled: isSuccess,
        name: 'authorize',
        payload: { authorize: data?.new_account_wallet?.oauth_token || '' },
    });

    return {
        data: data?.new_account_wallet,
        isAuthorized,
        ...rest,
    };
};

export default useCreateWalletAccount;
