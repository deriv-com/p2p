import clsx from 'clsx';
import { Dropdown } from '@/components/Dropdown';
import { api } from '@/hooks';
import { getDropdownList, getHoursList } from '@/utils';
import { StandaloneSortDownFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './TimeDropdown.scss';

type TTimeDropdownProps = {
    day: string;
    endTime: string;
    isToday: boolean;
    onSelectTime: (time: string, value: string, startTime: boolean) => void;
    startTime: string;
};

const FULL_DAY = '12:00 am';

const TimeDropdown = ({ day, endTime, isToday, onSelectTime, startTime }: TTimeDropdownProps) => {
    const { isMobile } = useDevice();
    const { data } = api.settings.useSettings();
    const timeList = getHoursList(data?.business_hours_minutes_interval);

    return (
        <div
            className={clsx('time-dropdown', {
                'time-dropdown--bold': isToday,
            })}
        >
            <Dropdown
                chevronIcon={<StandaloneSortDownFillIcon fill='#999999' iconSize='xs' viewBox='0 4 32 32' />}
                list={getDropdownList(timeList, 'start', endTime, endTime !== FULL_DAY)}
                listHeight='sm'
                name='start_time_dropdown'
                onSelect={time => onSelectTime(time as string, day, true)}
                value={startTime}
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
                    value={endTime}
                    variant='comboBox'
                />
            </div>
        </div>
    );
};

export default TimeDropdown;
