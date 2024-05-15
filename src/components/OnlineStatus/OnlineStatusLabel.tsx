import { getLastOnlineLabel } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    isOnline?: boolean;
    lastOnlineTime?: number;
};

const OnlineStatusLabel = ({ isOnline = false, lastOnlineTime }: TOnlineStatusLabelProps) => {
    const { localize } = useTranslations();
    return (
        <Text color='less-prominent' size='sm'>
            {getLastOnlineLabel(isOnline, localize, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
