/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './get-featureflag';

export const Chat = {
    clear: async () => {
        const { isFreshChat, isIntercom } = await Chat.getFlags();
        if (isFreshChat) {
            window.fcWidget?.user.clear().then(() => window.fcWidget.destroy());
        } else if (isIntercom && window.Intercom) {
            window.Intercom('shutdown');
        }
    },

    close: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.close() : window.LiveChatWidget?.call('hide');
    },

    getFlags: async () => {
        const [isFreshChat, isIntercom] = await Promise.all([Chat.isFreshChat(), Chat.isIntercom()]);
        return { isFreshChat, isIntercom };
    },

    isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat_p2p'),
    isIntercom: async () => getFeatureFlag('enable_intercom_p2p'),

    open: async () => {
        const { isFreshChat, isIntercom } = await Chat.getFlags();
        if (isFreshChat) {
            window.fcWidget?.open();
        } else if (isIntercom && window.Intercom) {
            window.Intercom('show');
        } else {
            window.LiveChatWidget?.call('maximize');
        }
    },
};
