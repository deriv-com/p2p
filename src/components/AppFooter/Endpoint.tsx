import { Link } from 'react-router-dom';
import { ENDPOINT } from '@/constants';
import { Text } from '@deriv-com/ui';

const Endpoint = () => {
    const serverURL = localStorage.getItem('config.server_url');

    if (serverURL) {
        return (
            <Text className='app-footer__endpoint' color='red' size='sm'>
                The server{' '}
                <Link className='app-footer__endpoint-text' to={ENDPOINT}>
                    endpoint
                </Link>{' '}
                {`is: ${serverURL}`}
            </Text>
        );
    }
    return null;
};

export default Endpoint;
