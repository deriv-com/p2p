import clsx from 'clsx';

type TOnlineStatusIconProps = {
    isOnline: boolean;
    isRelative?: boolean;
    size?: number | string;
};

const OnlineStatusIcon = ({ isOnline, isRelative = false, size = '1em' }: TOnlineStatusIconProps) => {
    return (
        <div
            className={clsx('online-status__icon', {
                'online-status__icon--offline': !isOnline,
                'online-status__icon--online': !!isOnline,
                relative: isRelative,
            })}
            data-testid='dt_online_status_icon'
            style={{
                height: size,
                width: size,
            }}
        />
    );
};

export default OnlineStatusIcon;
