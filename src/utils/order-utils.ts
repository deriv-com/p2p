/**
 * The below function checks if the order was visited by the user, by checking if the order id is present in the order_ids array in the local storage.
 * @param orderId - The order id to check if it was visited.
 * @returns {boolean} Returns true if the order was visited, false otherwise.
 */
export const isOrderSeen = (orderId: string) => {
    return !!JSON.parse(localStorage.getItem('order_ids') || '[]').includes(orderId);
};
