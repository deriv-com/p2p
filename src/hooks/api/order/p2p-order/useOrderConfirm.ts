import { useCallback, useMemo } from 'react';
import { useP2pOrderConfirm } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type Tpayload = NonNullable<Parameters<ReturnType<typeof useP2pOrderConfirm>['mutate']>>[0]['payload'];

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

    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pOrderConfirm({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const modified_data = useMemo(() => {
        const p2p_order_confirm = data;

        if (!p2p_order_confirm) return undefined;

        return {
            ...p2p_order_confirm,
            /** Indicates whether a dry run was successful or not (for dry run confirmations) **/
            is_dry_run_successful: Boolean(p2p_order_confirm.dry_run),
        };
    }, [data]);

    const mutate = useCallback((payload: Tpayload) => _mutate({ payload }), [_mutate]);

    return {
        /** Order confirmation details **/
        data: modified_data,
        /** Function to confirm an order or perform a dry run (incase the dry_run option is specified in the payload) **/
        mutate,
        ...rest,
    };
};

export default useOrderConfirm;
