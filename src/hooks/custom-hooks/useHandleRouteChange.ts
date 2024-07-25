import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle side effects on route change like pushing events to dataLayer.
 */
const useHandleRouteChange = () => {
    const location = useLocation();
    useEffect(() => {
        window?.dataLayer.push({
            event: 'page_load',
        });
    }, [location]);
};

export default useHandleRouteChange;
