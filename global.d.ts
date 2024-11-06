declare global {
    interface Window {
        Analytics: unknown;
        DD_RUM: object | undefined;
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
        GrowthbookFeatures: { [key: string]: boolean };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        LiveChatWidget: {
            call: (key: string, value?: object | string) => void;
            init: () => void;
            on: (key: string, callback: VoidFunction) => void;
        };
        dataLayer: {
            push: (event: { [key: string]: boolean | number | string; event: string }) => void;
        };
        fcSettings: {
            [key: string]: unknown;
        };
        fcWidget: {
            close: VoidFunction;
            hide: VoidFunction;
            isInitialized: () => boolean;
            isLoaded: () => boolean;
            on: (key: string, callback: VoidFunction) => void;
            open: VoidFunction;
            setConfig: (config: Record<string, Record<string, unknown>>) => void;
            show: VoidFunction;
            user: {
                setLocale(locale: string): void;
            };
        };
        fcWidgetMessengerConfig: {
            config: Record<string, Record<string, unknown>>;
        };
    }
}

export {};
