import { useMemo } from 'react';
import { formatTime, getDaysOfWeek, splitTimeRange, TRange } from '@/utils/business-hours';
import { Localize, useTranslations } from '@deriv-com/translations';
import { api } from '..';

type TTimeRange = {
    end_min: number | null;
    start_min: number | null;
};

const useGetBusinessHours = () => {
    const { localize } = useTranslations();
    const { data } = api.advertiser.useGetInfo();
    const { is_schedule_available: _isScheduleAvailable, schedule = [] } = data;
    const isScheduleAvailable = !!(_isScheduleAvailable === undefined || _isScheduleAvailable);

    const formattedBusinessDays = useMemo(() => {
        const daysOfWeek = getDaysOfWeek(localize);

        const getTimezoneOffset = () => {
            const offset = new Date().getTimezoneOffset();
            return offset;
        };

        const businessHours = splitTimeRange(schedule as TRange[], getTimezoneOffset());

        return businessHours.map((interval, index) => {
            const dayIndex = index % 7;
            const dayInfo = daysOfWeek[dayIndex];
            const { end_min: endMin, start_min: startMin } = interval as TTimeRange;

            let timeLabel: JSX.Element;
            let startTime: string | null = null;
            let endTime: string | null = null;

            if (startMin !== null && endMin !== null) {
                startTime = formatTime(startMin);
                endTime = formatTime(endMin);
                if (endMin - startMin === 1440) {
                    timeLabel = <Localize i18n_default_text='Open 24 hours' />;
                } else {
                    timeLabel = (
                        <span>
                            {startTime} - {endTime}
                        </span>
                    );
                }
            } else {
                timeLabel = <Localize i18n_default_text='Closed' />;
            }

            return {
                day: dayInfo.label,
                end_time: endTime,
                short_day: dayInfo.shortLabel,
                start_time: startTime,
                time: timeLabel,
                value: dayInfo.value,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedule]);

    return {
        businessHours: formattedBusinessDays,
        isScheduleAvailable,
    };
};

export default useGetBusinessHours;
