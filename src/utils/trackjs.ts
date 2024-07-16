import { TrackJS } from 'trackjs';

const { VITE_TRACKJS_TOKEN } = import.meta.env;

type TLogTrackJSErrorParams = (typeof TrackJS)['console']['log'];

export const initTrackJS = () => {
    if (location.host.indexOf('localhost') !== 0) {
        TrackJS.install({
            application: 'deriv-p2p',
            console: { watch: ['log', 'error'] },
            dedupe: false,
            token: VITE_TRACKJS_TOKEN,
            userId: '{{visitorId}}',
            version: (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content,
        });
    }
};

export const logTrackJSError: TLogTrackJSErrorParams = (...args) => {
    TrackJS.console.log({
        ...args,
    });
};
