declare global {
    interface Window {
        LC_API: {
            open_chat_window: VoidFunction;
        };
        dataLayer: {
            push: (event: { [key: string]: boolean | number | string; event: string }) => void;
        };
    }
}

export {};
