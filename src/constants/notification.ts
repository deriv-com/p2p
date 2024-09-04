import { TLocalize } from 'types';
import { FormatUtils } from '@deriv-com/utils';

export const getNotification = (localize: TLocalize, messageKey: string, payload?: string) => {
    const values = payload ? JSON.parse(payload) : {};
    const notification = {
        actionText: '',
        message: '',
        title: '',
    };

    switch (messageKey) {
        case 'p2p-order-complete':
            notification.title = localize('Your order {{order_id}} is complete', values);
            notification.message = localize(
                '{{name}} has released your funds. Would you like to give your feedback?',
                values
            );
            notification.actionText = localize('Give feedback', values);

            break;
        case 'p2p-limit-upgrade-available':
            notification.title = localize('Enjoy higher daily limits', values);
            notification.message = localize(
                'Would you like to increase your daily limits to {{new_buy_limit}} {{currency}} (buy) and {{new_sell_limit}} {{currency}} (sell)?',
                {
                    currency: values.account_currency,
                    new_buy_limit: FormatUtils.formatMoney(values.new_buy_limit),
                    new_sell_limit: FormatUtils.formatMoney(values.new_sell_limit),
                }
            );
            notification.actionText = localize('Yes, increase my limits');

            break;
        default:
            notification.message = messageKey;
    }

    return notification;
};
