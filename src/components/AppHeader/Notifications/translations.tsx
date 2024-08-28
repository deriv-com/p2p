import { TLocalize } from 'types';

const getTitle = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification,   ' + message_key, payload);
    }
};


const getMessage = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification, ' + message_key, payload);
    }
}


const getActionText = (localize: TLocalize, message_key: string, payload?: any) => {
    switch (message_key) {
        case 'p2p-order-complete':
            return localize('Your order got completed!', payload);
        case 'p2p-limit-upgrade-available':
            return localize('Your daily limits got automatically updated!', payload);
            // return localize('Click here to increase your daily limits!', payload);
        case 'p2p-limit-upgraded':
            return localize('Your daily limits got automatically updated!', payload);
        default:
            return localize('Unknown notification, ' + message_key, payload);
    }
}

export { getTitle, getMessage, getActionText };