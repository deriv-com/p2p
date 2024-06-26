import { useMemo } from 'react';
import { useP2pOrderConfirm } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

/**
 * A custom hook for handling P2P order confirmation
 *
 * @example
 * ```typescript
 * const { data, mutate } = useOrderConfirm();
 *
 * mutate({
 *    id: '1234',
 *    dry_run: 1,
 *    verification_code: 'verification_code',
 * });
 * // Access order confirmation details from 'data' and use 'mutate' function to confirm an order.
 * ```
 * **/
const useOrderConfirm = () => {
    const invalidate = useInvalidateQuery();

    const { data, ...rest } = useP2pOrderConfirm({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const modifiedData = useMemo(() => {
        const p2pOrderConfirmed = data;

        if (!p2pOrderConfirmed) return undefined;

        return {
            ...p2pOrderConfirmed,
            /** Indicates whether a dry run was successful or not (for dry run confirmations) **/
            isDryRunSuccessful: Boolean(p2pOrderConfirmed.dry_run),
        };
    }, [data]);

    return {
        /** Order confirmation details **/
        data: modifiedData,
        ...rest,
    };
};

export default useOrderConfirm;
