import { TrackJS } from 'trackjs';
import { useAuthData } from '@deriv-com/api-hooks';

const { VITE_TRACKJS_TOKEN } = import.meta.env;

type TLogTrackJSErrorParams = (typeof TrackJS)['console']['log'];

const useTrackjs = () => {
    const { activeLoginid } = useAuthData();
    const init = () => {
        TrackJS.install({
            application: 'deriv-p2p',
            dedupe: false,
            enabled: location.host.indexOf('localhost') !== 0,
            token: VITE_TRACKJS_TOKEN,
            userId: activeLoginid || 'undefined',
            version: (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content,
        });
    };

    const logError: TLogTrackJSErrorParams = (...args) => {
        TrackJS.console.log({
            ...args,
        });
    };

    return { init, logError };
};

export default useTrackjs;
