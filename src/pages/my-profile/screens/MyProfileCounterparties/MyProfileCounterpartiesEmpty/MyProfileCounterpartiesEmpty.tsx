import { DerivLightIcEmptyBlockedAdvertisersIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './MyProfileCounterpartiesEmpty.scss';

const MyProfileCounterpartiesEmpty = () => (
    <div className='my-profile-counterparties-empty'>
        <DerivLightIcEmptyBlockedAdvertisersIcon height='12.8rem' width='12.8rem' />
        <Text weight='bold'>
            <Localize i18n_default_text='No one to show here ' />
        </Text>
    </div>
);
export default MyProfileCounterpartiesEmpty;
