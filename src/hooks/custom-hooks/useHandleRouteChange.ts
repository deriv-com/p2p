import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useHandleRouteChange = () => {
    const location = useLocation();
    useEffect(() => {
        window?.dataLayer.push({
            event: 'page_load',
        });
    }, [location]);
};

export default useHandleRouteChange;
