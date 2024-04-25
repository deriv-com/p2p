import { ChangeEvent, ComponentProps, forwardRef, ReactNode, Ref, useState } from 'react';
import clsx from 'clsx';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './TextField.scss';

export interface TextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    disabled?: boolean;
    errorMessage?: string[] | string;
    isInvalid?: boolean;
    label?: string;
    renderLeftIcon?: () => ReactNode;
    renderRightIcon?: () => ReactNode;
    shouldShowWarningMessage?: boolean;
    showMessage?: boolean;
}

const TextField = forwardRef(
    (
        {
            defaultValue = '',
            disabled,
            errorMessage,
            isInvalid,
            label,
            maxLength,
            message,
            messageVariant = 'general',
            name = 'textField',
            onChange,
            renderLeftIcon,
            renderRightIcon,
            shouldShowWarningMessage = false,
            showMessage = false,
            ...rest
        }: TextFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
        const [value, setValue] = useState(defaultValue);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            onChange?.(e);
        };

        return (
            <div
                className={clsx('textfield', {
                    'textfield--disabled': disabled,
                    'textfield--error': isInvalid,
                })}
            >
                <div className='textfield__box'>
                    {typeof renderLeftIcon === 'function' && (
                        <div className='textfield__icon-left'>{renderLeftIcon()}</div>
                    )}
                    <input
                        className='textfield__field'
                        disabled={disabled}
                        id={name}
                        maxLength={maxLength}
                        onChange={handleChange}
                        placeholder={label}
                        ref={ref}
                        value={value}
                        {...rest}
                    />
                    {label && (
                        <label className='textfield__label' htmlFor={name}>
                            {label}
                        </label>
                    )}
                    {typeof renderRightIcon === 'function' && (
                        <div className='textfield__icon-right'>{renderRightIcon()}</div>
                    )}
                </div>
                <div className='textfield__message-container'>
                    {showMessage && !isInvalid && (
                        <HelperMessage
                            inputValue={value}
                            maxLength={maxLength}
                            message={message}
                            messageVariant={messageVariant}
                        />
                    )}
                    {errorMessage && (isInvalid || (!isInvalid && shouldShowWarningMessage)) && (
                        <HelperMessage
                            inputValue={value}
                            isError={isInvalid}
                            maxLength={maxLength}
                            message={errorMessage as string}
                            messageVariant={isInvalid ? 'error' : 'warning'}
                        />
                    )}
                </div>
            </div>
        );
    }
);

TextField.displayName = 'TextField';
export default TextField;
