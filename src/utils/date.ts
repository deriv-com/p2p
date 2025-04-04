import moment from 'moment';
import { toMoment } from './time';

/**
 * The below function returns the weekday in the short form.
 * @param date
 * @returns
 */
export const customFormatShortWeekday = (_locale: string | undefined, date: Date) => {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return weekdays[date.getDay()];
};

/**
 * The below function converts the unix date to a string in the given format.
 * @param date
 * @param format
 * @returns
 */
export const unixToDateString = (date: Date, format = 'YYYY-MM-DD') => {
    const formattedDate = moment(date).format(format);

    return formattedDate;
};

/**
 * add the specified number of months to the given date
 * @param {String} date        date
 * @param {Number} numOfMonths number of months to add
 */
export const addMonths = (date: moment.MomentInput, numOfMonths: number) =>
    toMoment(date).clone().add(numOfMonths, 'month');

/**
 * return the number of months between two specified dates
 */
export const diffInMonths = (now: moment.MomentInput, then: moment.Moment) => then.diff(now, 'month');

/**
 * subtract the specified number of months from the given date
 * @param {String} date        date
 * @param {Number} numOfMonths number of months to subtract
 */
export const subMonths = (date: moment.MomentInput, numOfMonths: number) =>
    toMoment(date).clone().subtract(numOfMonths, 'month');

/**
 * returns a new date
 * @param {moment|string|epoch} date date
 */
export const getStartOfMonth = (date: moment.MomentInput) =>
    toMoment(date).clone().startOf('month').format('YYYY-MM-DD');

/**
 * add the specified number of days to the given date
 * @param {String} date        date
 * @param {Number} numOfDays number of days to add
 */
export const addDays = (date: moment.Moment | string, numOfDays: number) =>
    toMoment(date).clone().add(numOfDays, 'day');

/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
export const daysFromTodayTo = (date?: moment.Moment | string) => {
    const diff = toMoment(date).startOf('day').diff(toMoment().startOf('day'), 'days');
    return !date || diff < 0 ? '' : diff;
};

/**
 * subtract the specified number of days from the given date
 * @param {String} date        date
 * @param {Number} numOfDays number of days to subtract
 */
export const subDays = (date: moment.MomentInput, numOfDays: number) =>
    toMoment(date).clone().subtract(numOfDays, 'day');

/**
 * add the specified number of years to the given date
 * @param {String} date        date
 * @param {Number} numOfYears number of years to add
 */
export const addYears = (date: moment.MomentInput, numOfYears: number) =>
    toMoment(date).clone().add(numOfYears, 'year');

/**
 * subtract the specified number of years from the given date
 * @param {String} date        date
 * @param {Number} numOfYears number of years to subtract
 */
export const subYears = (date: moment.MomentInput, numOfYears: number) =>
    toMoment(date).clone().subtract(numOfYears, 'year');
