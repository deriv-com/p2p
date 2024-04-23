import { ComponentProps, FC, InputHTMLAttributes, memo } from 'react';
import { Text } from '@deriv-com/ui';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    isError?: boolean;
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
    messageVariant?: 'error' | 'general' | 'warning';
};

const HelperMessage: FC<HelperMessageProps> = memo(
    ({ inputValue, isError, maxLength, message, messageVariant = 'general' }) => {
        const HelperMessageColors: Record<string, ComponentProps<typeof Text>['color']> = {
            error: 'error',
            general: 'less-prominent',
            warning: 'warning',
        };

        return (
            <>
                {message && (
                    <div className='textfield__message-container--msg'>
                        <Text
                            color={isError ? HelperMessageColors.error : HelperMessageColors[messageVariant]}
                            size='xs'
                        >
                            {message}
                        </Text>
                    </div>
                )}
                {maxLength && (
                    <div className='textfield__message-container--maxchar'>
                        <Text align='right' color='less-prominent' size='xs'>
                            {inputValue?.toString().length || 0} / {maxLength}
                        </Text>
                    </div>
                )}
            </>
        );
    }
);

HelperMessage.displayName = 'HelperMessage';
export default HelperMessage;
