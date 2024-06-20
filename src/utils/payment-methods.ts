import { TAccumulatedPaymentMethods, THooks, TPaymentMethod } from 'types';

/**
 * **/
// payment method order: Bank Transfer -> EWallets -> Others
const paymentMethodOrder: Record<string, number> = { bank_transfer: 0, other: 2 };

/**
 * Retrieves the order of a payment method.
 * @param method - The payment method.
 * @returns The order of the payment method.
 */
const getPaymentMethodOrder = (method: string) => (!(method in paymentMethodOrder) ? 1 : paymentMethodOrder[method]);

/**
 * Sorts a list of payment methods based on their order.
 * @param paymentMethodsList - The list of payment methods to be sorted.
 * @returns The sorted list of payment methods.
 */
export const sortPaymentMethods = (paymentMethodsList: THooks.AdvertiserPaymentMethods.Get) => {
    return paymentMethodsList?.sort((i, j) => getPaymentMethodOrder(i.method) - getPaymentMethodOrder(j.method));
};

export type TGetPaymentMethodObjects = THooks.AdvertiserPaymentMethods.Get | THooks.PaymentMethods.Get;
type TField = Extract<keyof TGetPaymentMethodObjects[0], 'display_name' | 'id'>;
/**
 * Retrieves the payment method objects.
 * @param paymentMethodsList - The list of payment methods.
 * @param field - The field to be used as the key.
 * @returns The payment method objects.
 * eg. { 'Bank Transfer': { method: 'bank_transfer', ... }, ... }
 */
export const getPaymentMethodObjects = (paymentMethodsList: TGetPaymentMethodObjects, field = 'display_name') => {
    return (
        paymentMethodsList?.reduce((acc: TAccumulatedPaymentMethods, curr: TGetPaymentMethodObjects[number]) => {
            const displayName = curr[field as TField];
            if (displayName) {
                acc[displayName] = curr;
            }
            return acc;
        }, {}) ?? {}
    );
};
/**
 * Sorts a list of payment methods based on their availability.
 * @param paymentMethodsList - The list of payment methods to be sorted.
 * @returns The sorted list of payment methods.
 * eg. [ { method: 'bank_transfer', isAvailable: true, ... }, ... ]
 * **/
export const sortPaymentMethodsWithAvailability = (
    paymentMethodsList: (TPaymentMethod & { isAvailable?: boolean })[]
) => paymentMethodsList.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
