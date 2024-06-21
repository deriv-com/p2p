import { TOrderIdsMap } from 'types';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';

/**
 * The below function checks if the order was visited by the user, by checking if the order id is present in the order_ids array in the local storage.
 * @param orderId - The order id to check if it was visited.
 * @returns {boolean} Returns true if the order was visited, false otherwise.
 */

export const isOrderSeen = (orderId: string, loginId: string) => {
    const orderIdsMap = LocalStorageUtils.getValue<TOrderIdsMap>(LocalStorageConstants.p2pOrderIds) || {};

    return (orderIdsMap[loginId] || []).includes(orderId);
};
