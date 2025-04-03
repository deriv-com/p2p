import clsx from 'clsx';
import { toMoment } from '@/utils';
import { getDecade } from '../helpers';
import { CommonPropTypes } from './types';

const Years = ({ calendarDate, isPeriodDisabled, selectedDate, updateSelected }: CommonPropTypes) => {
    const momentSelected = toMoment(selectedDate);
    const momentDate = toMoment(calendarDate);
    const [startOfDecade, endOfDecade] = getDecade(momentDate).split('-');

    const years = [];
    for (let year = +startOfDecade - 1; year <= +endOfDecade + 1; year++) {
        years.push(year);
    }
    return (
        <div className='dc-calendar__body dc-calendar__body--year'>
            {years.map((year, idx) => {
                const isOtherDecade = idx === 0 || idx === 11;
                const isDisabled = isPeriodDisabled(momentDate.clone().year(year), 'year');
                return (
                    <span
                        className={clsx('dc-calendar__cell', {
                            'dc-calendar__cell--active': year === momentSelected.year(),
                            'dc-calendar__cell--disabled': isDisabled,
                            'dc-calendar__cell--other': isOtherDecade,
                        })}
                        data-year={year}
                        key={idx}
                        onClick={isDisabled ? undefined : e => updateSelected(e, 'year')}
                    >
                        {year}
                    </span>
                );
            })}
        </div>
    );
};

export default Years;
