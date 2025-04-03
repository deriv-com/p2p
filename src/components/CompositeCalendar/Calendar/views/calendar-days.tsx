import React from 'react';
import clsx from 'clsx';
import { addDays, addMonths, daysFromTodayTo, epochToMoment, padLeft, subDays, subMonths, toMoment } from '@/utils';
import { Text, Tooltip } from '@deriv-com/ui';
import { getDaysOfTheWeek, weekHeadersAbbr } from '../helpers';
import { CommonPropTypes } from './types';

type TDaysProps = CommonPropTypes & {
    dateFormat: string;
    disabledDays?: number[];
    events?: {
        dates: string[];
        descrip: string;
    }[];
    hasRangeSelection?: boolean;
    hideOthers?: boolean;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement>;
    shouldShowToday?: boolean;
    startDate?: string;
};

const getDays = ({
    calendarDate,
    dateFormat,
    disabledDays = [],
    events = [],
    hasRangeSelection,
    hideOthers,
    isPeriodDisabled,
    onMouseLeave,
    onMouseOver,
    selectedDate,
    shouldShowToday = true,
    startDate,
    updateSelected,
}: TDaysProps) => {
    // adjust Calendar week by 1 day so that Calendar week starts on Monday
    // change to zero to set Calendar week to start on Sunday
    const dayOffset = 1;

    const dates = [];
    const days: JSX.Element[] = [];
    const momentToday = toMoment().startOf('day');
    const momentCurDate = toMoment(calendarDate);
    const numOfDays = momentCurDate.daysInMonth() + 1;
    const momentMonthStart = momentCurDate.clone().startOf('month');
    const momentMonthEnd = momentCurDate.clone().endOf('month');
    const momentSelected =
        typeof selectedDate === 'number'
            ? epochToMoment(selectedDate).startOf('day')
            : toMoment(selectedDate).startOf('day');

    // populate previous months' dates
    const endOfPrevMonth = subMonths(momentCurDate, 1).endOf('month').day();
    for (let i = endOfPrevMonth; i > 0; i--) {
        dates.push(subDays(momentMonthStart, i).format(dateFormat));
    }
    // populate current months' dates
    for (let idx = 1; idx < numOfDays; idx += 1) {
        dates.push(momentCurDate.clone().format(dateFormat.replace('DD', padLeft(idx.toString(), 2, '0'))));
    }
    // populate next months' dates
    const startOfNextMonth = addMonths(momentCurDate, 1).startOf('month').day();
    if (startOfNextMonth - dayOffset > 0 || dates.length <= 28) {
        // if startOfNextMonth doesn't falls on Monday, append rest of the week
        for (let i = 1; i <= 7 - startOfNextMonth + dayOffset; i++) {
            dates.push(addDays(momentMonthEnd, i).format(dateFormat));
        }
    } else if (!startOfNextMonth) {
        // if startOfNextMonth falls on Sunday, append 1 day
        dates.push(addDays(momentMonthEnd, 1).format(dateFormat));
    }

    const momentStartDate = toMoment(startDate).startOf('day');

    dates.forEach(date => {
        const momentDate = toMoment(date).startOf('day');
        const isActive = selectedDate && momentDate.isSame(momentSelected);
        const isToday = momentDate.isSame(momentToday, 'day');

        const calendarEvents = events.filter(event =>
            // filter by date or day of the week
            event.dates.find(d => getDaysOfTheWeek(d) === toMoment(date).day())
        );
        const hasEvents = !!calendarEvents.length;
        const isClosesEarly = calendarEvents.map(event => !!event.descrip.match(/Closes early|Opens late/))[0];
        const message = calendarEvents.map(event => event.descrip)[0] || '';
        const durationFromToday = daysFromTodayTo(date);
        const isBetween = momentDate.isBetween(momentToday, momentSelected);
        const isBeforeMinOrAfterMaxDate = isPeriodDisabled(momentDate, 'day');
        const isDisabled =
            // check if date is before min_date or after_max_date
            isBeforeMinOrAfterMaxDate ||
            // for forward starting accounts, only show same day as start date and the day after
            (startDate && momentDate.isBefore(momentStartDate)) ||
            // check if weekends are disabled
            disabledDays.some(day => toMoment(date).day() === day) ||
            // check if date falls on holidays, and doesn't close early or opens late
            (hasEvents && !isClosesEarly);

        // show 'disabled' style for dates that is not in the same calendar month, it should still be clickable
        const isOtherMonth = momentDate.month() !== momentCurDate.month();

        days.push(
            <span
                className={clsx('dc-calendar__cell', {
                    'dc-calendar__cell--active': isActive,
                    'dc-calendar__cell--active-duration': isActive && hasRangeSelection && !isToday,
                    'dc-calendar__cell--between': isBetween && hasRangeSelection,
                    'dc-calendar__cell--disabled': isDisabled,
                    'dc-calendar__cell--is-hidden': isOtherMonth && hideOthers,
                    'dc-calendar__cell--other': isOtherMonth,
                    'dc-calendar__cell--today': shouldShowToday && isToday,
                    'dc-calendar__cell--today-duration': isToday && hasRangeSelection,
                })}
                data-date={date}
                data-duration={`${durationFromToday} ${durationFromToday === 1 ? 'Day' : 'Days'}`}
                key={date}
                onClick={isDisabled ? undefined : e => updateSelected(e, 'day')}
                onMouseLeave={onMouseLeave}
                onMouseOver={onMouseOver}
            >
                {(hasEvents || isClosesEarly) && !isOtherMonth && !isBeforeMinOrAfterMaxDate && (
                    <Tooltip as='button' tooltipContent={message}>
                        <Text>{message}</Text>
                    </Tooltip>
                )}
                {momentDate.date()}
            </span>
        );
    });

    return days;
};

const Days = (props: TDaysProps) => {
    const days = getDays(props).map(day => day);

    return (
        <div className='dc-calendar__body dc-calendar__body--date'>
            {Object.keys(weekHeadersAbbr).map((item, idx) => (
                <Text align='center' key={idx} size='2xs' weight='bold'>
                    {weekHeadersAbbr[item]}
                </Text>
            ))}
            {days}
        </div>
    );
};

export default Days;
