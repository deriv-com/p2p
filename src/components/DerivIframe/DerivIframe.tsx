import { URLConstants } from '@deriv-com/utils';

const DerivIframe = () => {
    const origin = URLConstants.derivP2pProduction;
    return (
        <iframe
            id='localstorage-sync'
            sandbox='allow-same-origin allow-scripts'
            src={`${origin}/public/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
        />
    );
};

export default DerivIframe;
