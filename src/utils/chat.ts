/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './get-featureflag';

const Chat = {
    close: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.close() : window.LiveChatWidget?.call('hide');
    },
    isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat_p2p'),
    open: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.open() : window.LiveChatWidget?.call('maximize');
    },
};

export default Chat;
