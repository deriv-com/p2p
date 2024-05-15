//TODO: to be replaced with derivcom component
import { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { LegacyCopy1pxIcon, LegacyWonIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';
import './Clipboard.scss';

type TClipboardProps = {
    textCopy: string;
};

const Clipboard = ({ textCopy }: TClipboardProps) => {
    const timeoutClipboardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    const { localize } = useTranslations();

    const onClick = (event: { stopPropagation: () => void }) => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboardRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    useEffect(() => {
        return () => {
            if (timeoutClipboardRef.current) {
                clearTimeout(timeoutClipboardRef.current);
            }
        };
    }, []);

    return (
        <Tooltip message={isCopied ? localize('Copied!') : localize('Copy')} position='top'>
            <button className='clipboard' onClick={onClick}>
                {isCopied ? <LegacyWonIcon iconSize='xs' /> : <LegacyCopy1pxIcon iconSize='xs' />}
            </button>
        </Tooltip>
    );
};

export default Clipboard;
