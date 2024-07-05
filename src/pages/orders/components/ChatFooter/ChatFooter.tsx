import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Input, Text, useDevice } from '@deriv-com/ui';
import ChatFooterIcon from '../ChatFooterIcon/ChatFooterIcon';
import { TextAreaWithIcon } from '../TextAreaWithIcon';

interface DocumentWithSelection extends Document {
    selection?: {
        createRange?: () => Range;
    };
}

type TChatFooterProps = {
    isClosed: boolean;
    sendFile: (file: File) => void;
    sendMessage: (message: string) => void;
};
const ChatFooter = ({ isClosed, sendFile, sendMessage }: TChatFooterProps) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const [value, setValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textInputRef = useRef<HTMLTextAreaElement | null>(null);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    };
    if (isClosed) {
        return (
            <div className='flex justify-center lg:px-[2.4rem] lg:py-[1.6rem]'>
                <Text size={isDesktop ? 'sm' : 'md'}>
                    <Localize i18n_default_text='This conversation is closed' />
                </Text>
            </div>
        );
    }

    const sendChatMessage = () => {
        const elTarget = textInputRef.current;
        const shouldRestoreFocus = document.activeElement === elTarget;

        if (elTarget?.value) {
            sendMessage(elTarget.value);
            elTarget.value = '';
            setValue('');

            if (shouldRestoreFocus) {
                elTarget.focus();
            }
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && isDesktop) {
            if (event.ctrlKey || event.metaKey) {
                const element = event.currentTarget;
                const { value } = element;

                if (typeof element.selectionStart === 'number' && typeof element.selectionEnd === 'number') {
                    element.value = `${value.slice(0, element.selectionStart)}\n${value.slice(element.selectionEnd)}`;
                } else {
                    // Fallback for IE
                    const documentWithSelection = document as DocumentWithSelection;
                    if (documentWithSelection.selection?.createRange) {
                        // IE specific logic to insert newline at cursor position
                        const range = documentWithSelection.selection.createRange();
                        const newlineNode = document.createTextNode('\r\n');
                        range.insertNode(newlineNode);
                        range.collapse(false);
                        range.selectNode(newlineNode); // Fix: Use selectNode instead of select
                    }
                }
            } else {
                event.preventDefault();
                sendChatMessage();
            }
        }
    };

    return (
        <div className='px-[2.4rem] pt-[1.6rem] pb-[2.8rem] w-full'>
            <TextAreaWithIcon
                icon={
                    <ChatFooterIcon
                        length={value.length}
                        onClick={() => (value.length > 0 ? sendChatMessage() : fileInputRef.current?.click())}
                    />
                }
                maxLength={5000}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={localize('Enter message')}
                ref={ref => (textInputRef.current = ref)}
                shouldShowCounter
                value={value}
            />
            <div className='hidden'>
                <Input
                    data-testid='dt_file_input'
                    name='file'
                    onChange={e => {
                        if (e.target.files?.[0]) {
                            sendFile(e.target.files[0]);
                        }
                    }}
                    ref={el => (fileInputRef.current = el)}
                    type='file'
                />
            </div>
        </div>
    );
};

export default ChatFooter;
