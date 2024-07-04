import { useEffect } from 'react';
import { useCountdown } from 'usehooks-ts';
import { millisecondsToTimer } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './OrderTimer.scss';

type TOrderTimer = {
    distance: number;
};
const OrderTimer = ({ distance }: TOrderTimer) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const [timeLeft, { startCountdown }] = useCountdown({
        countStart: distance / 1000,
        intervalMs: 1000,
    });

    useEffect(() => {
        if (distance > 0) {
            startCountdown();
        }
    }, [distance, startCountdown]);

    return (
        <Text className='order-timer' size={isDesktop ? 'xs' : 'sm'}>
            {timeLeft > 0 ? millisecondsToTimer(timeLeft * 1000) : localize('expired')}
        </Text>
    );
};

export default OrderTimer;
