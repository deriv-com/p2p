import clsx from 'clsx';
import { toMoment } from '@/utils';
import { CommonPropTypes } from './types';

const Months = ({ calendarDate, isPeriodDisabled, selectedDate, updateSelected }: CommonPropTypes) => {
    const momentDate = toMoment(calendarDate);
    const momentSelectedDate = toMoment(selectedDate);
    const isSameYear = momentSelectedDate.isSame(momentDate, 'year');
    const selectedMonthNumber = Number(momentSelectedDate.clone().format('M'));
    const monthNumbers = [...Array(12).keys()];

    return (
        <div className='dc-calendar__body dc-calendar__body--month'>
            {monthNumbers.map(monthNumber => {
                const month = momentDate.clone().month(monthNumber);
                const isActive = isSameYear && selectedMonthNumber === monthNumber + 1;
                const isDisabled = isPeriodDisabled(month, 'month');

                return (
                    <span
                        className={clsx('dc-calendar__cell', {
                            'dc-calendar__cell--active': isActive,
                            'dc-calendar__cell--disabled': isDisabled,
                        })}
                        data-month={monthNumber}
                        key={monthNumber}
                        onClick={isDisabled ? undefined : e => updateSelected(e, 'month')}
                    >
                        {month.format('MMM')}
                    </span>
                );
            })}
        </div>
    );
};

export default Months;
