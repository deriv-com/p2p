import React, { RefObject } from 'react';
import { getStartOfMonth, toMoment } from '@/utils';
import { getDate } from './helpers/constants';
import Body from './CalendarBody';
import Footer from './CalendarFooter';
import Header from './CalendarHeader';
// import './Calender.scss';

type TCalendarProps = {
    calendarElRef: RefObject<HTMLDivElement>;
    calendarView?: string;
    dateFormat?: string;
    disableDays?: number[];
    disabledDays?: number[];
    events?: {
        dates: string[];
        descrip: string;
    }[];
    footer?: string;
    hasRangeSelection?: boolean;
    hasTodayBtn?: boolean;
    holidays?: {
        dates: string[];
        descrip: string;
    }[];
    keepOpen?: boolean;
    maxDate?: string;
    minDate?: string;
    onChangeCalendarMonth?: (startOfMonth: string) => void;
    onHover?: (selectedDate: moment.MomentInput | null) => void;
    onSelect: (formattedDate: string, keepOpen: boolean) => void;
    shouldShowToday?: boolean;
    startDate?: string;
    value: string;
};

type TCalendarRef = {
    setSelectedDate?: (date: string) => void;
};

const Calendar = React.memo(
    React.forwardRef<TCalendarRef, TCalendarProps>(
        (
            {
                calendarElRef,
                calendarView,
                dateFormat = 'YYYY-MM-DD',
                disabledDays,
                events,
                footer = '',
                hasRangeSelection,
                hasTodayBtn,
                keepOpen,
                maxDate = toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, maxDate is set to 120 years after today
                minDate = '1970-01-01', // by default, minDate is set to Unix Epoch (January 1st 1970)
                onChangeCalendarMonth,
                onHover,
                onSelect,
                shouldShowToday,
                startDate = '',
                value,
            },
            ref
        ) => {
            const [calendarDate, setCalendarDate] = React.useState<string>(
                toMoment(value || startDate).format(dateFormat)
            ); // calendar date reference
            const [selectedDate, setSelectedDate] = React.useState<moment.MomentInput>(value); // selected date
            const [view, setView] = React.useState(calendarView || 'date');
            const [hoveredDate, setHoveredDate] = React.useState<string | null>('');

            React.useImperativeHandle(ref, () => ({
                setSelectedDate: (date: string) => {
                    const momentDate = toMoment(date).startOf('day');
                    const formattedDate = momentDate.format(dateFormat);
                    setCalendarDate(formattedDate);
                    setSelectedDate(formattedDate);
                },
            }));

            const navigateTo = (newDate: moment.MomentInput) => {
                setCalendarDate(toMoment(newDate).format(dateFormat));

                if (onChangeCalendarMonth) {
                    const startOfMonth = getStartOfMonth(newDate);
                    onChangeCalendarMonth(startOfMonth);
                }
            };

            const onMouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
                const target = event.currentTarget;

                if (
                    !target.classList.contains('dc-calendar__cell--disabled') &&
                    !target.classList.contains('dc-calendar__cell--hover')
                ) {
                    target.className += ' dc-calendar__cell--hover';
                    const newHoveredDate = target.getAttribute('data-date');
                    setHoveredDate(newHoveredDate);

                    if (onHover) {
                        onHover(newHoveredDate);
                    }
                }
            };

            const onMouseLeave = (event: React.MouseEvent<HTMLSpanElement>) => {
                const target = event.currentTarget;

                if (target.classList.contains('dc-calendar__cell--hover')) {
                    target.classList.remove('dc-calendar__cell--hover');

                    setHoveredDate(null);

                    if (onHover) {
                        onHover(selectedDate);
                    }
                }
            };

            const updateSelectedDate = (e: React.MouseEvent<HTMLSpanElement>) => {
                const momentDate = toMoment(e.currentTarget.dataset.date).startOf('day');
                const isBefore = momentDate.isBefore(toMoment(minDate));
                const isAfter = momentDate.isAfter(toMoment(maxDate));

                if (isBefore || isAfter) {
                    return;
                }

                const formattedDate = momentDate.format(dateFormat);
                setCalendarDate(formattedDate);
                setSelectedDate(formattedDate);

                if (onSelect) {
                    onSelect(formattedDate, !!keepOpen);
                }
            };

            const updateSelected = (e: React.MouseEvent<HTMLSpanElement>, type: moment.unitOfTime.StartOf) => {
                if (e) e.stopPropagation();

                if (type === 'day') {
                    updateSelectedDate(e);
                    return;
                }

                const viewMap: Record<string, string> = {
                    month: 'date',
                    year: 'month',
                    years: 'year',
                };

                let date = '';
                if (type) {
                    const selectedDatePart = e?.currentTarget?.dataset?.[type]?.split?.('-')?.[0] || 0;
                    date = getDate(toMoment(calendarDate), dateFormat, +selectedDatePart, type);
                }
                if (isPeriodDisabled(date, type)) return;

                setCalendarDate(date);
                setView(viewMap[type || '']);

                if (onChangeCalendarMonth) {
                    const startOfMonth = getStartOfMonth(date);
                    onChangeCalendarMonth(startOfMonth);
                }
            };

            const setToday = () => {
                const now = toMoment().format(dateFormat);
                setCalendarDate(now);
                setSelectedDate(now);
                setView('date');

                if (onSelect) {
                    onSelect(now, true);
                }
            };

            const isPeriodDisabled = (date: moment.Moment | string, unit: moment.unitOfTime.StartOf) => {
                const startOfPeriod = toMoment(date).clone().startOf(unit);
                const endOfPeriod = toMoment(date).clone().endOf(unit);
                return endOfPeriod.isBefore(toMoment(minDate)) || startOfPeriod.isAfter(toMoment(maxDate));
            };

            return (
                <div className='dc-calendar' data-value={selectedDate} ref={calendarElRef}>
                    <Header
                        calendarDate={calendarDate}
                        calendarView={view}
                        isPeriodDisabled={isPeriodDisabled}
                        navigateTo={navigateTo}
                        switchView={setView}
                    />
                    <Body
                        calendarDate={calendarDate}
                        calendarView={view}
                        dateFormat={dateFormat}
                        disabledDays={disabledDays}
                        events={events}
                        hasRangeSelection={hasRangeSelection}
                        hoveredDate={hoveredDate}
                        isPeriodDisabled={isPeriodDisabled}
                        onMouseLeave={onMouseLeave}
                        onMouseOver={onMouseOver}
                        selectedDate={selectedDate}
                        shouldShowToday={!!shouldShowToday}
                        startDate={startDate}
                        updateSelected={updateSelected}
                    />
                    <Footer footer={footer} hasTodayBtn={hasTodayBtn} onClick={setToday} />
                </div>
            );
        }
    )
) as React.MemoExoticComponent<React.ForwardRefExoticComponent<React.RefAttributes<TCalendarRef> & TCalendarProps>> & {
    Body: (props: React.ComponentProps<typeof Body>) => JSX.Element;
    Footer: (props: React.ComponentProps<typeof Footer>) => JSX.Element;
    Header: (props: React.ComponentProps<typeof Header>) => JSX.Element;
};

Calendar.displayName = 'Calendar';

Calendar.Body = Body;
Calendar.Header = Header;
Calendar.Footer = Footer;

export default Calendar;
