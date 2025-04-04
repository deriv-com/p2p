import clsx from 'clsx';
import { toMoment } from '@/utils';
import { getCentury, getDecade } from '../helpers';
import { CommonPropTypes } from './types';

const Decades = ({ calendarDate, isPeriodDisabled, selectedDate, updateSelected }: CommonPropTypes) => {
    const momentSelected = toMoment(selectedDate);
    const momentDate = toMoment(calendarDate);
    const startYear = getCentury(momentDate).split('-')[0];

    const decades = [];
    let minYear = +startYear - 10;
    for (let i = 0; i < 12; i++) {
        const decade = getDecade(toMoment().year(minYear));
        decades.push(decade);
        minYear = +decade.split('-')[1] + 1;
    }
    return (
        <div className='dc-calendar__body dc-calendar__body--decade'>
            {decades.map((decade, idx) => {
                const [startOfDecade, endOfDecade] = decade.split('-');
                const isActive = +startOfDecade === momentSelected.year();
                const isDisabled =
                    isPeriodDisabled(momentDate.clone().year(+startOfDecade), 'year') &&
                    isPeriodDisabled(momentDate.clone().year(+endOfDecade), 'year');
                const isOtherCentury = idx === 0 || idx === 11;
                return (
                    <span
                        className={clsx('dc-calendar__cell', {
                            'dc-calendar__cell--active': isActive,
                            'dc-calendar__cell--disabled': isDisabled,
                            'dc-calendar__cell--other': isOtherCentury,
                        })}
                        data-years={decade} // data-years attribute contains a range of years selected on the calendar control e.g. 2011-2020
                        key={idx}
                        onClick={isDisabled ? undefined : e => updateSelected(e, 'years')}
                    >
                        {decade}
                    </span>
                );
            })}
        </div>
    );
};

export default Decades;
