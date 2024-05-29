import { DATE_TIME_FORMAT_WITH_GMT, DATE_TIME_FORMAT_WITH_OFFSET } from '@/constants';
import { useSyncedTime } from '@/hooks';
import { epochToLocal, epochToUTC } from '@/utils';
import { Text, TooltipMenuIcon } from '@deriv-com/ui';

export const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, DATE_TIME_FORMAT_WITH_GMT);
    const localFormat = epochToLocal(time, DATE_TIME_FORMAT_WITH_OFFSET);

    return (
        <TooltipMenuIcon as='div' className='app-footer__icon' disableHover tooltipContent={localFormat}>
            <Text size='xs'>{UTCFormat}</Text>
        </TooltipMenuIcon>
    );
};
