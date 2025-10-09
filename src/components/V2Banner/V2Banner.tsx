import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './V2Banner.scss';

const V2Banner = () => {
    return (
        <div className='v2-banner'>
            <div>
                <Text as='div' className='v2-banner__title' color='white'>
                    <Localize i18n_default_text='P2P, reimagined' />
                </Text>
                <Text as='div' className='v2-banner__description' color='white'>
                    <Localize i18n_default_text='Simpler design. Stronger protection. New Deriv P2P app coming soon.' />
                </Text>
            </div>
        </div>
    );
};

export default V2Banner;
