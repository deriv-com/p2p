import { Fragment, memo, useRef, useState } from 'react';
import moment from 'moment';
import Loadable from 'react-loadable';
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

type TTwoMonthPickerLoadable = {
    isPeriodDisabled: (date: moment.Moment) => boolean;
    onChange: (date: moment.Moment) => void;
    value: number;
};

const TwoMonthPickerLoadable = Loadable<TTwoMonthPickerLoadable, typeof TwoMonthPicker>({
    // @ts-expect-error import is not typed
    loader: () => import(/* webpackChunkName: "twoMonthPicker" */ './TwoMonthPicker/TwoMonthPicker'),
    loading: () => null,
    render(loaded, props) {
        // @ts-expect-error default is not typed
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

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
        }
        if (e === 'to') {
            setShowTo(true);
        }
    };

    useOnClickOutside(wrapperRef, event => {
        event?.stopPropagation();
        event?.preventDefault();
        hideCalendar();
    });

    const setToDate = (date: moment.Moment) => {
        onChange({ to: toMoment(date).endOf('day') });
    };

    const setFromDate = (date: moment.Moment) => {
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
                        id='dt_calendar_input_from'
                        leftPlaceholder={<LegacyCalendarDateFrom1pxIcon height={14} width={14} />}
                        onChange={() => {}}
                        onClick={() => showCalendar('from')}
                        readOnly
                        value={getFromDateLabel()}
                    />
                    <Input
                        id='dt_calendar_input_to'
                        leftPlaceholder={<LegacyCalendarDateFrom1pxIcon height={14} width={14} />}
                        onChange={() => {}}
                        onClick={() => showCalendar('to')}
                        readOnly
                        value={getToDateLabel()}
                    />
                </div>
                {showTo && (
                    <div className='composite-calendar' ref={wrapperRef}>
                        <SideList from={from} items={list} to={to} />
                        <TwoMonthPickerLoadable isPeriodDisabled={isPeriodDisabledTo} onChange={setToDate} value={to} />
                    </div>
                )}
                {showFrom && (
                    <div className='composite-calendar' ref={wrapperRef}>
                        <SideList from={from} items={list} to={to} />
                        <TwoMonthPickerLoadable
                            isPeriodDisabled={isPeriodDisabledFrom}
                            onChange={setFromDate}
                            value={from}
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
