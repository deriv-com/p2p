const DerivIframe = () => (
    <iframe
        id='localstorage-sync'
        sandbox='allow-same-origin allow-scripts'
        src='../../../../localstorage-sync.html'
        style={{ display: 'none', visibility: 'hidden' }}
    />
);

export default DerivIframe;
