import { api } from '@/hooks';
import { convertToMillis, getFormattedDateString } from '@/utils';
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
            You’ve been temporarily barred from using our services due to multiple cancellation attempts. Try again
            after {getFormattedDateString(new Date(convertToMillis(data.blocked_until)))} GMT.
        </InlineMessage>
    );
};

export default TemporarilyBarredHint;
