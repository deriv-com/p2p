import { TrackJS } from 'trackjs';
import { useAuthData } from '@deriv-com/api-hooks';

const { VITE_TRACKJS_TOKEN } = process.env;

const useTrackjs = () => {
    const { activeLoginid } = useAuthData();
    const init = () => {
        TrackJS.install({
            application: 'deriv-p2p',
            dedupe: false,
            enabled: location.host.indexOf('localhost') !== 0,
            token: VITE_TRACKJS_TOKEN!,
            userId: activeLoginid || 'undefined',
            version: (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content,
        });
    };

    return { init };
};

export default useTrackjs;
