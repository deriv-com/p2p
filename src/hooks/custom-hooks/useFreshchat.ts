import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = (token: string | null, flag: boolean) => {
    const freshchatScript = 'https://static.deriv.com/scripts/freshchat/v1.0.2.js';
    const scriptStatus = useScript(flag ? freshchatScript : null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!flag || scriptStatus !== 'ready' || !window.FreshChat || !window.fcSettings) {
            return;
        }

        let checkInterval: NodeJS.Timeout;

        const initializeFreshChat = () => {
            window.FreshChat.initialize({
                hideButton: true,
                token,
            });

            checkInterval = setInterval(() => {
                if (window?.fcWidget?.isInitialized()) {
                    setIsReady(true);
                    clearInterval(checkInterval);
                }
            }, 500);
        };

        initializeFreshChat();

        return () => {
            if (checkInterval) {
                clearInterval(checkInterval);
            }
        };
    }, [flag, scriptStatus, token]);

    return { isReady };
};
export default useFreshChat;
