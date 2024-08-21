import { getLastOnlineLabel } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    isOnline?: boolean;
    lastOnlineTime?: number;
};

const OnlineStatusLabel = ({ isOnline = false, lastOnlineTime }: TOnlineStatusLabelProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    return (
        <Text className='pr-4 lg:pr-0' color='less-prominent' size={isMobile ? 'xs' : 'sm'}>
            {getLastOnlineLabel(isOnline, localize, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
