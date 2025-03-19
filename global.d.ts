declare global {
    interface Window {
        Analytics: unknown;
        DD_RUM: object | undefined;
        DerivInterCom: {
            initialize: (config: ICConfig) => void;
        };
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
        GrowthbookFeatures: { [key: string]: string[] | boolean };
        Intercom: ((action: IntercomAction) => void) | undefined;
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
            destroy: VoidFunction;
            hide: VoidFunction;
            isInitialized: () => boolean;
            isLoaded: () => boolean;
            on: (key: string, callback: VoidFunction) => void;
            open: VoidFunction;
            setConfig: (config: Record<string, Record<string, unknown>>) => void;
            show: VoidFunction;
            user: {
                clear: () => Promise<void>;
                setLocale(locale: string): void;
            };
        };
        fcWidgetMessengerConfig: {
            config: Record<string, Record<string, unknown>>;
        };
    }
}

export {};
