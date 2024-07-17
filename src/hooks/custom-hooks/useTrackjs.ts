import { TrackJS } from 'trackjs';
import { useAuthData } from '@deriv-com/api-hooks';

const { VITE_TRACKJS_TOKEN } = import.meta.env;

type TLogTrackJSErrorParams = (typeof TrackJS)['console']['log'];

const useTrackjs = () => {
    const { activeLoginid } = useAuthData();
    const init = () => {
        if (location.host.indexOf('localhost') !== 0) {
            TrackJS.install({
                application: 'deriv-p2p',
                console: { watch: ['log', 'error'] },
                dedupe: false,
                token: VITE_TRACKJS_TOKEN,
                userId: activeLoginid || 'undefined',
                version: (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content,
            });
        }
    };

    const logError: TLogTrackJSErrorParams = (...args) => {
        TrackJS.console.log({
            ...args,
        });
    };

    return { init, logError };
};

export default useTrackjs;
