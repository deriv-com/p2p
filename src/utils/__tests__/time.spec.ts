import moment from 'moment';
import {
    convertToMillis,
    daysSince,
    epochToLocal,
    epochToMoment,
    epochToUTC,
    formatMilliseconds,
    formatTime,
    getDateAfterHours,
    getDistanceToServerTime,
    getFormattedDateString,
    millisecondsToTimer,
    toMoment,
} from '../time';

const mockEpochSeconds = Date.UTC(2023, 1, 11) / 1000; // Feb 11, 2023 in seconds
const mockEpochMilliseconds = mockEpochSeconds * 1000; // Feb 11, 2023 in milliseconds
const mockFn = jest.fn(text => text);

describe('time', () => {
    describe('convertToMillis', () => {
        it('should convert epoch time to milliseconds', () => {
            const seconds = mockEpochSeconds;
            const result = convertToMillis(seconds);
            expect(result).toBe(1676073600000);
        });
    });

    describe('daysSince', () => {
        it('should return 0 if date is an empty string', () => {
            const result = daysSince('');
            expect(result).toBe(0);
        });

        it('should return the number of days since the date specified', () => {
            const date = '2021-01-01';
            const result = daysSince(date);
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('epochToLocal', () => {
        it('should convert epoch to local time', () => {
            const epoch = mockEpochSeconds;
            const result = epochToLocal(epoch, 'YYYY-MM-DD HH:mm:ss');
            const datePart = result.substring(0, 10); // Extracts the date part 'YYYY-MM-DD'
            expect(datePart).toBe('2023-02-11');
            expect(moment(result, 'YYYY-MM-DD HH:mm:ss', true).isValid()).toBe(true);
        });
    });

    describe('epochToMoment', () => {
        it('should convert epoch to moment', () => {
            const epoch = mockEpochSeconds;
            const result = epochToMoment(epoch);
            expect(result).toBeInstanceOf(moment);
        });
    });

    describe('epochToUTC', () => {
        it('should convert epoch to UTC time', () => {
            const epoch = mockEpochSeconds;
            const result = epochToUTC(epoch, 'YYYY-MM-DD HH:mm:ss');
            expect(result).toBe('2023-02-11 00:00:00');
        });
    });

    describe('formatMilliseconds', () => {
        it('should return formatted date string in UTC time', () => {
            const milliseconds = mockEpochMilliseconds;
            const result = formatMilliseconds(milliseconds, 'YYYY-MM-DD HH:mm');
            expect(result).toBe('2023-02-11 00:00');
        });

        it('should return formatted date string in local time', () => {
            const milliseconds = mockEpochMilliseconds;
            const result = formatMilliseconds(milliseconds, 'YYYY-MM-DD HH:mm', true);
            const datePart = result.substring(0, 10); // Extracts the date part 'YYYY-MM-DD'
            expect(datePart).toBe('2023-02-11');
            expect(moment(result, 'YYYY-MM-DD HH:mm', true).isValid()).toBe(true);
        });
    });

    describe('formatTime', () => {
        it('should return empty string if minutes is 0', () => {
            const result = formatTime(0, mockFn);
            expect(result).toBe('');
        });

        it('should return remaining minute text if hours is 0 and remaining minutes is 1', () => {
            const minutes = 60;
            const result = formatTime(minutes, mockFn);
            expect(result).toBe('1 minute');
        });

        it('should return remaining minutes and minutes text if hours is 0', () => {
            const minutes = 30 * 60;
            const result = formatTime(minutes, mockFn);
            expect(result).toBe('30 minutes');
        });

        it('should return hours and hours text if remaining minutes is 0', () => {
            const minutes = 120 * 60;
            const result = formatTime(minutes, mockFn);
            expect(result).toBe('2 hours');
        });

        it('should return hours, hours text, remaining minutes, and minutes text', () => {
            const minutes = 90 * 60;
            const result = formatTime(minutes, mockFn);
            expect(result).toBe('1 hour 30 minutes');
        });
    });

    describe('getDateAfterHours', () => {
        it('should return the correct date after adding hours', () => {
            const hours = 1;
            const result = getDateAfterHours(mockEpochSeconds, hours);
            expect(result).toBe('11 Feb 2023, 01:00');
        });
    });

    describe('getDistanceToServerTime', () => {
        it('should return the correct distance in milliseconds', () => {
            const compareTime = mockEpochMilliseconds;
            const serverTime = moment('2024-02-11T16:30:00Z');

            const result = getDistanceToServerTime(compareTime, serverTime);

            expect(result).toBe(-31595400000);
        });
    });

    describe('getFormattedDateString', () => {
        it('should return formatted date string in UTC time without seconds', () => {
            const date = new Date('2021-01-01T21:01:11Z');
            const result = getFormattedDateString(date);
            expect(result).toBe('01 Jan 2021, 21:01');
        });

        it('should return only date if onlyDate is true', () => {
            const date = new Date('2021-01-01T21:01:11Z');
            const result = getFormattedDateString(date, false, false, true);
            expect(result).toBe('Jan 01 2021');
        });

        it('should return formatted date string in local time with seconds', () => {
            const date = new Date('2021-01-01T00:00:00Z');
            const result = getFormattedDateString(date, true, true);
            const datePart = result.substring(0, 11); // Extracts the date part 'MMM DD YYYY'
            expect(datePart).toBe('Jan 01 2021');
            expect(moment(result, 'MMM DD YYYY, HH:mm:ss', true).isValid()).toBe(true);
        });
    });

    describe('millisecondsToTimer', () => {
        it('should return formatted time string in hours, minutes, and seconds', () => {
            const milliseconds = 3600000;
            const result = millisecondsToTimer(milliseconds);
            expect(result).toBe('01:00:00');
        });
    });

    describe('toMoment', () => {
        it('should return current time if value is undefined', () => {
            const result = toMoment();
            expect(result).toBeInstanceOf(moment);
        });

        it('should return current time if value is invalid', () => {
            const value = 'invalid';
            const result = toMoment(value);
            expect(result).toBeInstanceOf(moment);
        });

        it('should return passed in value if it is already a valid UTC moment object', () => {
            const value = moment.utc();
            const result = toMoment(value);
            expect(result).toBe(value);
        });

        it('should return moment object if value is already a moment object', () => {
            const value = moment();
            const result = toMoment(value);
            expect(result).toBeInstanceOf(moment);
        });

        it('should return epochToMoment if value is a number', () => {
            const value = mockEpochMilliseconds;
            const result = toMoment(value);
            expect(result).toBeInstanceOf(moment);
        });

        it('should return target date if value is a string', () => {
            const value = '01 Jan 2021';
            const result = toMoment(value);
            expect(result).toBeInstanceOf(moment);
        });
    });
});
