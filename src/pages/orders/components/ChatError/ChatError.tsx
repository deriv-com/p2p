import { MouseEventHandler } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';

type TChatErrorProps = {
    onClickRetry: MouseEventHandler<HTMLButtonElement>;
};

const ChatError = ({ onClickRetry }: TChatErrorProps) => {
    const { isDesktop } = useDevice();

    return (
        <div className='flex flex-col gap-[1.6rem] items-center'>
            <Text size={isDesktop ? 'md' : 'lg'}>
                <Localize i18n_default_text='Oops, something went wrong' />
            </Text>
            <Button className='w-fit' onClick={onClickRetry} variant='contained'>
                <Localize i18n_default_text='Retry' />
            </Button>
        </div>
    );
};

export default ChatError;
