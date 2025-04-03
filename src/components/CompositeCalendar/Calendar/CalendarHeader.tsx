import { addMonths, addYears, subMonths, subYears, toMoment } from '@/utils';
import {
    LabelPairedChevronsLeftSmRegularIcon,
    LabelPairedChevronsRightSmRegularIcon,
    LegacyChevronLeft1pxIcon,
    LegacyChevronRight1pxIcon,
} from '@deriv/quill-icons';
import Button from './CalendarButton';
import { getCentury, getDecade } from './helpers';

type THeaderProps = {
    calendarDate: moment.MomentInput;
    calendarView: string;
    disableMonthSelector?: boolean;
    disableYearSelector?: boolean;
    hideDisabledPeriods?: boolean;
    isPeriodDisabled: (date: moment.Moment, unit: moment.unitOfTime.StartOf) => boolean;
    navigateTo: (newDate: moment.Moment) => void;
    switchView?: (newView: string) => void;
};

const Header = ({
    calendarDate,
    calendarView,
    disableMonthSelector,
    disableYearSelector,
    hideDisabledPeriods,
    isPeriodDisabled,
    navigateTo,
    switchView,
}: THeaderProps) => {
    const isDateView = calendarView === 'date';
    const isMonthView = calendarView === 'month';
    const isYearView = calendarView === 'year';
    const isDecadeView = calendarView === 'years';
    const momentDate = toMoment(calendarDate);

    let numOfYears = 1;
    if (isYearView) numOfYears = 10;
    if (isDecadeView) numOfYears = 100;

    const century = getCentury(momentDate.clone());
    const decade = getDecade(momentDate.clone());
    const endOfDecade = +(isYearView ? decade : century).split('-')[1];

    const isPrevMonthDisabled = isPeriodDisabled(subMonths(momentDate, 1), 'month');
    const isPrevYearDisabled = isPeriodDisabled(subYears(momentDate, numOfYears), 'month');
    const isNextMonthDisabled = isPeriodDisabled(addMonths(momentDate, 1), 'month');
    const isNextYearDisabled = isPeriodDisabled(addYears(momentDate, numOfYears), 'month');
    const isSelectYearDisabled = isPeriodDisabled(momentDate.clone().year(endOfDecade), 'year') || disableYearSelector;
    const shouldHideNextMonth = isNextMonthDisabled && hideDisabledPeriods;
    const shouldHidePrevMonth = isPrevMonthDisabled && hideDisabledPeriods;
    const shouldHidePrevYear = isPrevYearDisabled && hideDisabledPeriods;
    const shouldHideNextYear = isNextYearDisabled && hideDisabledPeriods;

    const onClickPrevYear = !(isPrevYearDisabled || shouldHidePrevYear)
        ? () => navigateTo(subYears(calendarDate, numOfYears))
        : undefined;

    const onClickNextYear = !(isNextYearDisabled || shouldHideNextYear)
        ? () => navigateTo(addYears(calendarDate, numOfYears))
        : undefined;

    const onClickPrevMonth = !(isPrevMonthDisabled || shouldHidePrevMonth)
        ? () => navigateTo(subMonths(calendarDate, 1))
        : undefined;

    const onClickNextMonth = !(isNextMonthDisabled || shouldHideNextMonth)
        ? () => navigateTo(addMonths(calendarDate, 1))
        : undefined;

    return (
        <div className='dc-calendar__header'>
            <Button
                className='dc-calendar__btn--prev-year'
                icon={
                    <LabelPairedChevronsLeftSmRegularIcon
                        fill={isPrevYearDisabled ? '#D6DADB' : '#000'}
                        height={16}
                        width={16}
                    />
                }
                isDisabled={isPrevYearDisabled}
                isHidden={shouldHidePrevYear}
                onClick={onClickPrevYear}
            />
            <Button
                className='dc-calendar__btn--prev-month'
                icon={
                    <LegacyChevronLeft1pxIcon fill={isPrevMonthDisabled ? '#D6DADB' : '#000'} height={16} width={16} />
                }
                isDisabled={isPrevMonthDisabled}
                isHidden={!isDateView || shouldHidePrevMonth}
                onClick={onClickPrevMonth}
            />

            <>
                {isDateView && (
                    <Button
                        className='dc-calendar__btn--select'
                        isDisabled={disableMonthSelector}
                        isHidden={!isDateView}
                        label={momentDate.format('MMM')}
                        onClick={() => (disableMonthSelector ? undefined : switchView?.('month'))}
                    />
                )}
                {(isDateView || isMonthView) && (
                    <Button
                        className='dc-calendar__btn--select'
                        isDisabled={isSelectYearDisabled}
                        label={momentDate.format('YYYY')}
                        onClick={() => (isSelectYearDisabled ? undefined : switchView?.('year'))}
                    />
                )}
                {(isYearView || isDecadeView) && (
                    <Button
                        className='dc-calendar__btn--select'
                        isDisabled={isSelectYearDisabled}
                        onClick={isSelectYearDisabled ? undefined : () => switchView?.('years')}
                    >
                        {isYearView && `${decade}`}
                        {isDecadeView && `${century}`}
                    </Button>
                )}
            </>

            <Button
                className='dc-calendar__btn--next-month'
                icon={
                    <LegacyChevronRight1pxIcon fill={isNextMonthDisabled ? '#D6DADB' : '#000'} height={16} width={16} />
                }
                isDisabled={isNextMonthDisabled}
                isHidden={!isDateView || shouldHideNextMonth}
                onClick={onClickNextMonth}
            />
            <Button
                className='dc-calendar__btn--next-year'
                icon={
                    <LabelPairedChevronsRightSmRegularIcon
                        fill={isNextYearDisabled ? '#D6DADB' : '#000'}
                        height={16}
                        width={16}
                    />
                }
                isDisabled={isNextYearDisabled}
                isHidden={shouldHideNextYear}
                onClick={onClickNextYear}
            />
        </div>
    );
};

export default Header;
