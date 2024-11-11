import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = (token: string | null) => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat/v1.0.2.js');
    const [isReady, setIsReady] = useState(false);
    const language = localStorage.getItem('i18n_language') || 'EN';

    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                if (window.fcWidget?.isInitialized() == true && !isReady) {
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    hideButton: true,
                    token,
                });

                const intervalId: NodeJS.Timeout = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId);
            }
        };

        initFreshChat();
    }, [isReady, language, scriptStatus, token]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
