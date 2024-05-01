declare global {
    interface Window {
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
    }
}

export {};
