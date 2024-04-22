import { Text } from '@deriv-com/ui';

import { getLastOnlineLabel } from '@/utils';

type TOnlineStatusLabelProps = {
    isOnline?: boolean;
    lastOnlineTime?: number;
};

const OnlineStatusLabel = ({ isOnline = false, lastOnlineTime }: TOnlineStatusLabelProps) => {
    return (
        <Text color='less-prominent' size='sm'>
            {getLastOnlineLabel(isOnline, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
