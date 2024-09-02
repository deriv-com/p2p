import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Dropdown } from '@/components/Dropdown';
import { api } from '@/hooks';
import { getDropdownList, getHoursList } from '@/utils/business-hours';
import { StandaloneSortDownFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './TimeDropdown.scss';

type TTimeDropdownProps = {
    day: string;
    endTime: string;
    index: number;
    onSelectTime: (time: string, value: string, startTime: boolean) => void;
    startTime: string;
    today: number;
};

const FULL_DAY = '12:00 am';

const TimeDropdown = ({ day, endTime, index, onSelectTime, startTime, today }: TTimeDropdownProps) => {
    const [selectedTimes, setSelectedTimes] = useState({ endTime, startTime });
    const { isMobile } = useDevice();
    const { data } = api.settings.useSettings();
    const timeList = getHoursList(data?.business_hours_minutes_interval);

    useEffect(() => {
        const { endTime, startTime } = selectedTimes;

        if (startTime > endTime) {
            const newTimeIndex = timeList.findIndex(time => time.value === startTime) + 4;
            const newTime = timeList[newTimeIndex]?.value;
            onSelectTime(newTime, day, false);
            setSelectedTimes({ ...selectedTimes, endTime: newTime });
        }
    }, [day, onSelectTime, selectedTimes, selectedTimes.endTime, timeList]);

    return (
        <div
            className={clsx('time-dropdown', {
                'time-dropdown--bold': index === today,
            })}
        >
            <Dropdown
                chevronIcon={<StandaloneSortDownFillIcon fill='#999999' iconSize='xs' viewBox='0 4 32 32' />}
                list={getDropdownList(timeList, 'start', endTime, endTime !== FULL_DAY)}
                listHeight='sm'
                name='start_time_dropdown'
                onSelect={time => onSelectTime(time as string, day, true)}
                value={selectedTimes.startTime}
                variant='comboBox'
            />
            <Text size={isMobile ? 'sm' : 'xs'}>
                <Localize i18n_default_text='to' />
            </Text>
            <div className='time-dropdown__end-time'>
                <Dropdown
                    chevronIcon={<StandaloneSortDownFillIcon fill='#999999' iconSize='xs' viewBox='0 4 32 32' />}
                    list={getDropdownList(timeList, 'end', startTime, startTime !== FULL_DAY)}
                    listHeight='sm'
                    name='end_time_dropdown'
                    onSelect={time => onSelectTime(time as string, day, false)}
                    value={selectedTimes.endTime}
                    variant='comboBox'
                />
            </div>
        </div>
    );
};

export default TimeDropdown;
