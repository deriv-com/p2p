import { useEffect, useState } from 'react';
import { useTime } from '@deriv-com/api-hooks';

const useSyncedTime = () => {
    const currentDate = Date.now() / 1000;
    const [serverTime, setServerTime] = useState(currentDate);
    const { data } = useTime({ refetchInterval: 30000 });

    useEffect(() => {
        let timeInterval: ReturnType<typeof setInterval>;

        if (data) {
            setServerTime(data ?? currentDate);

            timeInterval = setInterval(() => {
                setServerTime(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timeInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return serverTime;
};

export default useSyncedTime;
