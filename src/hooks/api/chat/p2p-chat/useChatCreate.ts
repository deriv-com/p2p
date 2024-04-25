import { useCallback } from 'react';
import { useP2pChatCreate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pChatCreate>['mutate']>[number];

/**
 * A custom hook to create a p2p chat for the specified order.
 *
 * @example
 * const { data, mutate } = useChatCreate();
 * mutate({ order_id: 'order_id' });
 * **/
const useChatCreate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data: p2p_chat_create,
        mutate: _mutate,
        ...rest
    } = useP2pChatCreate({
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });
    const mutate = useCallback((payload: TPayload) => _mutate(payload), [_mutate]);

    return {
        /** An object containing the chat channel_url and order_id **/
        data: p2p_chat_create,
        /** Function to create a p2p chat for the specified order **/
        mutate,
        ...rest,
    };
};

export default useChatCreate;
