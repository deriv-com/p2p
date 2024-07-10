declare global {
    interface Window {
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        LiveChatWidget: {
            call: (key: string, value?: object | string) => void;
            init: () => void;
            on: (key: string, callback: VoidFunction) => void;
        };
    }
}

export {};
