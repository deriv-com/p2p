import { memo } from 'react';
import clsx from 'clsx';
import { useIsRtl } from '@/hooks';
import { getShortNickname, TGenericSizes } from '@/utils';
import { Text } from '@deriv-com/ui';
import { OnlineStatusIcon } from '../OnlineStatus';
import './UserAvatar.scss';

type TUserAvatarProps = {
    className?: string;
    isOnline?: boolean;
    nickname: string;
    showOnlineStatus?: boolean;
    size?: number;
    textSize?: TGenericSizes;
};

const UserAvatar = memo(
    ({
        className,
        isOnline = false,
        nickname,
        showOnlineStatus = false,
        size = 32,
        textSize = 'md',
    }: TUserAvatarProps) => {
        const isRtl = useIsRtl();
        return (
            <div className={clsx('user-avatar', className)} data-testid='dt_user_avatar'>
                <Text align='center' className='user-avatar__short-nickname' color='white' size={textSize}>
                    {getShortNickname(nickname)}
                </Text>
                {showOnlineStatus && <OnlineStatusIcon isOnline={isOnline} size='26%' />}
                <svg height={size} viewBox={`0 0 ${size * 2} ${size * 2}`} width={size}>
                    <mask id='circle'>
                        <circle cx={size} cy={size} fill='white' r={size} />
                        {showOnlineStatus && (
                            <circle cx={isRtl ? '13%' : '87%'} cy='86%' fill='black' r={size * 0.37} />
                        )}
                    </mask>
                    <rect
                        fill='#FF444F'
                        mask='url(#circle)'
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </svg>
            </div>
        );
    }
);

UserAvatar.displayName = 'UserAvatar';
export default UserAvatar;
