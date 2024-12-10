import clsx from 'clsx';
import { LabelPairedArrowRightLgBoldIcon, LabelPairedCheckMdBoldIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './Checklist.scss';

type TChecklistItem = {
    isDisabled?: boolean;
    onClick?: () => void;
    phoneNumber?: string | null;
    status: string;
    testId?: string;
    text: string;
};

const Checklist = ({ items }: { items: TChecklistItem[] }) => {
    const { isMobile } = useDevice();

    const getTextColor = (isDisabled: boolean | undefined, status: string) => {
        if (isDisabled) return 'less-prominent';
        if (status === 'rejected') return 'error';
        return 'general';
    };

    return (
        <div className='checklist'>
            {items.map(item => {
                const isDone = item.status === 'done';

                return (
                    <div className='checklist__item' key={item.text}>
                        <div className='checklist__item-text'>
                            <Text color={getTextColor(item.isDisabled, item.status)} size={isMobile ? 'md' : 'sm'}>
                                {item.text}
                            </Text>
                            {item.phoneNumber && (
                                <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                                    {item.phoneNumber}
                                </Text>
                            )}
                        </div>
                        <Button
                            className={clsx('checklist__item-button', {
                                'checklist__item-button--done': isDone,
                            })}
                            disabled={item.isDisabled}
                            icon={
                                isDone ? (
                                    <LabelPairedCheckMdBoldIcon className='checklist__item-checkmark-icon' />
                                ) : (
                                    <LabelPairedArrowRightLgBoldIcon
                                        className='checklist__item-button-icon'
                                        {...(item.testId && { 'data-testid': item.testId })}
                                    />
                                )
                            }
                            onClick={isDone ? undefined : item.onClick}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Checklist;
