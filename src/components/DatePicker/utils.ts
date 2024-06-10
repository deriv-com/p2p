import moment from 'moment';

export function customFormatShortWeekday(_locale: string | undefined, date: Date) {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return weekdays[date.getDay()];
}

export function unixToDateString(date: Date, format = 'YYYY-MM-DD') {
    const formattedDate = moment(date).format(format);

    return formattedDate;
}
