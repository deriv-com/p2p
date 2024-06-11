import { ComponentProps } from 'react';
import clsx from 'clsx';
import { LabelPairedCalendarRangeMdRegularIcon, LegacyCalendarDateFrom1pxIcon } from '@deriv/quill-icons';
import { Input } from '@deriv-com/ui';
import './DateTextField.scss';

export interface TFlowFieldProps extends ComponentProps<typeof Input> {
    alignedRight?: boolean;
}

const DateTextField = ({ alignedRight = false, label, value, ...rest }: TFlowFieldProps) => {
    return (
        <div className='date-text-field__input'>
            <Input
                {...rest}
                className={clsx('date-text-field__input__field', {
                    'date-text-field__input__field--hidden': !!value,
                })}
                islabelAnimationDisabled
                label={value ? '' : label}
                leftPlaceholder={!alignedRight && <LegacyCalendarDateFrom1pxIcon iconSize='xs' />}
                readOnly
                rightPlaceholder={alignedRight && <LabelPairedCalendarRangeMdRegularIcon />}
                value={value}
                wrapperClassName='w-full'
            />
        </div>
    );
};

export default DateTextField;
