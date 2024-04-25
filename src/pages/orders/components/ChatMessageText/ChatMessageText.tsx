import { memo, PropsWithChildren } from 'react';
import { TTextColors } from 'types';
import { Text, useDevice } from '@deriv-com/ui';
import './ChatMessageText.scss';

type TChatMessageTextProps = {
    color: TTextColors;
    type?: string;
};

const ChatMessageText = ({ children, color, type = '' }: PropsWithChildren<TChatMessageTextProps>) => {
    const { isDesktop } = useDevice();
    return (
        <div className='chat-message-text'>
            <Text color={color} lineHeight='xl' size={type === 'admin' && isDesktop ? 'xs' : 'sm'}>
                {children}
            </Text>
        </div>
    );
};

export default memo(ChatMessageText);
