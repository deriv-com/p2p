import { Fragment, memo, useRef, useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { useOnClickOutside } from 'usehooks-ts';
import { daysFromTodayTo, toMoment } from '@/utils';
import { LegacyCalendarDateFrom1pxIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Input, useDevice } from '@deriv-com/ui';
import TwoMonthPicker from './TwoMonthPicker/TwoMonthPicker';
import CompositeCalendarMobile from './CompositeCalendarMobile';
import { SideList } from './SideList';
import './CompositeCalendar.scss';

type TCompositeCalendar = {
    from: number;
    onChange: (values: { from?: moment.Moment; isBatch?: boolean; to?: moment.Moment }) => void;
    to: number;
};

const CompositeCalendar = (props: TCompositeCalendar) => {
    const { from, onChange, to } = props;
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const [showTo, setShowTo] = useState(false);
    const [showFrom, setShowFrom] = useState(false);
    const [list] = useState([
        {
            duration: 0,
            label: localize('All time'),
            onClick: () => selectDateRange(),
            value: 'all_time',
        },
        {
            duration: 7,
            label: localize('Last 7 days'),
            onClick: () => selectDateRange(7),
            value: 'last_7_days',
        },
        {
            duration: 30,
            label: localize('Last 30 days'),
            onClick: () => selectDateRange(30),
            value: 'last_30_days',
        },
        {
            duration: 60,
            label: localize('Last 60 days'),
            onClick: () => selectDateRange(60),
            value: 'last_60_days',
        },
        {
            duration: 90,
            label: localize('Last quarter'),
            onClick: () => selectDateRange(90),
            value: 'last_quarter',
        },
    ]);

    const wrapperRef = useRef<HTMLInputElement>(null);

    const selectDateRange = (newFrom?: number) => {
        hideCalendar();
        onChange({
            from: newFrom ? toMoment().startOf('day').subtract(newFrom, 'day').add(1, 's') : undefined,
            isBatch: true,
            to: toMoment().endOf('day'),
        });
    };

    const getToDateLabel = () => {
        const date = toMoment(to);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    };

    const getFromDateLabel = () => {
        const date = toMoment(from);
        return from ? date.format('MMM, DD YYYY') : localize('Date From');
    };

    const hideCalendar = () => {
        setShowFrom(false);
        setShowTo(false);
    };

    const showCalendar = (e: string) => {
        if (e === 'from') {
            setShowFrom(true);
            setShowTo(false);
        }
        if (e === 'to') {
            setShowTo(true);
            setShowFrom(false);
        }
    };

    useOnClickOutside(wrapperRef, event => {
        event?.stopPropagation();
        event?.preventDefault();
        hideCalendar();
    });

    const setToDate = (date: moment.MomentInput) => {
        onChange({ to: toMoment(date).endOf('day') });
    };

    const setFromDate = (date: moment.MomentInput) => {
        onChange({ from: toMoment(date) });
        hideCalendar();
    };

    const isPeriodDisabledTo = (date: moment.Moment) => {
        return date.unix() < from || date.unix() > toMoment().endOf('day').unix();
    };

    const isPeriodDisabledFrom = (date: moment.Moment) => date.unix() > to;

    if (isDesktop) {
        return (
            <Fragment>
                <div className='composite-calendar__input-fields' id='dt_composite_calendar_inputs'>
                    <Input
                        className={clsx({ 'composite-calendar__input-fields--selected': showFrom })}
                        id='dt_calendar_input_from'
                        leftPlaceholder={<LegacyCalendarDateFrom1pxIcon height={16} width={16} />}
                        onChange={() => {}}
                        onClick={() => showCalendar('from')}
                        readOnly
                        value={getFromDateLabel()}
                    />
                    <Input
                        className={clsx({ 'composite-calendar__input-fields--selected': showTo })}
                        id='dt_calendar_input_to'
                        leftPlaceholder={<LegacyCalendarDateFrom1pxIcon height={16} width={16} />}
                        onChange={() => {}}
                        onClick={() => showCalendar('to')}
                        readOnly
                        value={getToDateLabel()}
                    />
                </div>
                {showTo && (
                    <div className='composite-calendar' ref={wrapperRef}>
                        <SideList from={from} items={list} to={to} />
                        <TwoMonthPicker
                            isPeriodDisabled={isPeriodDisabledTo}
                            onChange={setToDate}
                            value={toMoment(to)}
                        />
                    </div>
                )}
                {showFrom && (
                    <div className='composite-calendar' ref={wrapperRef}>
                        <SideList from={from} items={list} to={to} />
                        <TwoMonthPicker
                            isPeriodDisabled={isPeriodDisabledFrom}
                            onChange={setFromDate}
                            value={toMoment(from)}
                        />
                    </div>
                )}
            </Fragment>
        );
    }

    return <CompositeCalendarMobile durationList={list} {...props} />;
};

CompositeCalendar.displayName = 'CompositeCalendar';

export default memo(CompositeCalendar);
