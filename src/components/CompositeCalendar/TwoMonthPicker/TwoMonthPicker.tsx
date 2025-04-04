import React from 'react';
import moment from 'moment';
import { addMonths, diffInMonths, subMonths, toMoment } from '@/utils';
import { LegacyCalendarForward1pxIcon } from '@deriv/quill-icons';
import Calendar from '../Calendar';

type TTwoMonthPicker = {
    isPeriodDisabled: (date: moment.Moment) => boolean;
    onChange: (date: moment.MomentInput) => void;
    value: moment.Moment;
};

const TwoMonthPicker = React.memo(({ isPeriodDisabled, onChange, value }: TTwoMonthPicker) => {
    const [leftPaneDate, setLeftPaneDate] = React.useState(toMoment(value).clone().subtract(1, 'month'));
    const [rightPaneDate, setRightPaneDate] = React.useState(value);

    /**
     * Navigate from date
     *
     * @param {moment.Moment} date
     */
    const navigateFrom = (date: moment.Moment) => {
        setLeftPaneDate(date);
        setRightPaneDate(addMonths(date.toISOString(), 1));
    };

    /**
     * Navigate to date
     *
     * @param {moment.Moment} date
     */
    const navigateTo = (date: moment.Moment) => {
        setLeftPaneDate(subMonths(date.toISOString(), 1));
        setRightPaneDate(toMoment(date));
    };

    /**
     * Only allow previous months to be available to navigate. Disable other periods
     *
     * @param {moment.Moment} date
     */
    const validateFromArrows = (date: moment.Moment) => {
        return diffInMonths(toMoment(leftPaneDate), date) !== -1;
    };

    /**
     * Only allow next month to be available to navigate (unless next month is in the future).
     * Disable other periods
     *
     * @param {moment.Moment} date
     */
    const validateToArrows = (date: moment.Moment) => {
        const rDate = toMoment(rightPaneDate).startOf('month');
        if (diffInMonths(toMoment().startOf('month'), rDate) === 0) return true; // future months are disallowed
        return diffInMonths(rDate, date) !== 1;
    };

    /**
     * Validate values to be date_from < date_to
     *
     * @param {moment.Moment} date
     */
    const shouldDisableDate = (date: moment.Moment) => {
        return isPeriodDisabled(date);
    };

    const jumpToCurrentMonth = () => {
        setLeftPaneDate(toMoment().subtract(1, 'month'));
        setRightPaneDate(toMoment());
    };

    const updateSelectedDate = (e: React.MouseEvent<HTMLElement>) => {
        onChange(moment.utc(e.currentTarget.dataset.date, 'YYYY-MM-DD'));
    };

    return (
        <React.Fragment>
            <div className='first-month' data-testid='first-month'>
                <Calendar.Header
                    calendarDate={leftPaneDate}
                    calendarView='date'
                    hideDisabledPeriods
                    isPeriodDisabled={validateFromArrows}
                    navigateTo={navigateFrom}
                />
                <Calendar.Body
                    calendarDate={leftPaneDate}
                    calendarView='date'
                    dateFormat='YYYY-MM-DD'
                    hideOthers
                    isPeriodDisabled={shouldDisableDate}
                    selectedDate={value}
                    updateSelected={updateSelectedDate}
                />
            </div>
            <div className='second-month' data-testid='second-month'>
                <Calendar.Header
                    calendarDate={rightPaneDate}
                    calendarView='date'
                    hideDisabledPeriods
                    isPeriodDisabled={validateToArrows}
                    navigateTo={navigateTo}
                />
                <Calendar.Body
                    calendarDate={rightPaneDate}
                    calendarView='date'
                    dateFormat='YYYY-MM-DD'
                    hideOthers
                    isPeriodDisabled={shouldDisableDate}
                    selectedDate={value}
                    updateSelected={updateSelectedDate}
                />
                <Calendar.Footer
                    hasTodayBtn
                    onClick={jumpToCurrentMonth}
                    useIcon={<LegacyCalendarForward1pxIcon height={16} width={16} />}
                />
            </div>
        </React.Fragment>
    );
});

TwoMonthPicker.displayName = 'TwoMonthPicker';

export default TwoMonthPicker;
