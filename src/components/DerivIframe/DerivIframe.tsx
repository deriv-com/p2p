import { URLConstants } from '@deriv-com/utils';

const DerivIframe = () => {
    const getAllowedLocalStorageOrigin = () => {
        const hostName = window.location.hostname;
        if (/^staging-p2p\.deriv\.com$/i.test(hostName)) {
            return URLConstants.derivP2pStaging;
        } else if (/^localhost$/i.test(hostName)) {
            return window.location.origin;
        }
        return URLConstants.derivP2pProduction;
    };

    const origin = getAllowedLocalStorageOrigin();

    return (
        <iframe
            id='localstorage-sync'
            sandbox='allow-same-origin allow-scripts'
            src={`${origin}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
        />
    );
};

export default DerivIframe;
