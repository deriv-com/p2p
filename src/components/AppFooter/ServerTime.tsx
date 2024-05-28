import { useSyncedTime } from '@/hooks';
import { epochToLocal, epochToUTC } from '@/utils';
import { Text, TooltipMenuIcon } from '@deriv-com/ui';

export const ServerTime = () => {
    const time = useSyncedTime();
    const UTCFormat = epochToUTC(time, 'YYYY-MM-DD HH:mm:ss [GMT]');
    const localFormat = epochToLocal(time, 'YYYY-MM-DD HH:mm:ss Z');

    return (
        <TooltipMenuIcon as='div' className='app-footer__icon' disableHover tooltipContent={localFormat}>
            <Text size='xs'>{UTCFormat}</Text>
        </TooltipMenuIcon>
    );
};
