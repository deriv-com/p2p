import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/constants';
import { useSyncedTime } from '@/hooks';
import { epochToLocal, epochToUTC } from '@/utils';
import { Text, TooltipMenuIcon } from '@deriv-com/ui';

const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, DATE_TIME_FORMAT_WITH_GMT);
    const localFormat = epochToLocal(time, DATE_TIME_FORMAT_WITH_OFFSET);

    return (
        <TooltipMenuIcon
            as='div'
            className='app-footer__icon'
            data-testid='dt_server_time'
            disableHover
            tooltipContent={localFormat}
        >
            <Text size='xs'>{UTCFormat}</Text>
        </TooltipMenuIcon>
    );
};

export default ServerTime;
