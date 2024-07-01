import { ComponentProps, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Calendar, { CalendarProps } from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import { customFormatShortWeekday, unixToDateString } from '@/utils';
import DateTextField from '../DateTextField/DateTextField';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.scss';

interface TDatePickerProps extends ComponentProps<typeof DateTextField> {
    alignedRight?: boolean;
    displayFormat?: string;
    maxDate?: Date;
    minDate?: Date;
    mobileAlignment?: 'above' | 'below';
    onDateChange: (date: string) => void;
    rightAlignment?: boolean;
    showLabel?: boolean;
    value?: string;
}

const DatePicker = ({
    alignedRight,
    disabled,
    displayFormat = 'MMM DD, YYYY',
    label,
    maxDate,
    minDate,
    name,
    onDateChange,
    rightAlignment = false,
    showLabel = false,
    value,
}: TDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    useOnClickOutside(datePickerRef, () => {
        setIsCalendarOpen(false);
    });

    const handleDateChange: CalendarProps['onChange'] = value => {
        const calendarSelectedDate = Array.isArray(value) ? value[0] : value;
        setSelectedDate(calendarSelectedDate);
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        if (selectedDate !== null) {
            onDateChange(unixToDateString(selectedDate, displayFormat));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    // To not display the date value when today's date is selected.
    const getValue = () => {
        if (selectedDate && (showLabel || selectedDate.toDateString() !== new Date().toDateString())) {
            return unixToDateString(selectedDate, displayFormat);
        }
        return '';
    };

    return (
        <div className='datepicker' ref={datePickerRef}>
            <DateTextField
                alignedRight={alignedRight}
                disabled={disabled}
                inputMode='none'
                label={label}
                name={name}
                onClick={toggleCalendar}
                onKeyDown={e => e.preventDefault()}
                type='text'
                value={getValue()}
            />
            {isCalendarOpen && (
                <div
                    className={clsx(`datepicker__container`, {
                        'datepicker__container--right': rightAlignment,
                    })}
                    data-testid='dt_datepicker_container'
                >
                    <Calendar
                        formatShortWeekday={customFormatShortWeekday}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={handleDateChange}
                        value={selectedDate !== null ? selectedDate : ''}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
