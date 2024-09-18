import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/constants';
import { useSyncedTime } from '@/hooks';
import { epochToLocal, epochToUTC } from '@/utils';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';

const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, DATE_TIME_FORMAT_WITH_GMT);
    const localFormat = epochToLocal(time, DATE_TIME_FORMAT_WITH_OFFSET);
    const { isDesktop } = useDevice();

    return (
        <Tooltip as='div' className='app-footer__icon' data-testid='dt_server_time' tooltipContent={localFormat}>
            <Text size={isDesktop ? 'xs' : 'sm'}>{UTCFormat}</Text>
        </Tooltip>
    );
};

export default ServerTime;
