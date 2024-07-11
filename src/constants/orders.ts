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

export const getOrderTimeInfoMessage = (localize: TLocalize) =>
    localize('Orders will expire if they aren’t completed within this time.');
