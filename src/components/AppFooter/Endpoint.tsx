import { Link } from 'react-router-dom';
import { Text } from '@deriv-com/ui';

const Endpoint = () => {
    const serverURL = localStorage.getItem('config.server_url');

    if (serverURL) {
        return (
            <Text color='red' size='sm'>
                The server{' '}
                <Link className='app-footer__endpoint' to='/endpoint'>
                    endpoint
                </Link>{' '}
                {`is: ${serverURL}`}
            </Text>
        );
    }
    return null;
};

export default Endpoint;
