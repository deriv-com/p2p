/* This utility function is responsible for opening and closing Intercom widget. */

export const Chat = {
    clear: () => {
        window.Intercom?.('shutdown');
    },

    open: () => {
        window.Intercom?.('show');
    },
};
