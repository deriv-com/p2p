/* eslint-disable sort-keys */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { LightDivider } from '@/components/LightDivider';
import { useGetBusinessHours } from '@/hooks';
import { isTimeEdited, TData } from '@/utils';
import { StandaloneArrowRotateLeftBoldIcon, StandaloneSortDownFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';
import { TimeDropdown } from './TimeDropdown';
import './BusinessHoursModalEdit.scss';

type TDayState = {
    [key: string]: boolean;
};

const initialDayStates: TDayState = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
};

const getDropdownOpenStates = (data: TData[]): TDayState => {
    const dayStates = { ...initialDayStates };

    data.forEach(item => {
        // Check if the item contains a valid day and has non-null start_time or end_time
        if (
            item.value in dayStates &&
            (item.start_time !== null || item.end_time !== null) &&
            item.start_time !== item.end_time
        ) {
            dayStates[item.value] = true;
        }
    });

    return dayStates;
};

const FULL_DAY = '12:00 am';

type TBusinessHoursModalEditProps = {
    editedBusinessHours: TData[];
    isDisabled: boolean;
    setEditedBusinessHours: (data: TData[]) => void;
    setIsDisabled: (isDisabled: boolean) => void;
};

const BusinessHoursModalEdit = ({
    editedBusinessHours,
    isDisabled,
    setEditedBusinessHours,
    setIsDisabled,
}: TBusinessHoursModalEditProps) => {
    const { isDesktop, isMobile } = useDevice();
    const { localize } = useTranslations();
    const { businessHours } = useGetBusinessHours();
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [dropdownOpenStates, setDropdownOpenStates] = useState<TDayState>(getDropdownOpenStates(editedBusinessHours));
    const today = new Date().getDay() - 1;
    const textSize = isMobile ? 'sm' : 'xs';

    useEffect(() => {
        const filteredDays = editedBusinessHours
            .filter(day => day.start_time !== null || day.end_time !== null)
            .map(day => day.value);
        setSelectedDays(filteredDays);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const isEdited = isTimeEdited(businessHours, editedBusinessHours);
        if (isDisabled !== !isEdited) setIsDisabled(!isEdited);
        if (selectedDays.length === 0) setIsDisabled(true);
    }, [businessHours, editedBusinessHours, isDisabled, selectedDays.length, setIsDisabled]);

    const toggleDropdown = (value: string) => {
        setDropdownOpenStates({
            ...dropdownOpenStates,
            [value]: !dropdownOpenStates[value],
        });
    };

    const onClickDay = (value: string) => {
        // Add the day if it's not in the list, otherwise remove it and also set the start_time and end_time to null in edited_data
        const newSelectedDays = selectedDays.includes(value)
            ? selectedDays.filter(day => day !== value)
            : [...selectedDays, value];

        const newEditedData = editedBusinessHours.map(day => {
            if (day.value === value) {
                return {
                    ...day,
                    start_time: selectedDays.includes(value) ? null : FULL_DAY,
                    end_time: selectedDays.includes(value) ? null : FULL_DAY,
                };
            }
            return day;
        });

        if (dropdownOpenStates[value]) toggleDropdown(value);
        setSelectedDays(newSelectedDays);
        setEditedBusinessHours(newEditedData);
    };

    const onSelectTime = (time: string, value: string, startTime = true) => {
        const newEditedData = editedBusinessHours.map(day => {
            if (day.value === value) {
                if (startTime) {
                    return {
                        ...day,
                        start_time: time,
                    };
                }
                return {
                    ...day,
                    end_time: time,
                };
            }
            return day;
        });

        setEditedBusinessHours(newEditedData);
    };

    const onReset = (value: string) => {
        const newEditedData = editedBusinessHours.map(day => {
            if (day.value === value) {
                toggleDropdown(value);
                return {
                    ...day,
                    start_time: FULL_DAY,
                    end_time: FULL_DAY,
                };
            }
            return day;
        });

        setEditedBusinessHours(newEditedData);
    };

    return (
        <div className='lg:p-0 p-[1.6rem]'>
            <div className='flex gap-[0.8rem]'>
                {editedBusinessHours.map(day => {
                    const includesDay = selectedDays.includes(day.value);

                    return (
                        <Text
                            as='button'
                            className={clsx('business-hours-modal-edit__circle', {
                                'business-hours-modal-edit__circle--unselected': !includesDay,
                            })}
                            color={includesDay ? 'white' : 'general'}
                            key={day.value}
                            onClick={() => onClickDay(day.value)}
                            size={isMobile ? 'md' : 'sm'}
                        >
                            {day.short_day}
                        </Text>
                    );
                })}
            </div>
            <LightDivider className='my-[1.6rem]' />
            <div className='flex flex-col gap-[0.8rem]'>
                {editedBusinessHours.map((day, index) => {
                    const isToday = index === today;
                    const textWeight = isToday ? 'bold' : 'normal';
                    const includesDay = selectedDays.includes(day.value);
                    const areTimesNull = day.start_time === null && day.end_time === null;
                    const isFullDay = day.start_time === day.end_time;
                    const isDisabled = !includesDay || isFullDay;

                    return (
                        <div className='flex items-center justify-between' key={`${day.value}_${day.start_time}`}>
                            <Text className={clsx({ 'opacity-40': !includesDay })} size={textSize} weight={textWeight}>
                                {day.day}
                            </Text>
                            <div className='flex items-center relative w-9/12'>
                                {(includesDay && !areTimesNull && !isFullDay) || dropdownOpenStates[day.value] ? (
                                    <TimeDropdown
                                        day={day.value}
                                        endTime={day.end_time ?? ''}
                                        isToday={isToday}
                                        onSelectTime={onSelectTime}
                                        startTime={day.start_time ?? ''}
                                    />
                                ) : (
                                    <div
                                        className={clsx('business-hours-modal-edit__open-24', {
                                            'cursor-not-allowed opacity-40': !includesDay,
                                        })}
                                        onClick={() => includesDay && toggleDropdown(day.value)}
                                        role='button'
                                    >
                                        <Text size={textSize} weight={textWeight}>
                                            <Localize i18n_default_text='Open 24 hours' />
                                        </Text>
                                        <StandaloneSortDownFillIcon fill='#999999' iconSize='xs' viewBox='0 5 32 32' />
                                    </div>
                                )}
                                <Tooltip
                                    as='button'
                                    className={clsx('hover:bg-transparent', {
                                        'cursor-not-allowed': isDisabled,
                                    })}
                                    hideTooltip={!isDesktop}
                                    onClick={() => !isDisabled && onReset(day.value)}
                                    tooltipContent={localize('Reset to default hours')}
                                >
                                    <StandaloneArrowRotateLeftBoldIcon
                                        className={clsx('rotate-45 m-[0.8rem]', {
                                            'opacity-30': isDisabled,
                                        })}
                                        data-testid={`dt_reset_icon_${day.value}`}
                                        iconSize='xs'
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BusinessHoursModalEdit;
