import { ComponentProps } from 'react';
import clsx from 'clsx';
import { LabelPairedCalendarRangeMdRegularIcon, LegacyCalendarDateFrom1pxIcon } from '@deriv/quill-icons';
import { Input } from '@deriv-com/ui';
import './DateTextField.scss';

type TDateTextFieldProps = ComponentProps<typeof Input> & {
    alignedRight?: boolean;
};

const DateTextField = ({ alignedRight = false, label, value, ...rest }: TDateTextFieldProps) => {
    return (
        <div className='date-text-field__input'>
            <Input
                {...rest}
                className={clsx('date-text-field__input__field', {
                    'date-text-field__input__field--hidden': !!value,
                })}
                islabelAnimationDisabled
                label={value ? '' : label}
                leftPlaceholder={
                    !alignedRight && <LegacyCalendarDateFrom1pxIcon data-testid='dt_calendar_icon_left' iconSize='xs' />
                }
                readOnly
                rightPlaceholder={
                    alignedRight && <LabelPairedCalendarRangeMdRegularIcon data-testid='dt_calendar_icon_right' />
                }
                value={value}
                wrapperClassName='w-full'
            />
        </div>
    );
};

export default DateTextField;
