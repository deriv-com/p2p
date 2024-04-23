import { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import './Badge.scss';

type TBadgeProps = {
    label?: string;
    status?: string;
    tradeCount?: number | undefined;
    variant?: 'general' | 'success' | 'warning';
};

const Badge = ({ label, status, tradeCount, variant }: TBadgeProps) => {
    const textColor = variant === 'general' ? 'less-prominent' : 'white';

    if (tradeCount) {
        return (
            <div
                className={clsx('badge', {
                    'badge--gold': tradeCount >= 100 && tradeCount < 250,
                    'badge--green': tradeCount >= 250,
                })}
            >
                <Text className='badge__label' color='white' weight='bold'>
                    {`${tradeCount >= 250 ? '250+' : '100+'}`}
                </Text>
            </div>
        );
    }
    return (
        <div
            className={clsx('badge', {
                'badge--general': variant === 'general',
                'badge--success': variant === 'success',
                'badge--warning': variant === 'warning',
            })}
        >
            <Text className='badge__label' color={textColor} weight='bold'>
                {label}
            </Text>
            <Text className='badge__status' color={textColor}>
                {status}
            </Text>
        </div>
    );
};

export default memo(Badge);
