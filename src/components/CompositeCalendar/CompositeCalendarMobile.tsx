import { Fragment, memo, useState } from 'react';
import clsx from 'clsx';
import { toMoment } from '@/utils';
import { LegacyCalendarDateRange1pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Input, Text } from '@deriv-com/ui';
import { DatePicker } from '../DatePicker';
import { FullPageMobileWrapper } from '../FullPageMobileWrapper';

type TInputDateRange = {
    duration?: number;
    label?: string;
    onClick?: () => void;
    value?: string;
};

type TRadioButton = {
    className?: string;
    id: string;
    label?: string;
    onChange: (value: { label?: string; value?: string }) => void;
    selectedValue?: string;
    value?: string;
};

export const RadioButton = ({ className, id, label, onChange, selectedValue, value }: TRadioButton) => {
    return (
        <label
            className={clsx('composite-calendar-modal__radio', className, {
                'composite-calendar-modal__radio--selected': selectedValue === value,
            })}
            htmlFor={id}
            onClick={() => onChange({ label, value })}
        >
            <input className='composite-calendar-modal__radio-input' id={id} type='radio' value={value} />
            <span
                className={clsx('composite-calendar-modal__radio-circle', {
                    'composite-calendar-modal__radio-circle--selected': selectedValue === value,
                })}
            />
            <Text as='p' color='prominent' line_height='unset' weight={selectedValue === value ? 'bold' : 'normal'}>
                {label}
            </Text>
        </label>
    );
};
const CUSTOM_KEY = 'custom';

type TCompositeCalendarMobile = {
    durationList?: TInputDateRange[];
    from: number;
    inputDateRange?: TInputDateRange;
    onChange: (
        value: { from?: moment.Moment; isBatch?: boolean; to?: moment.Moment },
        extra_data?: { dateRange: TInputDateRange }
    ) => void;
    to: number;
};

const CompositeCalendarMobile = memo(
    ({ durationList, from, inputDateRange, onChange, to }: TCompositeCalendarMobile) => {
        const { localize } = useTranslations();
        const dateRange = inputDateRange || durationList?.find(range => range.value === 'all_time');

        const [fromDate, setFrom] = useState(from ? toMoment(from).format('YYYY-MM-DD') : undefined);
        const [toDate, setTo] = useState(to ? toMoment(to).format('YYYY-MM-DD') : undefined);
        const [isOpen, setIsOpen] = useState(false);

        const [appliedDateRange, setAppliedDateRange] = useState(dateRange);
        const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
        const today = toMoment().format('YYYY-MM-DD');

        const selectDateRange = (_selectedDateRange: TInputDateRange, isToday?: boolean) => {
            const newFrom = _selectedDateRange.duration;
            onChange(
                {
                    from:
                        isToday || newFrom ? toMoment().startOf('day').subtract(newFrom, 'day').add(1, 's') : undefined,
                    isBatch: true,
                    to: toMoment().endOf('day'),
                },
                {
                    dateRange: _selectedDateRange,
                }
            );
        };

        const selectCustomDateRange = () => {
            const newFrom = fromDate || toDate || today;
            const newTo = toDate || today;

            const newDateRange = Object.assign(selectedDateRange as TInputDateRange, {
                label: `${toMoment(newFrom).format('DD MMM YYYY')} - ${toMoment(newTo).format('DD MMM YYYY')}`,
            });

            onChange(
                {
                    from: toMoment(newFrom).startOf('day').add(1, 's'),
                    isBatch: true,
                    to: toMoment(newTo).endOf('day'),
                },
                {
                    dateRange: newDateRange,
                }
            );
        };

        const applyDateRange = () => {
            if (selectedDateRange?.onClick) {
                selectDateRange(selectedDateRange);
            } else if (selectedDateRange?.value === CUSTOM_KEY) {
                selectCustomDateRange();
            }
            setAppliedDateRange(selectedDateRange);
            setIsOpen(false);
        };

        const getMobileFooter = () => {
            return (
                <div className='composite-calendar-modal__actions'>
                    <Button
                        className='composite-calendar-modal__actions__cancel'
                        color='black'
                        onClick={() => setIsOpen(false)}
                        size='lg'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button
                        className='composite-calendar-modal__actions__ok'
                        onClick={applyDateRange}
                        size='lg'
                        variant='contained'
                    >
                        <Localize i18n_default_text='OK' />
                    </Button>
                </div>
            );
        };

        const onDateRangeChange = (_dateRange: TInputDateRange) => {
            setSelectedDateRange(
                durationList?.find(range => _dateRange && range.value === _dateRange.value) || _dateRange
            );
        };

        const openDialog = () => {
            setSelectedDateRange(appliedDateRange);
            setIsOpen(true);
        };

        return (
            <Fragment>
                <div className='composite-calendar__input-fields composite-calendar__input-fields--fill mt-6'>
                    <Input
                        id='dt_calendar_input'
                        leftPlaceholder={
                            <LegacyCalendarDateRange1pxIcon className='inline-icon' height={14} width={14} />
                        }
                        onClick={openDialog}
                        readOnly
                        value={appliedDateRange?.label ?? ''}
                    />
                </div>
                {isOpen && (
                    <FullPageMobileWrapper
                        className='composite-calendar-modal__full-page-modal'
                        onBack={() => setIsOpen(false)}
                        renderFooter={getMobileFooter}
                        renderHeader={() => (
                            <Text size='lg' weight='bold'>
                                <Localize i18n_default_text='Please select duration' />
                            </Text>
                        )}
                    >
                        <div className='composite-calendar-modal'>
                            <div className='composite-calendar-modal__radio-group'>
                                {durationList?.map(duration => (
                                    <RadioButton
                                        id={`composite-calendar-modal__radio__${duration.value}`}
                                        key={duration.value}
                                        label={duration.label}
                                        onChange={onDateRangeChange}
                                        selectedValue={selectedDateRange?.value}
                                        value={duration.value}
                                    />
                                ))}
                            </div>
                            <div className='composite-calendar-modal__custom'>
                                <RadioButton
                                    className='composite-calendar-modal__custom-radio'
                                    id={'composite-calendar-modal__custom-radio'}
                                    label={localize('Custom')}
                                    onChange={onDateRangeChange}
                                    selectedValue={selectedDateRange?.value}
                                    value={CUSTOM_KEY}
                                />
                                <div className='composite-calendar-modal__custom-date-range'>
                                    <DatePicker
                                        alignedRight
                                        label={localize('Date from')}
                                        maxDate={toDate ? new Date(toDate) : new Date()}
                                        name='from-date'
                                        onDateChange={setFrom}
                                        showLabel
                                        value={fromDate || ''}
                                    />
                                    <DatePicker
                                        alignedRight
                                        label={localize('Today')}
                                        maxDate={new Date()}
                                        minDate={fromDate ? new Date(fromDate) : undefined}
                                        name='to-date'
                                        onDateChange={setTo}
                                        rightAlignment
                                        value={toDate || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </FullPageMobileWrapper>
                )}
            </Fragment>
        );
    }
);

CompositeCalendarMobile.displayName = 'CompositeCalendarMobile';
export default CompositeCalendarMobile;
