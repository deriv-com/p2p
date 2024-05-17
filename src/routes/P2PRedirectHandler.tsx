import { Redirect, useLocation } from 'react-router-dom';
import { ORDERS_URL } from '@/constants';

// In the future if we have other URLs that use /redirect/p2p, we can add a switch statement here to handle different cases
const P2PRedirectHandler = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order_id');

    // Remove order_id from the search parameters
    params.delete('order_id');

    // Redirect to the Orders route with the order_id in the pathname and keep all the other search parameters
    return <Redirect to={{ pathname: `${ORDERS_URL}/${orderId}`, search: params.toString() }} />;
};

export default P2PRedirectHandler;
