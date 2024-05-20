import { TLocalize } from 'types';

export const ORDERS_STATUS = {
    ACTIVE_ORDERS: 'Active orders',
    BUYER_CONFIRMED: 'buyer-confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    DISPUTE_COMPLETED: 'dispute-completed',
    DISPUTE_REFUNDED: 'dispute-refunded',
    DISPUTED: 'disputed',
    PAST_ORDERS: 'Past orders',
    PENDING: 'pending',
    REFUNDED: 'refunded',
    TIMED_OUT: 'timed-out',
} as const;

//TODO: Below constant to be removed once list is fetched from API
export const getOrderTimeCompletionList = (localize: TLocalize) =>
    [
        {
            text: localize('1 hour'),
            value: '3600',
        },
        {
            text: localize('45 minutes'),
            value: '2700',
        },
        {
            text: localize('30 minutes'),
            value: '1800',
        },
        {
            text: localize('15 minutes'),
            value: '900',
        },
    ] as const;

export const getOrderTimeInfoMessage = (localize: TLocalize) =>
    localize('Orders will expire if they aren’t completed within this time.');
