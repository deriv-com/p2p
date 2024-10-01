import {
    convertToGMTWithOverflow,
    convertToMinutesRange,
    formatBusinessHours,
    getDaysOfWeek,
    getDropdownList,
    getHoursList,
    isTimeEdited,
    splitTimeRange,
} from '../business-hours';

const mockLocalize = jest.fn(string => string);

describe('business-hours', () => {
    describe('convertToGMTWithOverflow', () => {
        it('should convert the times to GMT with overflow', () => {
            const result = convertToGMTWithOverflow([{ end_min: 1020, start_min: 540 }], 0);
            expect(result).toEqual([{ end_min: 1020, start_min: 540 }]);
        });

        it('should handle negative start and end times', () => {
            const result = convertToGMTWithOverflow([{ end_min: -60, start_min: -120 }], 0);
            const minutesInWeek = 7 * 24 * 60;
            const expected = [{ end_min: minutesInWeek - 60, start_min: minutesInWeek - 120 }];
            expect(result).toEqual(expected);
        });

        it('should handle overflow for start and end times', () => {
            const result = convertToGMTWithOverflow([{ end_min: 800, start_min: 1200 }], 0);
            expect(result).toEqual([
                { end_min: 10080, start_min: 1200 },
                { end_min: 800, start_min: 0 },
            ]);
        });
    });

    describe('convertToMinutesRange', () => {
        it('should return a time range in minutes', () => {
            // @ts-expect-error - not providing all required fields
            const result = convertToMinutesRange([{ end_time: '5:00 pm', start_time: '9:00 am', value: 'sunday' }]);
            expect(result).toEqual([{ end_min: 1020, start_min: 540 }]);
        });

        it('should return a time range in minutes and adjust special case if end_time is 12:00 am', () => {
            // @ts-expect-error - not providing all required fields
            const result = convertToMinutesRange([{ end_time: '12:00 am', start_time: '12:00 am', value: 'sunday' }]);
            expect(result).toEqual([{ end_min: 1440, start_min: 0 }]);
        });

        it('should handle the case where the end time is 12 AM and set it to the end of the particular day in minutes', () => {
            // @ts-expect-error - not providing all required fields
            const result = convertToMinutesRange([{ end_time: '12:00 am', start_time: '9:00 am', value: 'monday' }]);
            expect(result).toEqual([{ end_min: 2880, start_min: 1980 }]); // 2880 = 1440 * (1 + 1) for Monday
        });

        it('should return null if start_time is null', () => {
            // @ts-expect-error - not providing all required fields
            const result = convertToMinutesRange([{ end_time: '5:00 pm', start_time: null, value: 'sunday' }]);
            expect(result).toEqual([{ end_min: 1020, start_min: null }]);
        });
    });

    describe('formatBusinessHours', () => {
        it('should return a formatted time string for am', () => {
            const result = formatBusinessHours(1440);
            expect(result).toEqual('12:00 am');
        });

        it('should return a formatted time string for pm', () => {
            const result = formatBusinessHours(720);
            expect(result).toEqual('12:00 pm');
        });

        it('should return a formatted time string for special case', () => {
            const result = formatBusinessHours(0);
            expect(result).toEqual('12:00 am');
        });
    });

    describe('getDaysOfWeek', () => {
        it('should return an array of days of the week', () => {
            const result = getDaysOfWeek(mockLocalize);
            expect(result).toEqual({
                '0': { label: 'Sunday', shortLabel: 'S', value: 'sunday' },
                '1': { label: 'Monday', shortLabel: 'M', value: 'monday' },
                '2': { label: 'Tuesday', shortLabel: 'T', value: 'tuesday' },
                '3': { label: 'Wednesday', shortLabel: 'W', value: 'wednesday' },
                '4': { label: 'Thursday', shortLabel: 'T', value: 'thursday' },
                '5': { label: 'Friday', shortLabel: 'F', value: 'friday' },
                '6': { label: 'Saturday', shortLabel: 'S', value: 'saturday' },
            });
        });
    });

    describe('getDropdownList', () => {
        it('should return an array of dropdown options', () => {
            const timeList = [
                { text: '12:00 am', value: '12:00 am' },
                { text: '12:15 am', value: '12:15 am' },
            ];
            const result = getDropdownList(timeList, 'start', '12:00 am', false);
            expect(result).toEqual([
                { disabled: false, text: '12:00 am', value: '12:00 am' },
                { disabled: false, text: '12:15 am', value: '12:15 am' },
            ]);
        });

        it('should return an array of dropdown options with disabled options', () => {
            const timeList = [
                { text: '12:00 am', value: '12:00 am' },
                { text: '12:15 am', value: '12:15 am' },
            ];
            const result = getDropdownList(timeList, 'end', '12:00 am', true);
            expect(result).toEqual([
                { disabled: true, text: '12:00 am', value: '12:00 am' },
                { disabled: false, text: '12:15 am', value: '12:15 am' },
            ]);
        });
    });

    describe('getHoursList', () => {
        it('should return an array of time strings', () => {
            const result = getHoursList();
            expect(result).toEqual(
                expect.arrayContaining([
                    { text: '12:00 am', value: '12:00 am' },
                    { text: '12:15 am', value: '12:15 am' },
                    { text: '12:30 am', value: '12:30 am' },
                    { text: '12:45 am', value: '12:45 am' },
                    { text: '1:00 am', value: '1:00 am' },
                ])
            );
        });
    });

    describe('isTimeEdited', () => {
        it('should return true if data length is not equal to businessHours length', () => {
            const businessHours = [{ end_time: '5:00 pm', start_time: '9:00 am', value: 'sunday' }];
            const data = [
                { end_time: '5:00 pm', start_time: '9:00 am', value: 'sunday' },
                { end_time: null, start_time: null, value: 'monday' },
            ];
            // @ts-expect-error - not providing all required fields
            const result = isTimeEdited(businessHours, data);
            expect(result).toBeTruthy();
        });

        it('should return false if data does not match businessHours', () => {
            const businessHours = [{ end_time: '5:00 pm', start_time: '9:00 am', value: 'sunday' }];
            const data = [{ end_time: '5:00 pm', start_time: '9:00 am', value: 'monday' }];
            // @ts-expect-error - not providing all required fields
            const result = isTimeEdited(businessHours, data);
            expect(result).toBeFalsy();
        });

        it('should return true immediately if the first item is different', () => {
            const businessHours = [
                { end_time: '5:00 pm', start_time: '9:00 am', value: 'sunday' },
                { end_time: '6:00 pm', start_time: '10:00 am', value: 'monday' },
            ];
            const editedData = [
                { end_time: '6:00 pm', start_time: '9:00 am', value: 'sunday' }, // end_time is different
                { end_time: '6:00 pm', start_time: '10:00 am', value: 'monday' },
            ];
            // @ts-expect-error - not providing all required fields
            const result = isTimeEdited(businessHours, editedData);
            expect(result).toBeTruthy();
        });
    });

    describe('splitTimeRange', () => {
        it('should return an array of time ranges if schedule is empty', () => {
            const result = splitTimeRange([]);
            expect(result).toEqual([
                { end_min: 1440, start_min: 0 },
                { end_min: 2880, start_min: 1440 },
                { end_min: 4320, start_min: 2880 },
                { end_min: 5760, start_min: 4320 },
                { end_min: 7200, start_min: 5760 },
                { end_min: 8640, start_min: 7200 },
                { end_min: 10080, start_min: 8640 },
            ]);
        });

        it('should return an array of time ranges if schedule is not empty', () => {
            const schedule = [
                { end_min: 1440, start_min: 0 },
                { end_min: 10080, start_min: 2880 },
            ];

            const result = splitTimeRange(schedule);
            expect(result).toEqual([
                { end_min: 1440, start_min: 0 },
                { end_min: null, start_min: null },
                { end_min: 4320, start_min: 2880 },
                { end_min: 5760, start_min: 4320 },
                { end_min: 7200, start_min: 5760 },
                { end_min: 8640, start_min: 7200 },
                { end_min: 10080, start_min: 8640 },
            ]);
        });

        it('should add null objects if wrapAroundGap is greater than or equal to MINUTES_IN_DAY', () => {
            const schedule = [
                { end_min: 1440, start_min: 0 },
                { end_min: 4320, start_min: 2880 },
            ];

            const result = splitTimeRange(schedule);
            expect(result).toEqual([
                { end_min: 1440, start_min: 0 },
                { end_min: null, start_min: null },
                { end_min: 4320, start_min: 2880 },
                { end_min: null, start_min: null },
                { end_min: null, start_min: null },
                { end_min: null, start_min: null },
                { end_min: null, start_min: null },
            ]);
        });
    });
});
