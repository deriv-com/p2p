const DerivIframe = () => {
    const origin = window.location.origin;

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
