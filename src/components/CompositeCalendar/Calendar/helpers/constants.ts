/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/sort-type-constituents */
import moment from 'moment';
import { toMoment } from '@/utils';

export const weekHeaders: Record<
    string,
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
> = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
};

export const weekHeadersAbbr: Record<string, 'M' | 'T' | 'W' | 'T' | 'F' | 'S'> = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'T',
    Friday: 'F',
    Saturday: 'S',
    Sunday: 'S',
};

export const getDaysOfTheWeek = (day: string) => {
    const daysOfTheWeek: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
        Mondays: 1,
        Tuesdays: 2,
        Wednesdays: 3,
        Thursdays: 4,
        Fridays: 5,
        Saturdays: 6,
        Sundays: 0,
    };

    return daysOfTheWeek[day];
};

export const getDecade = (momentDate: moment.MomentInput) => {
    const year = toMoment(momentDate).year();
    const decadeStartYear = year - (year % 10) + 1;
    return `${decadeStartYear}-${decadeStartYear + 9}`;
};

export const getCentury = (momentDate: moment.MomentInput) => {
    const year = toMoment(momentDate).year();
    const decadeStartYear = year - (year % 10) + 1;
    return `${decadeStartYear}-${decadeStartYear + 99}`;
};

export const getDate = (
    date: moment.Moment,
    dateFormat: string,
    selectedDatePart: number,
    type: moment.unitOfTime.StartOf
) => {
    switch (type) {
        case 'year':
        case 'y':
        case 'years':
            return date.year(selectedDatePart).format(dateFormat);
        case 'month':
        case 'months':
        case 'M':
            return date.month(selectedDatePart).format(dateFormat);
        case 'week':
        case 'w':
            return date.week(selectedDatePart).format(dateFormat);
        case 'weeks':
            return date.weeks(selectedDatePart).format(dateFormat);
        case 'day':
        case 'd':
            return date.day(selectedDatePart).format(dateFormat);
        case 'days':
            return date.days(selectedDatePart).format(dateFormat);
        case 'hour':
        case 'h':
            return date.hour(selectedDatePart).format(dateFormat);
        case 'hours':
            return date.hours(selectedDatePart).format(dateFormat);
        case 'minute':
        case 'm':
            return date.minute(selectedDatePart).format(dateFormat);
        case 'minutes':
            return date.minutes(selectedDatePart).format(dateFormat);
        case 'second':
        case 's':
            return date.second(selectedDatePart).format(dateFormat);
        case 'seconds':
            return date.seconds(selectedDatePart).format(dateFormat);
        case 'millisecond':
        case 'ms':
            return date.millisecond(selectedDatePart).format(dateFormat);
        case 'milliseconds':
            return date.milliseconds(selectedDatePart).format(dateFormat);
        case 'quarter':
        case 'Q':
            return date.quarter(selectedDatePart).format(dateFormat);
        case 'quarters':
            return date.quarters(selectedDatePart).format(dateFormat);
        case 'isoWeek':
        case 'W':
            return date.isoWeek(selectedDatePart).format(dateFormat);
        case 'isoWeeks':
            return date.isoWeeks(selectedDatePart).format(dateFormat);
        case 'date':
        case 'dates':
        case 'D':
            return date.date(selectedDatePart).format(dateFormat);
        default:
            return date.day(selectedDatePart).format(dateFormat);
    }
};
