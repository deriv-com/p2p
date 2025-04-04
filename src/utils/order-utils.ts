import { TLocalize, TOrderExpiryOptions } from 'types';
import { formatTime } from './time';

/**
 * The below function formats the list to be displayed in the order expiry time dropdown.
 * @param {TLocalize} localize
 * @param {TOrderExpiryOptions} orderExpiryOptions - The order expiry options received from the p2p_settings API.
 * @returns
 */
export const getOrderTimeCompletionList = (localize: TLocalize, orderExpiryOptions: TOrderExpiryOptions) => {
    return (
        orderExpiryOptions?.map(option => ({
            text: formatTime(option as number, localize),
            value: `${option}`,
        })) ?? []
    );
};
