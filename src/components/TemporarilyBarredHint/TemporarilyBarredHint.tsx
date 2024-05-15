import { api } from '@/hooks';
import { convertToMillis, getFormattedDateString } from '@/utils';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, useDevice } from '@deriv-com/ui';

const TemporarilyBarredHint = () => {
    const { data } = api.advertiser.useGetInfo();
    const { isMobile } = useDevice();

    if (!data.blocked_until) return null;

    return (
        <InlineMessage
            className='w-fit lg:mt-8 lg:mx-0 mt-6 mx-6'
            iconPosition={isMobile ? 'top' : 'center'}
            variant='warning'
        >
            <Localize
                i18n_default_text='You’ve been temporarily barred from using our services due to multiple cancellation attempts. Try again after {{blocked_until}} GMT.'
                values={{ blocked_until: getFormattedDateString(new Date(convertToMillis(data.blocked_until))) }}
            />
        </InlineMessage>
    );
};

export default TemporarilyBarredHint;
