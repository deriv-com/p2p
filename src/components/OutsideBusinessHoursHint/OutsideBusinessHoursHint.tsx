import { getCurrentRoute } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { InlineMessage } from '@deriv-com/ui';

const OutsideBusinessHoursHint = () => {
    const isMyAds = getCurrentRoute() === 'my-ads';

    return (
        <InlineMessage className='w-fit lg:mt-8 lg:mx-0 mt-6 mx-6' variant='warning'>
            {isMyAds ? (
                <Localize i18n_default_text="This ad isn't listed on Buy/Sell because your business hours haven't started." />
            ) : (
                <Localize i18n_default_text='Orders are only available during business hours.' />
            )}
        </InlineMessage>
    );
};

export default OutsideBusinessHoursHint;
