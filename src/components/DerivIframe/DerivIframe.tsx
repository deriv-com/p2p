const DerivIframe = () => {
    const origin = window.location.origin;
    console.log('iframe', origin);

    return (
        <iframe
            id='localstorage-sync'
            sandbox='allow-same-origin allow-scripts'
            src={`${origin}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            title='localstorage-sync'
        />
    );
};

export default DerivIframe;
