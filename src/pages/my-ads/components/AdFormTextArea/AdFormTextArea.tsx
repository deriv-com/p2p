import { Controller, useFormContext } from 'react-hook-form';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { getTextFieldError } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { TextArea } from '@deriv-com/ui';
import './AdFormTextArea.scss';

type TAdFormTextAreaProps = {
    field: string;
    hint?: string;
    label: string;
    name: string;
    required?: boolean;
};
const AdFormTextArea = ({ field, hint = '', label, name, required = false }: TAdFormTextAreaProps) => {
    const { control } = useFormContext();
    const { localize } = useTranslations();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <div className='mb-[2.4rem] ad-form-textarea'>
                    <TextArea
                        hint={error ? error.message : hint}
                        isInvalid={!!error}
                        label={label}
                        maxLength={300}
                        onBlur={onBlur}
                        onChange={onChange}
                        shouldShowCounter
                        textSize='sm'
                        value={value}
                    />
                </div>
            )}
            rules={{
                pattern: {
                    message: getTextFieldError(field),
                    value: VALID_SYMBOLS_PATTERN,
                },
                required: required ? localize('{{field}} is required', { field }) : undefined,
            }}
        />
    );
};

export default AdFormTextArea;
