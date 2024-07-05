import { forwardRef, ReactElement } from 'react';
import clsx from 'clsx';
import { Text, useDevice } from '@deriv-com/ui';
import './Input.scss';

type TInputProps = {
    errorMessage?: string;
    hasError?: boolean;
    leadingIcon?: ReactElement;
    name: string;
    onBlur?: () => void;
    onChange?: () => void;
    placeholder?: string;
    value?: string;
};

const Input = forwardRef<HTMLInputElement, TInputProps>(
    ({ errorMessage, hasError, leadingIcon, onBlur, onChange, placeholder, value, ...props }, ref) => {
        const { isDesktop } = useDevice();

        return (
            <div className='input'>
                {leadingIcon && <div className='input__leading-icon'>{leadingIcon}</div>}
                <input
                    className={clsx('input__field', {
                        'input__field--error': hasError,
                    })}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder={placeholder}
                    ref={ref}
                    value={value}
                    {...props}
                />
                {hasError && (
                    <Text className='input__error' color='error' size={isDesktop ? 'xs' : 'sm'}>
                        {errorMessage}
                    </Text>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
