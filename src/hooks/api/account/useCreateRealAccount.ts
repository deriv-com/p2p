import { useMutation } from '@deriv-com/api-hooks';

/**
 * Hook that creates a real account.
 */
const useCreateRealAccount = () => {
    const { data, ...rest } = useMutation({
        name: 'new_account_real',
    });

    return {
        data: data?.new_account_real,
        ...rest,
    };
};

export default useCreateRealAccount;
