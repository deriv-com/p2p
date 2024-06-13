import moment from 'moment';

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
