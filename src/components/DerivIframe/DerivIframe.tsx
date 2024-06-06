const DerivIframe = () => (
    <iframe
        id='localstorage-sync'
        sandbox='allow-scripts'
        src='../../../../localstorage-sync.html'
        style={{ display: 'none', visibility: 'hidden' }}
    />
);

export default DerivIframe;
