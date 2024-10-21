import clsx from 'clsx';
import { getLastOnlineLabel } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    className?: string;
    isOnline?: boolean;
    lastOnlineTime?: number;
};

const OnlineStatusLabel = ({ className, isOnline = false, lastOnlineTime }: TOnlineStatusLabelProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    return (
        <Text className={clsx(className)} color='less-prominent' size={isMobile ? 'xs' : 'sm'}>
            {getLastOnlineLabel(isOnline, localize, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
